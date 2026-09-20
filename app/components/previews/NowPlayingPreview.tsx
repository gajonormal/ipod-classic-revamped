import { motion } from "motion/react";
import { useAudioPlayer } from "@/hooks";
import styled from "styled-components";
import * as Utils from "@/utils";

const Container = styled(motion.div)`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Artwork = styled.img`
  height: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.2);
`;

const NowPlayingPreview = () => {
  const { nowPlayingItem } = useAudioPlayer();

  return nowPlayingItem ? (
    <Container>
      <Artwork
        src={Utils.getArtwork(300, nowPlayingItem.artwork?.url)}
        alt="now playing artwork"
      />
    </Container>
  ) : null;
};

export default NowPlayingPreview;
