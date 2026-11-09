import { useMemo } from "react";

import SelectableList, {
  SelectableListOption,
} from "@/components/SelectableList";
import { SplitScreenPreview } from "@/components/previews";
import { useAudioPlayer, useSelectableList } from "@/hooks";
import { useMusicLibrary } from "@/providers/MusicLibraryProvider";

const MusicView = () => {
  const { nowPlayingItem } = useAudioPlayer();
  const library = useMusicLibrary();

  const options: SelectableListOption[] = useMemo(() => {
    const arr: SelectableListOption[] = [
      {
        type: "view",
        label: "Cover Flow",
        viewId: "coverFlow",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Playlists",
        viewId: "playlists",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Artists",
        viewId: "artists",
        props: { artists: library.artists, inLibrary: true, showImages: true },
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Albums",
        viewId: "albums",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Songs",
        viewId: "songs",
        props: { songs: library.songs },
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Search",
        viewId: "search",
        preview: SplitScreenPreview.Music,
      },
    ];

    if (!!nowPlayingItem) {
      arr.push({
        type: "view",
        label: "Now playing",
        viewId: "nowPlaying",
        preview: SplitScreenPreview.NowPlaying,
      });
    }

    return arr;
  }, [nowPlayingItem, library]);

  const { activeIndex: scrollIndex } = useSelectableList({
    viewId: "music",
    options,
  });

  return <SelectableList options={options} activeIndex={scrollIndex} />;
};

export default MusicView;
