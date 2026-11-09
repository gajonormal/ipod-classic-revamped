import { useMusicLibrary } from "@/providers/MusicLibraryProvider";
import { useCallback } from "react";

import AuthPrompt from "@/components/AuthPrompt";
import LoadingScreen from "@/components/LoadingScreen";
import { useEventListener, useSettings, useViewContext } from "@/hooks";
import { styled } from "styled-components";

import CoverFlow from "./CoverFlow";
import { IpodEvent } from "@/utils/events";
import { useFetchAlbums } from "@/hooks/utils/useDataFetcher";

const Container = styled.div`
  height: 100%;
  flex: 1;
`;

const CoverFlowView = () => {
  const { hideView } = useViewContext();
  const { isAuthorized } = useSettings();
  const library = useMusicLibrary();
  const { data, isLoading: queryLoading } = useFetchAlbums({
    artworkSize: 350,
  });

  const isLoading = library.isLoading || queryLoading;
  const albums = data?.pages.flatMap((page) => page?.data ?? []) ?? [];

  const handleMenuClick = useCallback(() => {
    if (!isAuthorized || isLoading) {
      hideView();
    }
  }, [hideView, isAuthorized, isLoading]);

  useEventListener<IpodEvent>("menuclick", handleMenuClick);

  return (
    <Container>
      {!isAuthorized ? (
        <AuthPrompt message="Sign in to view Cover Flow" />
      ) : isLoading ? (
        <LoadingScreen backgroundColor="white" />
      ) : (
        <CoverFlow albums={albums} />
      )}
    </Container>
  );
};

export default CoverFlowView;
