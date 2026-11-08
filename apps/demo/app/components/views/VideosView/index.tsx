import { useMemo } from "react";
import SelectableList, { SelectableListOption } from "@/components/SelectableList";
import { useSelectableList } from "@/hooks";
import { mockVideos } from "@/utils/videoMockData";

const VideosView = () => {
  const options: SelectableListOption[] = useMemo(
    () =>
      mockVideos.map((video) => ({
        type: "view",
        label: video.name,
        subLabel: video.artistName,
        viewId: "videoPlayer",
        props: { videoId: video.url },
      })),
    []
  );

  const { activeIndex } = useSelectableList({
    viewId: "videos",
    options,
  });

  return <SelectableList options={options} activeIndex={activeIndex} />;
};

export default VideosView;
