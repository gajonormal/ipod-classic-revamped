"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { css, styled } from "styled-components";

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
  display: flex;
  justify-content: center;
  align-items: center;
`;

const reflectionMask = "linear-gradient(to bottom, transparent 80%, #0006)";

const Scaler = styled.div<{ $scale: number; $reflectionId?: string }>`
  transform: scale(${({ $scale }) => $scale});
  transform-origin: center center;
  width: 370px;
  height: 592px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  ${({ $reflectionId }) =>
    $reflectionId &&
    css`
      @supports (background-image: -moz-element(#ipod)) {
        &::after {
          content: "";
          position: absolute;
          inset: calc(100% + 2px) 0 auto;
          height: 100%;
          background: -moz-element(#${$reflectionId}) center / 100% 100% no-repeat;
          transform: scaleY(-1);
          mask-image: ${reflectionMask};
          pointer-events: none;
        }
      }
    `}
`;

const ReflectionSource = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  &[id] {
    -webkit-box-reflect: below 2px ${reflectionMask};
  }
`;

export const ResponsiveWrapper: React.FC<{
  children: React.ReactNode;
  showReflection?: boolean;
}> = ({ children, showReflection = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const instanceId = useId();
  const reflectionId = showReflection
    ? `ipod-reflection-${instanceId.replace(/[^\w-]/g, "")}`
    : undefined;

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
        <Scaler $scale={scale} $reflectionId={reflectionId}>
          <ReflectionSource id={reflectionId}>{children}</ReflectionSource>
        </Scaler>
      </InnerContainer>
    </OuterContainer>
  );
};
