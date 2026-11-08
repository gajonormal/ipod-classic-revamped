"use client";

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Screen } from "@/utils/constants";

const OuterContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InnerContainer = styled.div<{ $width: number; $height: number }>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  position: relative;
`;

const Scaler = styled.div<{ $scale: number }>`
  transform: scale(${({ $scale }) => $scale});
  transform-origin: center center;
  width: 370px;
  height: 592px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ResponsiveWrapper: React.FC<{ children: React.ReactNode; showReflection?: boolean }> = ({
  children,
  showReflection = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width === 0) continue; // Avoid scaling to 0 when hidden

        const originalWidth = 370;
        const originalHeight = 592;
        const reflectionHeight = showReflection ? 150 : 0;
        
        // Add 60px of padding for the outer shadow to be visible without clipping
        const padding = 60;
        const totalWidth = originalWidth + padding;
        const totalHeight = originalHeight + reflectionHeight + padding;
        
        const scaleX = width / totalWidth;
        const scaleY = height > 0 ? height / totalHeight : scaleX;
        
        const newScale = height > 0 ? Math.min(scaleX, scaleY) : scaleX;
        
        setScale(newScale);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [showReflection]);

  const originalWidth = 370;
  const originalHeight = 592;
  const reflectionHeight = showReflection ? 150 : 0;
  const padding = 60;
  const totalWidth = originalWidth + padding;
  const totalHeight = originalHeight + reflectionHeight + padding;

  return (
    <OuterContainer ref={containerRef}>
      <InnerContainer $width={totalWidth * scale} $height={totalHeight * scale}>
        <Scaler $scale={scale}>{children}</Scaler>
      </InnerContainer>
    </OuterContainer>
  );
};
