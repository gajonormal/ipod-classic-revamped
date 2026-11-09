"use client";
import type { MediaApi } from "@/types/Media.API";
import React, { useState, useCallback, useRef } from "react";
import { styled } from "styled-components";
import { motion, AnimatePresence, useDragControls } from "motion/react";
import Ipod, { IpodProps } from "@/components/Ipod/Ipod";

export type FloatingPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left";

export interface FloatingIpodProps extends IpodProps {
  /** Screen corner position for the floating widget */
  position?: FloatingPosition;
  /** Whether the iPod starts opened */
  defaultOpen?: boolean;
  /** Custom label or icon for the launcher button */
  buttonContent?: React.ReactNode;
  /** Custom z-index for the floating layer */
  zIndex?: number;
  /** Distance in pixels from the screen edges */
  offset?: {
    x?: number;
    y?: number;
  };
  /** Callback when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
}

const getPositionStyles = (
  position: FloatingPosition,
  offset: { x?: number; y?: number } = {}
) => {
  const x = offset.x ?? 24;
  const y = offset.y ?? 24;

  switch (position) {
    case "bottom-left":
      return {
        bottom: `${y}px`,
        left: `${x}px`,
        right: "auto",
        top: "auto",
      };
    case "top-right":
      return {
        top: `${y}px`,
        right: `${x}px`,
        bottom: "auto",
        left: "auto",
      };
    case "top-left":
      return {
        top: `${y}px`,
        left: `${x}px`,
        bottom: "auto",
        right: "auto",
      };
    case "bottom-right":
    default:
      return {
        bottom: `${y}px`,
        right: `${x}px`,
        top: "auto",
        left: "auto",
      };
  }
};

const FloatingRoot = styled.div<{ $zIndex: number }>`
  position: fixed;
  z-index: ${({ $zIndex }) => $zIndex};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  pointer-events: none;
`;

const LauncherButton = styled(motion.button)<{
  $position: FloatingPosition;
  $offset: { x?: number; y?: number };
}>`
  pointer-events: auto;
  position: fixed;
  ${({ $position, $offset }) => getPositionStyles($position, $offset)};
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #1f1f1f 0%, #0d0d0d 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  outline: none;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  user-select: none;
  -webkit-user-select: none;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 14px 28px -4px rgba(0, 0, 0, 0.45);
    background: linear-gradient(135deg, #2a2a2a 0%, #141414 100%);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const PulseDot = styled.span<{ $isPlaying: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $isPlaying }) => ($isPlaying ? "#10b981" : "#6b7280")};
  box-shadow: ${({ $isPlaying }) =>
    $isPlaying ? "0 0 8px #10b981, 0 0 14px #10b981" : "none"};
  display: inline-block;
  animation: ${({ $isPlaying }) => ($isPlaying ? "pulse 2s infinite" : "none")};

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(0.85);
    }
  }
`;

const ModalBackdrop = styled(motion.div)`
  pointer-events: auto;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1;
`;

const FloatingWindow = styled(motion.div)<{
  $position: FloatingPosition;
  $offset: { x?: number; y?: number };
}>`
  pointer-events: auto;
  position: fixed;
  ${({ $position, $offset }) => getPositionStyles($position, $offset)};
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: calc(100vh - 48px);
  max-width: calc(100vw - 32px);
  width: 380px;
  height: 620px;

  @media (max-width: 480px) {
    width: 320px;
    height: 540px;
    bottom: 12px !important;
    right: 12px !important;
    left: 12px !important;
    margin: 0 auto;
  }
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 14px;
  margin-bottom: 8px;
  background: rgba(20, 20, 20, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: white;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  opacity: 0.9;
  letter-spacing: -0.01em;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  transition: background 0.15s;

  &:hover {
    background: rgba(239, 68, 68, 0.8);
  }
`;

const IpodWrapper = styled.div`
  flex: 1;
  width: 100%;
  height: calc(100% - 46px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FloatingIpod: React.FC<FloatingIpodProps> = ({
  position = "bottom-right",
  defaultOpen = false,
  buttonContent,
  zIndex = 999999,
  offset = { x: 24, y: 24 },
  onOpenChange,
  onSongChange,
  onPlayStateChange,
  ...ipodProps
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>("");
  const dragControls = useDragControls();
  const dragConstraintsRef = useRef(null);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      onOpenChange?.(next);
      return next;
    });
  }, [onOpenChange]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const handleSongChange = useCallback(
    (song: MediaApi.Song) => {
      setCurrentTrack(song.name);
      onSongChange?.(song);
    },
    [onSongChange]
  );

  const handlePlayStateChange = useCallback(
    (playing: boolean) => {
      setIsPlaying(playing);
      onPlayStateChange?.(playing);
    },
    [onPlayStateChange]
  );

  return (
    <FloatingRoot $zIndex={zIndex} ref={dragConstraintsRef}>
      {/* Launcher Button */}
      <AnimatePresence>
        {!isOpen && (
          <LauncherButton
            $position={position}
            $offset={offset}
            onClick={handleToggle}
            initial={{ scale: 0.8, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 10 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PulseDot $isPlaying={isPlaying} />
            {buttonContent ? (
              buttonContent
            ) : (
              <span>
                {isPlaying && currentTrack
                  ? `♫ ${currentTrack}`
                  : "iPod"}
              </span>
            )}
          </LauncherButton>
        )}
      </AnimatePresence>

      {/* Floating iPod Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            <ModalBackdrop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />
            <FloatingWindow
              $position={position}
              $offset={offset}
              drag
              dragListener={false}
              dragControls={dragControls}
              dragMomentum={false}
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
            >
              <HeaderBar onPointerDown={(e) => dragControls.start(e)}>
                <DragHandle>
                  <PulseDot $isPlaying={isPlaying} />
                  <span>iPod Classic</span>
                </DragHandle>
                <CloseButton onClick={handleClose} title="Minimize iPod">
                  ✕
                </CloseButton>
              </HeaderBar>
              <IpodWrapper>
                <Ipod
                  {...ipodProps}
                  showReflection={ipodProps.showReflection ?? false}
                  onSongChange={handleSongChange}
                  onPlayStateChange={handlePlayStateChange}
                />
              </IpodWrapper>
            </FloatingWindow>
          </>
        )}
      </AnimatePresence>
    </FloatingRoot>
  );
};

export default FloatingIpod;

