export const isYouTubeId = (value: string) => /^[a-zA-Z0-9_-]{11}$/.test(value);

/**
 * Extracts a YouTube video ID from various URL formats or returns the input if already an ID.
 * Examples:
 *  - "dQw4w9WgXcQ" -> "dQw4w9WgXcQ"
 *  - "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -> "dQw4w9WgXcQ"
 *  - "https://youtu.be/dQw4w9WgXcQ" -> "dQw4w9WgXcQ"
 *  - "https://www.youtube.com/embed/dQw4w9WgXcQ" -> "dQw4w9WgXcQ"
 */
export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  const trimmed = urlOrId.trim();

  // If already an 11-char ID
  if (isYouTubeId(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(
      trimmed.includes("://") ? trimmed : `https://${trimmed}`
    );
    const host = url.hostname;
    const [, path, id] = url.pathname.split("/");
    if (host === "youtu.be" && isYouTubeId(path ?? "")) return path;
    if (
      host === "youtube.com" ||
      host.endsWith(".youtube.com") ||
      host === "youtube-nocookie.com" ||
      host.endsWith(".youtube-nocookie.com")
    ) {
      const videoId =
        url.searchParams.get("v") ??
        (["embed", "shorts", "live", "v", "e"].includes(path) ? id : "");
      if (videoId && isYouTubeId(videoId)) return videoId;
    }
  } catch {
    // A direct audio path can be relative.
  }
  return trimmed;
}

export function isDirectAudioUrl(value: string) {
  const url = value.trim();
  if (!/^(?:https?:\/\/|\.{0,2}\/)/i.test(url) || url.includes("\\"))
    return false;
  try {
    const { protocol, hostname } = new URL(url, "https://example.invalid");
    return (
      (protocol === "https:" || protocol === "http:") &&
      !/(?:^|\.)(?:youtube\.com|youtube-nocookie\.com|youtu\.be)$/i.test(
        hostname
      )
    );
  } catch {
    return false;
  }
}

export interface YouTubePlayer {
  destroy(): void;
  loadVideoById(id: string): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  getPlayerState(): number;
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(time: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  isMuted(): boolean;
  mute(): void;
  unMute(): void;
}

interface YouTubeApi {
  Player: new (
    element: HTMLElement,
    options: {
      width?: number;
      height?: number;
      videoId?: string;
      playerVars?: Record<string, string | number>;
      events: {
        onReady?: (event: { target: YouTubePlayer }) => void;
        onStateChange?: (event: { data: number }) => void;
        onError?: (event: { data: number }) => void;
        onAutoplayBlocked?: () => void;
      };
    }
  ) => YouTubePlayer;
  PlayerState: {
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    ENDED: number;
  };
}

export function getYouTubeApi() {
  const api = (window as Window & { YT?: YouTubeApi }).YT;
  return typeof api?.Player === "function" ? api : undefined;
}

let apiRequest: Promise<void> | undefined;

/** Load the shared YouTube script and wait until its player constructor is ready. */
export function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined" || getYouTubeApi())
    return Promise.resolve();
  if (apiRequest) return apiRequest;

  apiRequest = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById("youtube-iframe-api");
    const script = existing ?? document.createElement("script");
    const fail = () => {
      cleanup();
      if (!existing) script.remove();
      reject(new Error("YouTube iframe API failed to load"));
    };
    const poll = window.setInterval(() => {
      if (!getYouTubeApi()) return;
      cleanup();
      resolve();
    }, 100);
    const timeout = window.setTimeout(fail, 10000);

    function cleanup() {
      window.clearInterval(poll);
      window.clearTimeout(timeout);
      script.removeEventListener("error", fail);
    }
    script.addEventListener("error", fail);

    if (!existing && script instanceof HTMLScriptElement) {
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  }).finally(() => {
    apiRequest = undefined;
  });
  return apiRequest;
}
