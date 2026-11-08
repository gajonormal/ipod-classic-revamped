// Public Components
export { Ipod } from "./components/Ipod";
export type { IpodProps } from "./components/Ipod/Ipod";

import FloatingIpod from "./components/FloatingIpod/FloatingIpod";
export { FloatingIpod };
export default FloatingIpod;
export type {
  FloatingIpodProps,
  FloatingPosition,
} from "./components/FloatingIpod";

// Providers & Hooks
export {
  MusicLibraryProvider,
  useMusicLibrary,
} from "./providers/MusicLibraryProvider";
export type { MusicLibraryContextType } from "./providers/MusicLibraryProvider";

export { useAudioPlayer } from "./hooks/audio/useAudioPlayer";
export { useSettings } from "./hooks/utils/useSettings";

// Utilities
export { extractYouTubeId, loadYouTubeIframeApi } from "./utils/youtube";
export { getTheme } from "./utils/themes";
export type { DeviceThemeName } from "./utils/themes";

// Types
export type {
  IpodSong,
  IpodPlaylist,
  IpodAlbum,
} from "./types/custom";

