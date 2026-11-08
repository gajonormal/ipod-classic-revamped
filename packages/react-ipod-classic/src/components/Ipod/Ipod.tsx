"use client";
import React, { memo, useState, useEffect } from "react";
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
import { loadYouTubeIframeApi } from "@/utils/youtube";
import { IpodSong, IpodPlaylist, IpodAlbum } from "@/types/custom";
import { DeviceThemeName } from "@/utils/themes";

export interface IpodProps {
  /** Custom songs list (YouTube IDs or full URLs supported) */
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
  /** Optional Google Client ID for YouTube user account authentication */
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
  songs,
  songsUrl,
  playlists,
  albums,
  theme,
  showReflection = false,
  disableAnimation = false,
  googleClientId,
  onSongChange,
  onPlayStateChange,
  className,
  style,
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const [isLoading, setIsLoading] = useState(true);

  useEffectOnce(() => {
    setIsLoading(false);
    loadYouTubeIframeApi();
  });

  useEffect(() => {
    loadYouTubeIframeApi();
  }, []);

  if (isLoading) {
    return null;
  }

  const content = (
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
              onSongChange={onSongChange}
              onPlayStateChange={onPlayStateChange}
            >
              <div
                id="youtube-player"
                style={{ display: "none", width: 0, height: 0 }}
              />
              <SettingsContext.Consumer>
                {([{ deviceTheme }]) => (
                  <div className={className} style={{ width: "100%", height: "100%", ...style }}>
                    <ResponsiveWrapper showReflection={showReflection}>
                      <Shell
                        $deviceTheme={deviceTheme}
                        $showReflection={showReflection}
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
  );

  return content;
};

export default memo(Ipod);
