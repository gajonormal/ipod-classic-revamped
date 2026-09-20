"use client";
import { memo, useState } from "react";
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
import { GoogleOAuthProvider } from "@react-oauth/google";
import ViewContextProvider from "@/providers/ViewContextProvider";
import { GlobalStyles } from "@/components/Ipod/GlobalStyles";
import Script from "next/script";

const Ipod = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [isLoading, setIsLoading] = useState(true);

  useEffectOnce(() => {
    setIsLoading(false);
  });

  if (isLoading) {
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyles />
        <SettingsProvider>
          <ViewContextProvider>
            <AudioPlayerProvider>
              <div id="youtube-player" style={{ display: "none", width: 0, height: 0 }}></div>
              <SettingsContext.Consumer>
                {([{ deviceTheme }]) => (
                  <Shell $deviceTheme={deviceTheme}>
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
                )}
              </SettingsContext.Consumer>
            </AudioPlayerProvider>
          </ViewContextProvider>
        </SettingsProvider>
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="lazyOnload"
        />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default memo(Ipod);
