import type { MediaApi } from "@/types/Media.API";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import { useEventListener, useHapticFeedback, useViewContext } from "@/hooks";
import { useSettings, VOLUME_KEY, ShuffleMode, RepeatMode } from "..";
import { useMusicLibrary } from "@/providers/MusicLibraryProvider";
import { IpodEvent } from "@/utils/events";
import { IpodEventsContext } from "@/providers/IpodEventsContext";
import {
  getYouTubeApi,
  isDirectAudioUrl,
  isYouTubeId,
  loadYouTubeIframeApi,
  type YouTubePlayer,
} from "@/utils/youtube";
import {
  createFileTransport,
  createYouTubeTransport,
  type AudioTransport,
} from "./audioTransport";

const defaultPlaybackInfoState = {
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  currentTime: 0,
  timeRemaining: 0,
  percent: 0,
  duration: 0,
};

interface AudioPlayerState {
  playbackInfo: typeof defaultPlaybackInfoState;
  playbackError?: string;
  nowPlayingItem?: MediaApi.MediaItem;
  volume: number;
  shuffleMode: ShuffleMode;
  repeatMode: RepeatMode;
  play: (queueOptions: MediaApi.QueueOptions) => Promise<void>;
  pause: () => Promise<void>;
  seekToTime: (time: number) => Promise<void>;
  setVolume: (volume: number) => void;
  setShuffleMode: (mode: ShuffleMode) => Promise<void>;
  setRepeatMode: (mode: RepeatMode) => Promise<void>;
  skipNext: () => Promise<void>;
  skipPrevious: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  updateNowPlayingItem: () => Promise<void>;
  updatePlaybackInfo: () => Promise<void>;
  reset: () => void;
}

export const AudioPlayerContext = createContext<AudioPlayerState>(
  {} as AudioPlayerState
);

type AudioPlayerHook = AudioPlayerState;

export const useAudioPlayer = (): AudioPlayerHook =>
  useContext(AudioPlayerContext);

function getParentOrigin(origin?: string) {
  if (window.parent === window) return undefined;

  try {
    const url = new URL(
      origin ?? (document.referrer || window.location.origin)
    );
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.origin
      : undefined;
  } catch {
    return undefined;
  }
}

interface Props {
  children: React.ReactNode;
  parentOrigin?: string;
  onSongChange?: (song: MediaApi.MediaItem) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export const AudioPlayerProvider = ({
  children,
  parentOrigin,
  onSongChange,
  onPlayStateChange,
}: Props) => {
  const interactive = useContext(IpodEventsContext) !== null;
  const { viewStack } = useViewContext();
  const videoOpen = viewStack.at(-1)?.id === "videoPlayer";
  const { shuffleMode, repeatMode, setShuffleMode, setRepeatMode } =
    useSettings();
  const { songs: librarySongs, isLoading: libraryLoading } = useMusicLibrary();
  const playerHost = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const player = useRef<AudioTransport | undefined>(undefined);
  const filePlayer = useRef<AudioTransport | undefined>(undefined);
  const youtubePlayer = useRef<AudioTransport | undefined>(undefined);
  const activeSource = useRef<"audio" | "youtube" | undefined>(undefined);
  const [youtubeRequested, setYouTubeRequested] = useState(false);
  const [youtubeAttempt, setYouTubeAttempt] = useState(0);
  const youtubeInitFailed = useRef(false);
  const needsYouTube =
    youtubeRequested ||
    (!libraryLoading && librarySongs.some((song) => isYouTubeId(song.url)));
  const pendingTrack = useRef<MediaApi.Song | undefined>(undefined);
  const [volume, setVolumeState] = useState(50);
  const volumeRef = useRef(50);
  const [nowPlayingItem, setNowPlayingItem] = useState<
    MediaApi.MediaItem | undefined
  >();
  const [playbackInfo, setPlaybackInfo] = useState(defaultPlaybackInfoState);
  const [playbackError, setPlaybackError] = useState<string>();

  const [queue, setQueue] = useState<MediaApi.Song[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const mutedRef = useRef(false);

  const { triggerHaptics } = useHapticFeedback();
  const lastSeekTimeRef = useRef(0);

  const onTrackEnded = useRef<() => void>(() => {});

  const failPlayback = useCallback((message: string) => {
    setPlaybackInfo((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      isLoading: false,
    }));
    setPlaybackError(message);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      const stored = Number.parseFloat(localStorage.getItem(VOLUME_KEY) ?? "");
      if (Number.isFinite(stored)) {
        volumeRef.current = Math.max(0, Math.min(1, stored)) * 100;
        setVolumeState(volumeRef.current);
      }
    } catch {
      // Storage can be disabled in an embedded player.
    }
    return () => {
      filePlayer.current?.stop();
      filePlayer.current = undefined;
    };
  }, [interactive]);

  useEffect(() => {
    const host = playerHost.current;
    if (!interactive || !needsYouTube || !host) return;
    let disposed = false;
    let activePlayer: YouTubePlayer | undefined;
    youtubeInitFailed.current = false;

    void loadYouTubeIframeApi()
      .then(() => {
        const youtube = getYouTubeApi();
        if (disposed || !youtube) return;
        const target = document.createElement("div");
        host.appendChild(target);

        activePlayer = new youtube.Player(target, {
          height: 0,
          width: 0,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
          },
          events: {
            onReady: ({ target: readyPlayer }) => {
              if (disposed) return;
              const transport = createYouTubeTransport(
                readyPlayer,
                youtube.PlayerState
              );
              youtubePlayer.current = transport;
              const pending = pendingTrack.current;
              if (activeSource.current !== "youtube" || !pending) return;
              player.current = transport;
              transport.setVolume(volumeRef.current);
              transport.setMuted(mutedRef.current);
              pendingTrack.current = undefined;
              transport.load(pending.url);
            },
            onStateChange: ({ data }) => {
              if (disposed || activeSource.current !== "youtube") return;
              const states = youtube.PlayerState;
              if (data === states.ENDED) {
                onTrackEnded.current();
              } else if (
                data === states.PLAYING ||
                data === states.BUFFERING ||
                data === states.PAUSED
              ) {
                if (data === states.PLAYING) setPlaybackError(undefined);
                setPlaybackInfo((prev) => ({
                  ...prev,
                  isPlaying: data !== states.PAUSED,
                  isPaused: data === states.PAUSED,
                  isLoading: data === states.BUFFERING,
                }));
              }
            },
            onError: ({ data }) => {
              if (disposed || activeSource.current !== "youtube") return;
              console.warn("YouTube audio playback failed:", data);
              failPlayback(
                data === 101 || data === 150
                  ? "This track is unavailable in the YouTube embed."
                  : "YouTube could not play this track."
              );
            },
            onAutoplayBlocked: () => {
              if (!disposed && activeSource.current === "youtube")
                failPlayback("Playback was blocked. Press Play to retry.");
            },
          },
        });
      })
      .catch((error) => {
        if (disposed) return;
        youtubeInitFailed.current = true;
        console.warn("Could not initialize YouTube audio:", error);
        if (activeSource.current === "youtube")
          failPlayback("Could not connect to YouTube. Press Play to retry.");
      });

    return () => {
      disposed = true;
      activePlayer?.destroy();
      host.replaceChildren();
      if (player.current === youtubePlayer.current) player.current = undefined;
      youtubePlayer.current = undefined;
    };
  }, [failPlayback, interactive, needsYouTube, youtubeAttempt]);

  const loadTrack = useCallback(
    (song: MediaApi.Song) => {
      const source = isYouTubeId(song.url) ? "youtube" : "audio";
      if (source !== activeSource.current) {
        const previous = player.current;
        activeSource.current = source;
        previous?.stop();
      }
      pendingTrack.current = undefined;
      lastSeekTimeRef.current = -Infinity;
      setNowPlayingItem(song);
      setPlaybackError(undefined);
      setPlaybackInfo({ ...defaultPlaybackInfoState, isLoading: true });

      if (source === "audio") {
        const audio = audioRef.current;
        if (!audio || !isDirectAudioUrl(song.url)) {
          player.current?.stop();
          player.current = undefined;
          failPlayback("This track has an invalid audio URL.");
          return;
        }
        filePlayer.current ??= createFileTransport(audio, (error) => {
          if (activeSource.current !== "audio") return;
          failPlayback(
            error instanceof DOMException && error.name === "NotAllowedError"
              ? "Playback was blocked. Press Play to retry."
              : "Could not play this audio file."
          );
        });
      } else {
        setYouTubeRequested(true);
      }

      const transport =
        source === "audio" ? filePlayer.current : youtubePlayer.current;
      player.current = transport;
      if (transport) {
        transport.setVolume(volumeRef.current);
        transport.setMuted(mutedRef.current);
        transport.load(song.url);
      } else if (source === "youtube") {
        pendingTrack.current = song;
        if (youtubeInitFailed.current)
          setYouTubeAttempt((attempt) => attempt + 1);
      }
    },
    [failPlayback]
  );

  const updatePlaybackInfo = useCallback(async () => {
    const transport = player.current;
    if (!transport || performance.now() - lastSeekTimeRef.current < 1500)
      return;

    const currentTime = transport.getCurrentTime() || 0;
    const duration = transport.getDuration() || 0;
    setPlaybackInfo((prev) => ({
      ...prev,
      currentTime,
      duration,
      timeRemaining: Math.max(0, duration - currentTime),
      percent: duration > 0 ? (currentTime / duration) * 100 : 0,
    }));
  }, []);

  useEffect(() => {
    if (!playbackInfo.isPlaying) return;
    const interval = setInterval(updatePlaybackInfo, 1000);
    return () => clearInterval(interval);
  }, [playbackInfo.isPlaying, updatePlaybackInfo]);

  const play = useCallback(
    async (queueOptions: MediaApi.QueueOptions) => {
      let newQueue: MediaApi.Song[] = [];
      let startIndex = queueOptions.startPosition ?? 0;

      if (queueOptions.album?.songs) {
        newQueue = queueOptions.album.songs;
      } else if (queueOptions.playlist?.songs) {
        newQueue = queueOptions.playlist.songs;
      } else if (queueOptions.songs) {
        newQueue = queueOptions.songs;
      } else if (queueOptions.song) {
        newQueue = [queueOptions.song];
        startIndex = 0;
      }

      if (newQueue.length === 0) return;

      const validIndex =
        Number.isInteger(startIndex) &&
        startIndex >= 0 &&
        startIndex < newQueue.length
          ? startIndex
          : 0;
      setQueue(newQueue);
      setQueueIndex(validIndex);
      loadTrack(newQueue[validIndex]);
    },
    [loadTrack]
  );

  const pause = useCallback(async () => {
    if (pendingTrack.current) {
      pendingTrack.current = undefined;
      setPlaybackInfo((prev) => ({
        ...prev,
        isLoading: false,
        isPaused: true,
      }));
    }
    player.current?.pause();
  }, []);

  const resume = useCallback(() => {
    if (pendingTrack.current && !playbackError) return;
    const song = queue[queueIndex];
    if (song && (playbackError || !player.current)) {
      loadTrack(song);
    } else {
      player.current?.play();
    }
  }, [loadTrack, playbackError, queue, queueIndex]);

  const togglePlayPause = useCallback(async () => {
    if (!nowPlayingItem) {
      if (queue.length > 0) await play({ songs: queue });
      else if (!libraryLoading) await play({ songs: librarySongs });
      return;
    }

    if (
      !playbackError &&
      (pendingTrack.current || player.current?.isPlaying())
    ) {
      await pause();
    } else {
      resume();
    }
  }, [
    nowPlayingItem,
    queue,
    libraryLoading,
    librarySongs,
    play,
    playbackError,
    pause,
    resume,
  ]);

  const skipNext = useCallback(async () => {
    if (queue.length === 0) return;
    let nextIndex = queueIndex + 1;

    // Simple shuffle mode logic fallback
    if (shuffleMode !== "off") {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      if (repeatMode === "all") nextIndex = 0;
      else return; // end of queue
    }

    setQueueIndex(nextIndex);
    loadTrack(queue[nextIndex]);
  }, [loadTrack, queue, queueIndex, repeatMode, shuffleMode]);

  useEffect(() => {
    onTrackEnded.current = () => {
      if (repeatMode === "one" && queue[queueIndex]) {
        loadTrack(queue[queueIndex]);
        return;
      }

      setPlaybackInfo((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        isLoading: false,
        currentTime: prev.duration,
        timeRemaining: 0,
        percent: prev.duration > 0 ? 100 : 0,
      }));
      void skipNext();
    };
  }, [loadTrack, queue, queueIndex, repeatMode, skipNext]);

  const skipPrevious = useCallback(async () => {
    if (queue.length === 0) return;
    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      if (repeatMode === "all") prevIndex = queue.length - 1;
      else prevIndex = 0;
    }
    setQueueIndex(prevIndex);
    loadTrack(queue[prevIndex]);
  }, [loadTrack, queue, queueIndex, repeatMode]);

  const seekToTime = useCallback(async (time: number) => {
    const transport = player.current;
    if (transport && Number.isFinite(time)) {
      const position = Math.max(
        0,
        Math.min(time, transport.getDuration() || 0)
      );
      lastSeekTimeRef.current = performance.now();
      transport.seek(position);
      setPlaybackInfo((prev) => {
        const duration = prev.duration;
        const timeRemaining = Math.max(0, duration - position);
        const percent = duration > 0 ? (position / duration) * 100 : 0;
        return {
          ...prev,
          currentTime: position,
          timeRemaining,
          percent,
        };
      });
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (!Number.isFinite(newVolume)) return;
    const nextVolume = Math.max(0, Math.min(1, newVolume));
    volumeRef.current = nextVolume * 100;
    player.current?.setVolume(volumeRef.current);
    setVolumeState(volumeRef.current);
    try {
      localStorage.setItem(VOLUME_KEY, `${nextVolume}`);
    } catch {
      // The current session volume still works without storage.
    }
  }, []);

  const handleSetShuffleMode = useCallback(
    async (mode: ShuffleMode) => {
      setShuffleMode(mode);
    },
    [setShuffleMode]
  );

  const handleSetRepeatMode = useCallback(
    async (mode: RepeatMode) => {
      setRepeatMode(mode);
    },
    [setRepeatMode]
  );

  const updateNowPlayingItem = useCallback(async () => {
    setNowPlayingItem(queue[queueIndex]);
  }, [queue, queueIndex]);

  const reset = useCallback(() => {
    pendingTrack.current = undefined;
    activeSource.current = undefined;
    player.current?.stop();
    player.current = undefined;
    setPlaybackInfo(defaultPlaybackInfoState);
    setPlaybackError(undefined);
    setQueue([]);
    setNowPlayingItem(undefined);
  }, []);

  const handlePlayPauseClick = useCallback(() => {
    if (videoOpen) return;
    triggerHaptics();
    togglePlayPause();
  }, [togglePlayPause, triggerHaptics, videoOpen]);

  const handleSkipNext = useCallback(() => {
    if (videoOpen) return;
    triggerHaptics();
    skipNext();
  }, [skipNext, triggerHaptics, videoOpen]);

  const handleSkipPrevious = useCallback(() => {
    if (videoOpen) return;
    triggerHaptics();
    skipPrevious();
  }, [skipPrevious, triggerHaptics, videoOpen]);

  useEventListener<IpodEvent>("playpauseclick", handlePlayPauseClick);
  useEventListener<IpodEvent>("forwardclick", handleSkipNext);
  useEventListener<IpodEvent>("backwardclick", handleSkipPrevious);

  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(playbackInfo.isPlaying && !playbackInfo.isPaused);
    }
  }, [playbackInfo.isPlaying, playbackInfo.isPaused, onPlayStateChange]);

  useEffect(() => {
    if (onSongChange && nowPlayingItem) {
      onSongChange(nowPlayingItem);
    }
  }, [nowPlayingItem, onSongChange]);

  useEffect(() => {
    if (!interactive) return;
    const origin = getParentOrigin(parentOrigin);
    if (!origin) return;

    window.parent.postMessage(
      {
        type: "IPOD_STATE_CHANGE",
        payload: {
          isPlaying: playbackInfo.isPlaying,
          track: nowPlayingItem?.name ?? "",
          artist: nowPlayingItem?.artistName ?? "",
          isMuted,
        },
      },
      origin
    );
  }, [
    interactive,
    parentOrigin,
    playbackInfo.isPlaying,
    nowPlayingItem,
    isMuted,
  ]);

  useEffect(() => {
    if (!interactive) return;
    const origin = getParentOrigin(parentOrigin);
    if (!origin) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || event.origin !== origin) return;
      switch (event.data?.type) {
        case "IPOD_PLAY":
          if (nowPlayingItem) resume();
          else if (!libraryLoading) void play({ songs: librarySongs });
          break;
        case "IPOD_PAUSE":
          void pause();
          break;
        case "IPOD_NEXT":
          void skipNext();
          break;
        case "IPOD_PREV":
          void skipPrevious();
          break;
        case "IPOD_TOGGLE_MUTE":
          mutedRef.current = !mutedRef.current;
          player.current?.setMuted(mutedRef.current);
          setIsMuted(mutedRef.current);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [
    interactive,
    parentOrigin,
    nowPlayingItem,
    librarySongs,
    libraryLoading,
    play,
    resume,
    pause,
    skipNext,
    skipPrevious,
  ]);

  return (
    <AudioPlayerContext.Provider
      value={{
        playbackInfo,
        playbackError,
        nowPlayingItem,
        volume: volume / 100,
        shuffleMode,
        repeatMode,
        play,
        pause,
        seekToTime,
        setVolume,
        setShuffleMode: handleSetShuffleMode,
        setRepeatMode: handleSetRepeatMode,
        skipNext,
        skipPrevious,
        togglePlayPause,
        updateNowPlayingItem,
        updatePlaybackInfo,
        reset,
      }}
    >
      {interactive && (
        <>
          <div ref={playerHost} hidden />
          <audio
            ref={audioRef}
            preload="none"
            onPlaying={() => {
              if (activeSource.current !== "audio") return;
              setPlaybackError(undefined);
              setPlaybackInfo((prev) => ({
                ...prev,
                isPlaying: true,
                isPaused: false,
                isLoading: false,
              }));
              void updatePlaybackInfo();
            }}
            onWaiting={(event) => {
              if (
                activeSource.current === "audio" &&
                !event.currentTarget.paused
              )
                setPlaybackInfo((prev) => ({ ...prev, isLoading: true }));
            }}
            onPause={(event) => {
              if (
                activeSource.current === "audio" &&
                event.currentTarget.paused &&
                !event.currentTarget.ended
              ) {
                setPlaybackInfo((prev) => ({
                  ...prev,
                  isPlaying: false,
                  isPaused: true,
                  isLoading: false,
                }));
              }
            }}
            onEnded={() => {
              if (activeSource.current === "audio") onTrackEnded.current();
            }}
            onError={(event) => {
              if (activeSource.current === "audio" && event.currentTarget.error)
                failPlayback("Could not play this audio file.");
            }}
          />
        </>
      )}
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default useAudioPlayer;
