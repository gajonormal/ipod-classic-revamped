// Public Components
import FloatingIpod from "./components/FloatingIpod/FloatingIpod";

export { Ipod } from "./components/Ipod";
export type { IpodProps } from "./components/Ipod/Ipod";
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
export type { IpodSong, IpodPlaylist, IpodAlbum } from "./types/custom";
export type { MediaApi } from "./types/Media.API";
