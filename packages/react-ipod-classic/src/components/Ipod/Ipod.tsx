"use client";
import type { MediaApi } from "@/types/Media.API";
import React, { memo, useState } from "react";
import {
  AudioPlayerProvider,
  SettingsContext,
  SettingsProvider,
  useEffectOnce,
} from "@/hooks";
import { ClickWheel, ViewManager } from "@/components";
import {
  ScreenContainer,
  ClickWheelContainer,
  Shell,
  Sticker,
  Sticker2,
  Sticker3,
} from "@/components/Ipod/Styled";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ViewContextProvider from "@/providers/ViewContextProvider";
import { MusicLibraryProvider } from "@/providers/MusicLibraryProvider";
import { GlobalStyles } from "@/components/Ipod/GlobalStyles";
import { ResponsiveWrapper } from "./ResponsiveWrapper";
import { IpodSong, IpodPlaylist, IpodAlbum } from "@/types/custom";
import { DeviceThemeName } from "@/utils/themes";
import { IpodEventsContext } from "@/providers/IpodEventsContext";

export interface IpodProps {
  /** Render a decorative device without input listeners or audio playback. */
  interactive?: boolean;
  /** Trusted parent origin for iframe controls. Defaults to the embedding page origin when available. */
  parentOrigin?: string;
  /** Custom songs list with direct audio URLs, YouTube IDs or YouTube URLs. */
  songs?: IpodSong[];
  /** Remote URL to a JSON array of songs */
  songsUrl?: string;
  /** Custom playlists */
  playlists?: IpodPlaylist[];
  /** Custom albums */
  albums?: IpodAlbum[];
  /** Initial device theme ('black' | 'silver' | 'u2' | 'mnelia') */
  theme?: DeviceThemeName;
  /** Whether to show mirror reflection below the iPod */
  showReflection?: boolean;
  /** Disable initial pop-in animation */
  disableAnimation?: boolean;
  /** @deprecated Reserved for compatibility. Does not initialize a sign-in flow. */
  googleClientId?: string;
  /** Callback fired whenever the current playing song changes */
  onSongChange?: (song: MediaApi.Song) => void;
  /** Callback fired whenever play/pause state changes */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** Custom CSS class for the container */
  className?: string;
  /** Custom styles for the container */
  style?: React.CSSProperties;
}

const Ipod: React.FC<IpodProps> = ({
  interactive = true,
  parentOrigin,
  songs,
  songsUrl,
  playlists,
  albums,
  theme,
  showReflection = false,
  disableAnimation = false,
  onSongChange,
  onPlayStateChange,
  className,
  style,
}) => {
  const [events] = useState(() => new EventTarget());
  const [queryClient] = useState(() => new QueryClient());
  const [isLoading, setIsLoading] = useState(true);

  useEffectOnce(() => setIsLoading(false));

  if (isLoading) {
    return null;
  }

  const content = (
    <IpodEventsContext.Provider value={interactive ? events : null}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyles />
        <MusicLibraryProvider
          songs={songs}
          songsUrl={songsUrl}
          playlists={playlists}
          albums={albums}
        >
          <SettingsProvider initialTheme={theme}>
            <ViewContextProvider>
              <AudioPlayerProvider
                parentOrigin={parentOrigin}
                onSongChange={onSongChange}
                onPlayStateChange={onPlayStateChange}
              >
                <SettingsContext.Consumer>
                  {([{ deviceTheme }]) => (
                    <div
                      ref={(element) => {
                        if (element) element.inert = !interactive;
                      }}
                      aria-hidden={!interactive || undefined}
                      className={className}
                      style={{ width: "100%", height: "100%", ...style }}
                    >
                      <ResponsiveWrapper showReflection={showReflection}>
                        <Shell
                          data-ipod-root=""
                          $deviceTheme={deviceTheme}
                          $disableAnimation={disableAnimation}
                        >
                          <Sticker $deviceTheme={deviceTheme} />
                          <Sticker2 $deviceTheme={deviceTheme} />
                          <Sticker3 $deviceTheme={deviceTheme} />
                          <ScreenContainer>
                            <ViewManager />
                          </ScreenContainer>
                          <ClickWheelContainer>
                            <ClickWheel />
                          </ClickWheelContainer>
                        </Shell>
                      </ResponsiveWrapper>
                    </div>
                  )}
                </SettingsContext.Consumer>
              </AudioPlayerProvider>
            </ViewContextProvider>
          </SettingsProvider>
        </MusicLibraryProvider>
      </QueryClientProvider>
    </IpodEventsContext.Provider>
  );

  return content;
};

export default memo(Ipod);
