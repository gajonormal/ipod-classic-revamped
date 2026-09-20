import { motion } from "motion/react";
import styled from "styled-components";
import { APP_URL } from "@/utils/constants";
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
    <Image alt="Themes" src={`${APP_URL}/themes_preview.png`} />
  </Container>
);

export default ThemePreview;
