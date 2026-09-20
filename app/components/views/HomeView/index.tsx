import { useCallback, useMemo } from "react";
import { useGoogleLogin } from "@react-oauth/google";

import { getConditionalOption } from "@/components/SelectableList";
import SelectableList, {
  SelectableListOption,
} from "@/components/SelectableList";
import { SplitScreenPreview } from "@/components/previews";
import {
  useAudioPlayer,
  useEventListener,
  useSelectableList,
  useSettings,
  useViewContext,
} from "@/hooks";
import { IpodEvent } from "@/utils/events";

const strings = {
  nowPlaying: "Now Playing",
};

const HomeView = () => {
  const { isAuthorized, isYoutubeAuthorized, setYoutubeToken, isOffline, shuffleMode } = useSettings();
  const { nowPlayingItem, setShuffleMode, reset } = useAudioPlayer();
  const { showView, viewStack } = useViewContext();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setYoutubeToken(tokenResponse.access_token);
    },
    scope: "https://www.googleapis.com/auth/youtube.readonly",
  });

  const createResetHandler = useCallback(
    (handler: () => void | Promise<void>) => () => {
      reset();
      handler();
    },
    [reset]
  );

  const signInOptions: SelectableListOption[] = useMemo(
    () => [
      {
        type: "action",
        label: "Sign in with YouTube",
        onSelect: () => login(),
      },
    ],
    [login]
  );

  const signOutOptions: SelectableListOption[] = useMemo(
    () => [
      {
        type: "action",
        label: "Sign out of YouTube",
        onSelect: createResetHandler(() => setYoutubeToken(undefined)),
      },
    ],
    [createResetHandler, setYoutubeToken]
  );

  const options: SelectableListOption[] = useMemo(
    () => [
      {
        type: "view",
        label: "Cover Flow",
        viewId: "coverFlow",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Music",
        viewId: "music",
        preview: SplitScreenPreview.Music,
      },


      ...getConditionalOption(isAuthorized, {
        type: "actionSheet",
        id: "shuffle-mode-action-sheet",
        label: "Shuffle",
        listOptions: [
          {
            type: "action",
            isSelected: shuffleMode === "off",
            label: `Off ${shuffleMode === "off" ? "(Current)" : ""}`,
            onSelect: () => setShuffleMode("off"),
          },
          {
            type: "action",
            isSelected: shuffleMode === "songs",
            label: `Songs ${shuffleMode === "songs" ? "(Current)" : ""}`,
            onSelect: () => setShuffleMode("songs"),
          },
          {
            type: "action",
            isSelected: shuffleMode === "albums",
            label: `Albums ${shuffleMode === "albums" ? "(Current)" : ""}`,
            onSelect: () => setShuffleMode("albums"),
          },
        ],
        preview: SplitScreenPreview.Music,
      }),
      ...getConditionalOption(!!nowPlayingItem, {
        type: "view",
        label: strings.nowPlaying,
        viewId: "nowPlaying",
        preview: SplitScreenPreview.NowPlaying,
      }),
      ...getConditionalOption(!isYoutubeAuthorized, {
        type: "actionSheet",
        id: "signin-popup",
        label: "Sign in",
        listOptions: signInOptions,
        preview: SplitScreenPreview.Music,
      }),
      ...getConditionalOption(isYoutubeAuthorized, {
        type: "actionSheet",
        id: "sign-out-popup",
        label: "Sign out",
        listOptions: signOutOptions,
        preview: SplitScreenPreview.Music,
      }),

      {
        type: "view",
        label: "Settings",
        viewId: "settings",
        preview: SplitScreenPreview.Settings,
      },
    ],
    [isAuthorized, isOffline, nowPlayingItem, isYoutubeAuthorized, signInOptions, signOutOptions, shuffleMode, setShuffleMode]
  );

  const { activeIndex: scrollIndex } = useSelectableList({ viewId: "home", options });

  const handleIdleState = useCallback(() => {
    const activeView = viewStack[viewStack.length - 1];

    const shouldShowNowPlaying =
      !!nowPlayingItem &&
      activeView.id !== "nowPlaying" &&
      activeView.id !== "coverFlow" &&
      activeView.id !== "keyboard";

    if (shouldShowNowPlaying) {
      showView("nowPlaying");
    }
  }, [nowPlayingItem, showView, viewStack]);

  useEventListener<IpodEvent>("idle", handleIdleState);

  return <SelectableList options={options} activeIndex={scrollIndex} />;
};

export default HomeView;
