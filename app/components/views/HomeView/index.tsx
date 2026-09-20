import { useCallback, useMemo } from "react";

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
  const { isAuthorized, isOffline } = useSettings();
  const { nowPlayingItem } = useAudioPlayer();
  const { showView, viewStack } = useViewContext();

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

      {
        type: "view",
        label: "Settings",
        viewId: "settings",
        preview: SplitScreenPreview.Settings,
      },
      ...getConditionalOption(!isAuthorized && !isOffline, {
        type: "actionSheet",
        id: "signin-popup",
        label: "Sign in",
        listOptions: [
          {
            type: "action",
            label: "YouTube (Em Breve)",
            onSelect: () => {},
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
    ],
    [isAuthorized, isOffline, nowPlayingItem]
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
