import React, { useCallback, useRef } from "react";
import { useHapticFeedback } from "@/hooks";

const LONG_PRESS_THRESHOLD = 500;

export interface UseLongPressHandlerProps {
  onLongPress: () => void;
  onPress: () => void;
  longPressThreshold?: number;
}

export const useLongPressHandler = ({
  onPress,
  onLongPress,
  longPressThreshold = LONG_PRESS_THRESHOLD,
}: UseLongPressHandlerProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wasLongPressActivated = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const { triggerHaptics } = useHapticFeedback();

  const handleClearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = null;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    startPosRef.current = { x: e.clientX, y: e.clientY };
    timeoutRef.current = setTimeout(() => {
      wasLongPressActivated.current = true;
      triggerHaptics(); // Trigger haptic when long press activates
      onLongPress();
    }, longPressThreshold);
  }, [longPressThreshold, onLongPress, triggerHaptics]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (wasLongPressActivated.current) {
      wasLongPressActivated.current = false;
    } else {
      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Only trigger click if the pointer moved less than 15 pixels (not a drag)
      if (distance < 15) {
        onPress();
      }
    }
    handleClearTimeout();
  }, [handleClearTimeout, onPress]);

  const handlePointerCancel = useCallback(() => {
    handleClearTimeout();
  }, [handleClearTimeout]);

  return {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
  };
};
