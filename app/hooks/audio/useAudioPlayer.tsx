import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import { useEventListener, useHapticFeedback } from "@/hooks";
import { useSettings, VOLUME_KEY, ShuffleMode, RepeatMode } from "..";
import { IpodEvent } from "@/utils/events";

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

export const AudioPlayerContext = createContext<AudioPlayerState>({} as AudioPlayerState);

type AudioPlayerHook = AudioPlayerState;

export const useAudioPlayer = (): AudioPlayerHook => useContext(AudioPlayerContext);

interface Props {
  children: React.ReactNode;
}

export const AudioPlayerProvider = ({ children }: Props) => {
  const { shuffleMode, repeatMode, setShuffleMode, setRepeatMode } = useSettings();
  const [player, setPlayer] = useState<any>(null);
  const [volume, setVolumeState] = useState(50);
  const [nowPlayingItem, setNowPlayingItem] = useState<MediaApi.MediaItem | undefined>();
  const [playbackInfo, setPlaybackInfo] = useState(defaultPlaybackInfoState);
  
  const [queue, setQueue] = useState<MediaApi.Song[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const { triggerHaptics } = useHapticFeedback();
  const lastSeekTimeRef = useRef(0);

  const skipNextRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    const initYT = () => {
      const ytPlayer = new (window as any).YT.Player("youtube-player", {
        height: "0",
        width: "0",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
        },
        events: {
          onReady: () => {
            setPlayer(ytPlayer);
            const savedVol = parseFloat(localStorage.getItem(VOLUME_KEY) ?? "0.5");
            ytPlayer.setVolume(savedVol * 100);
            setVolumeState(savedVol * 100);
          },
          onStateChange: (event: any) => {
            const YTState = (window as any).YT.PlayerState;
            const state = event.data;

            if (state === YTState.PLAYING) {
              setPlaybackInfo((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
            } else if (state === YTState.PAUSED) {
              setPlaybackInfo((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
            } else if (state === YTState.BUFFERING) {
              // Keep showing play icon during buffering to prevent flashing
              setPlaybackInfo((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
            }

            // Auto-advance
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              skipNextRef.current();
            }
          },
        },
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initYT();
    } else {
      (window as any).onYouTubeIframeAPIReady = initYT;
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (playbackInfo.isPlaying && player) {
      interval = setInterval(() => {
        if (performance.now() - lastSeekTimeRef.current < 1500) return;

        const currentTime = player.getCurrentTime() || 0;
        const duration = player.getDuration() || 0;
        const timeRemaining = duration - currentTime;
        const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
        setPlaybackInfo(prev => ({
          ...prev,
          currentTime,
          duration,
          timeRemaining,
          percent
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playbackInfo.isPlaying, player]);

  const play = useCallback(async (queueOptions: MediaApi.QueueOptions) => {
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

    setQueue(newQueue);
    setQueueIndex(startIndex);
    const song = newQueue[startIndex];
    setNowPlayingItem(song as MediaApi.MediaItem);

    if (player) {
      player.loadVideoById(song.url);
      player.playVideo();
    }
  }, [player]);

  const pause = useCallback(async () => {
    if (player) player.pauseVideo();
  }, [player]);

  const togglePlayPause = useCallback(async () => {
    if (!player) return;
    const state = player.getPlayerState();
    const YTState = (window as any).YT.PlayerState;
    if (state === YTState.PLAYING || state === YTState.BUFFERING) {
      setPlaybackInfo((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
      player.pauseVideo();
    } else {
      setPlaybackInfo((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
      player.playVideo();
    }
  }, [player]);

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
    const song = queue[nextIndex];
    setNowPlayingItem(song as MediaApi.MediaItem);
    
    if (player) {
      player.loadVideoById(song.url);
      player.playVideo();
    }
  }, [player, queue, queueIndex, repeatMode, shuffleMode]);

  useEffect(() => {
    skipNextRef.current = skipNext;
  }, [skipNext]);

  const skipPrevious = useCallback(async () => {
    if (queue.length === 0) return;
    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      if (repeatMode === "all") prevIndex = queue.length - 1;
      else prevIndex = 0;
    }
    setQueueIndex(prevIndex);
    const song = queue[prevIndex];
    setNowPlayingItem(song as MediaApi.MediaItem);
    
    if (player) {
      player.loadVideoById(song.url);
      player.playVideo();
    }
  }, [player, queue, queueIndex, repeatMode]);

  const seekToTime = useCallback(async (time: number) => {
    if (player) {
      lastSeekTimeRef.current = performance.now();
      player.seekTo(time, true);
      setPlaybackInfo(prev => {
        const duration = prev.duration;
        const timeRemaining = duration - time;
        const percent = duration > 0 ? (time / duration) * 100 : 0;
        return {
          ...prev,
          currentTime: time,
          timeRemaining,
          percent
        };
      });
    }
  }, [player]);

  const setVolume = useCallback((newVolume: number) => {
    if (player) {
      player.setVolume(newVolume * 100);
      setVolumeState(newVolume * 100);
      localStorage.setItem(VOLUME_KEY, `${newVolume}`);
    }
  }, [player]);

  const handleSetShuffleMode = useCallback(async (mode: ShuffleMode) => {
    setShuffleMode(mode);
  }, [setShuffleMode]);

  const handleSetRepeatMode = useCallback(async (mode: RepeatMode) => {
    setRepeatMode(mode);
  }, [setRepeatMode]);

  const updateNowPlayingItem = useCallback(async () => {}, []);
  const updatePlaybackInfo = useCallback(async () => {}, []);

  const reset = useCallback(() => {
    if (player) player.stopVideo();
    setPlaybackInfo(defaultPlaybackInfoState);
    setQueue([]);
    setNowPlayingItem(undefined);
  }, [player]);

  const handlePlayPauseClick = useCallback(() => {
    triggerHaptics();
    togglePlayPause();
  }, [togglePlayPause, triggerHaptics]);

  const handleSkipNext = useCallback(() => {
    triggerHaptics();
    skipNext();
  }, [skipNext, triggerHaptics]);

  const handleSkipPrevious = useCallback(() => {
    triggerHaptics();
    skipPrevious();
  }, [skipPrevious, triggerHaptics]);

  useEventListener<IpodEvent>("playpauseclick", handlePlayPauseClick);
  useEventListener<IpodEvent>("forwardclick", handleSkipNext);
  useEventListener<IpodEvent>("backwardclick", handleSkipPrevious);

  // Enviar estado do player para o iframe parent
  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({
        type: "IPOD_STATE_CHANGE",
        payload: {
          isPlaying: playbackInfo.isPlaying,
          track: nowPlayingItem?.name ?? "",
          artist: nowPlayingItem?.artistName ?? "",
          isMuted
        }
      }, "*");
    }
  }, [playbackInfo.isPlaying, nowPlayingItem, isMuted]);

  // Escutar comandos vindos do iframe parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || !event.data.type) return;

      switch (event.data.type) {
        case "IPOD_PLAY":
          if (player && typeof player.playVideo === "function") {
            setPlaybackInfo((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
            player.playVideo();
          }
          break;
        case "IPOD_PAUSE":
          if (player && typeof player.pauseVideo === "function") {
            setPlaybackInfo((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
            player.pauseVideo();
          }
          break;
        case "IPOD_NEXT":
          skipNextRef.current();
          break;
        case "IPOD_PREV":
          skipPrevious();
          break;
        case "IPOD_TOGGLE_MUTE":
          if (player) {
            if (typeof player.isMuted === "function" && player.isMuted()) {
              player.unMute();
              setIsMuted(false);
            } else if (typeof player.mute === "function") {
              player.mute();
              setIsMuted(true);
            }
          }
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [player, skipPrevious]);

  return (
    <AudioPlayerContext.Provider
      value={{
        playbackInfo,
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
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default useAudioPlayer;
