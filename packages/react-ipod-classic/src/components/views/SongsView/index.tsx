import type { MediaApi } from "@/types/Media.API";
import { useMemo } from "react";

import SelectableList, {
  SelectableListOption,
} from "@/components/SelectableList";
import { useSelectableList } from "@/hooks";
import * as Utils from "@/utils";

interface Props {
  songs: MediaApi.Song[];
}

const SongsView = ({ songs }: Props) => {
  const options: SelectableListOption[] = useMemo(
    () =>
      songs.map((song) => ({
        type: "song",
        label: song.name,
        sublabel: `${song.artistName} • ${song.albumName}`,
        queueOptions: {
          song,
          startPosition: 0,
        },
        imageUrl: Utils.getArtwork(50, song.artwork?.url),
        showNowPlayingView: true,
      })) ?? [],
    [songs]
  );

  const { activeIndex: scrollIndex } = useSelectableList({
    viewId: "songs",
    options,
  });

  return (
    <SelectableList
      options={options}
      activeIndex={scrollIndex}
      emptyMessage="No songs to show"
    />
  );
};

export default SongsView;
