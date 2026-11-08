import { motion, AnimatePresence } from "motion/react";
import { useAudioPlayer } from "@/hooks";
import styled from "styled-components";
import * as Utils from "@/utils";

const Container = styled(motion.div)`
  height: 100%;
  width: 100%;
  position: relative;
`;

const Artwork = styled(motion.img)`
  position: absolute;
  right: 0;
  height: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.2);
`;

const NowPlayingPreview = () => {
  const { nowPlayingItem } = useAudioPlayer();

  return nowPlayingItem ? (
    <Container>
      <AnimatePresence initial={false}>
        <Artwork
          key={nowPlayingItem?.id ?? "empty"}
          initial={{ opacity: 0, x: "50%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-50%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
          src={Utils.getArtwork(300, nowPlayingItem.artwork?.url)}
          alt="now playing artwork"
        />
      </AnimatePresence>
    </Container>
  ) : null;
};

export default NowPlayingPreview;
