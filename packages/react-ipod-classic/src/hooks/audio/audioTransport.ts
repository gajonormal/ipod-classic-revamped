import type { YouTubePlayer } from "@/utils/youtube";

export interface AudioTransport {
  load(url: string): void;
  play(): void;
  pause(): void;
  stop(): void;
  isPlaying(): boolean;
  getCurrentTime(): number;
  getDuration(): number;
  seek(time: number): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
}

export function createFileTransport(
  audio: HTMLAudioElement,
  onPlayError: (error: unknown) => void
): AudioTransport {
  function play() {
    const url = audio.getAttribute("src");
    void audio.play().catch((error: unknown) => {
      if (
        audio.getAttribute("src") === url &&
        !(error instanceof DOMException && error.name === "AbortError")
      ) {
        onPlayError(error);
      }
    });
  }

  return {
    load(url) {
      audio.src = url;
      play();
    },
    play,
    pause: () => audio.pause(),
    stop() {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    },
    isPlaying: () => !audio.paused && !audio.ended,
    getCurrentTime: () => audio.currentTime,
    getDuration: () => (Number.isFinite(audio.duration) ? audio.duration : 0),
    seek: (time) => {
      audio.currentTime = time;
    },
    setVolume: (volume) => {
      audio.volume = volume / 100;
    },
    setMuted: (muted) => {
      audio.muted = muted;
    },
  };
}

export function createYouTubeTransport(
  player: YouTubePlayer,
  states: { PLAYING: number; BUFFERING: number }
): AudioTransport {
  return {
    load: (id) => player.loadVideoById(id),
    play: () => player.playVideo(),
    pause: () => player.pauseVideo(),
    stop: () => player.stopVideo(),
    isPlaying() {
      const state = player.getPlayerState();
      return state === states.PLAYING || state === states.BUFFERING;
    },
    getCurrentTime: () => player.getCurrentTime(),
    getDuration: () => player.getDuration(),
    seek: (time) => player.seekTo(time, true),
    setVolume: (volume) => player.setVolume(volume),
    setMuted: (muted) => {
      if (muted) player.mute();
      else player.unMute();
    },
  };
}
