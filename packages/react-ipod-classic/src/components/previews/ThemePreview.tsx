import { motion } from "motion/react";
import { styled } from "styled-components";
import { ASSET_THEMES_PREVIEW } from "@/assets";
import { previewSlideRight } from "@/animation";

const Container = styled(motion.div)`
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
`;

const ThemePreview = () => (
  <Container {...previewSlideRight}>
    <Image alt="Themes" src={ASSET_THEMES_PREVIEW} />
  </Container>
);

export default ThemePreview;
