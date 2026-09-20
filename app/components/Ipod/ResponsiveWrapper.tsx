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
        const totalHeight = originalHeight + reflectionHeight;
        
        const scaleX = width / originalWidth;
        const scaleY = height > 0 ? height / totalHeight : scaleX;
        
        // We only scale down if it doesn't fit, or we can allow scaling up too.
        // Usually we want to fit within the container. 
        // If height is 0 (e.g., auto-height flex container), we only rely on width.
        const newScale = height > 0 ? Math.min(scaleX, scaleY) : scaleX;
        
        // Allow it to grow indefinitely to fit the container
        setScale(newScale);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [showReflection]);

  // On initial render (SSR), use scale 1
  const originalHeight = 592;
  const reflectionHeight = showReflection ? 150 : 0;
  const totalHeight = originalHeight + reflectionHeight;

  return (
    <OuterContainer ref={containerRef}>
      <InnerContainer $width={370 * scale} $height={totalHeight * scale}>
        <Scaler $scale={scale}>{children}</Scaler>
      </InnerContainer>
    </OuterContainer>
  );
};
