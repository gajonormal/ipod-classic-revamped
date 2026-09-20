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
  transform-origin: top left;
  width: 370px;
  height: 592px;
  position: absolute;
  top: 0;
  left: 0;
`;

export const ResponsiveWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
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
        const reflectionHeight = 150;
        const totalHeight = originalHeight + reflectionHeight;
        
        const scaleX = width / originalWidth;
        const scaleY = height > 0 ? height / totalHeight : scaleX;
        
        // We only scale down if it doesn't fit, or we can allow scaling up too.
        // Usually we want to fit within the container. 
        // If height is 0 (e.g., auto-height flex container), we only rely on width.
        const newScale = height > 0 ? Math.min(scaleX, scaleY) : scaleX;
        
        // Let's cap the maximum scale to 1.2 to avoid it being absurdly huge on 4k screens, 
        // but still allow it to grow a bit if the user wants.
        setScale(Math.min(newScale, 1.2));
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // On initial render (SSR), use scale 1
  return (
    <OuterContainer ref={containerRef}>
      <InnerContainer $width={370 * scale} $height={742 * scale}>
        <Scaler $scale={scale}>{children}</Scaler>
      </InnerContainer>
    </OuterContainer>
  );
};
