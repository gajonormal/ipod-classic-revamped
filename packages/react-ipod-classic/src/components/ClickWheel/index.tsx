import React, { useCallback, useMemo, useRef } from "react";
import styled, { css } from "styled-components";
import FastForwardIcon from "./icons/FastForwardIcon";
import MenuIcon from "./icons/MenuIcon";
import PlayPauseIcon from "./icons/PlayPauseIcon";
import RewindIcon from "./icons/RewindIcon";
import { DeviceThemeName, getTheme } from "@/utils/themes";
import { useEventListener, useSettings } from "@/hooks";
import {
  dispatchBackClickEvent,
  dispatchCenterClickEvent,
  dispatchCenterLongClickEvent,
  dispatchForwardClickEvent,
  dispatchForwardScrollEvent,
  dispatchBackwardScrollEvent,
  dispatchKeyboardEvent,
  dispatchMenuClickEvent,
  dispatchMenuLongPressEvent,
  dispatchPlayPauseClickEvent,
} from "@/utils/events";

const WHEEL_SIZE = 220;
const CENTER_BUTTON_SIZE = 90;
const DEGREES_PER_TICK = 8; // cada 8 graus de rotação circular contínua = 1 passo no som / coverflow / listas

type RootContainerProps = {
  $deviceTheme: DeviceThemeName;
  size?: number;
};

const RootContainer = styled.div<RootContainerProps>`
  display: grid;
  position: relative;
  border-radius: 50%;
  touch-action: none;
  cursor: grab;

  /* Prevent text selection and context menus */
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;

  &:active {
    cursor: grabbing;
  }

  ${({ size = WHEEL_SIZE, $deviceTheme }) => css`
    width: ${size}px;
    height: ${size}px;
    background-color: ${getTheme($deviceTheme).clickwheel.background};
    border: 1px solid ${getTheme($deviceTheme).clickwheel.centerButton.outline};
  `}
`;

const ButtonContainer = styled.div<{
  $placement: string;
}>`
  position: absolute;
  place-self: ${(props) => props.$placement};
  padding: 12px;
  pointer-events: none; /* Deixa o ponteiro passar para a superfície 360 da ClickWheel */
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
`;

type CenterButtonProps = {
  $deviceTheme: DeviceThemeName;
  size: number;
};

const CenterButton = styled.div<CenterButtonProps>`
  user-select: none;
  border-radius: 50%;
  pointer-events: none;

  ${({ $deviceTheme, size }) => css`
    width: ${size}px;
    height: ${size}px;
    border: 1px solid ${getTheme($deviceTheme).clickwheel.centerButton.outline};
    background: ${getTheme($deviceTheme).clickwheel.centerButton.background};
    box-shadow: ${getTheme($deviceTheme).clickwheel.centerButton.boxShadow} 0px
      1em 3em inset;
  `}
`;

export const ClickWheel = () => {
  const { deviceTheme } = useSettings();

  const iconColor = useMemo(
    () => getTheme(deviceTheme).clickwheel.button,
    [deviceTheme]
  );

  const rootContainerRef = useRef<HTMLDivElement>(null);

  // Gesture tracking refs
  const isPointerDownRef = useRef(false);
  const isDraggingWheelRef = useRef(false);
  const hasScrolledTicksRef = useRef(false);
  const pointerDownAngleRef = useRef(0);
  const pointerDownDistRef = useRef(0);
  const lastAngleRef = useRef(0);
  const accumulatedAngleRef = useRef(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wasLongPressTriggeredRef = useRef(false);

  const clearLongPress = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!rootContainerRef.current) return;

    // Captura o ponteiro para que o movimento em 360 graus NUNCA se perca
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const rect = rootContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distFromCenter = Math.sqrt(dx * dx + dy * dy);

    isPointerDownRef.current = true;
    hasScrolledTicksRef.current = false;
    wasLongPressTriggeredRef.current = false;
    accumulatedAngleRef.current = 0;

    const initialAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    lastAngleRef.current = initialAngle;
    pointerDownAngleRef.current = initialAngle;
    pointerDownDistRef.current = distFromCenter;

    // Botão central (raio <= 45px)
    if (distFromCenter <= CENTER_BUTTON_SIZE / 2) {
      isDraggingWheelRef.current = false;
      clearLongPress();
      longPressTimerRef.current = setTimeout(() => {
        wasLongPressTriggeredRef.current = true;
        dispatchCenterLongClickEvent();
      }, 500);
      return;
    }

    // Anel tátil exterior da ClickWheel (360 graus)
    isDraggingWheelRef.current = true;

    // Menu long press se clicar e segurar no topo
    if (initialAngle >= -135 && initialAngle <= -45) {
      clearLongPress();
      longPressTimerRef.current = setTimeout(() => {
        if (!hasScrolledTicksRef.current) {
          wasLongPressTriggeredRef.current = true;
          dispatchMenuLongPressEvent();
        }
      }, 500);
    }
  }, [clearLongPress]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !rootContainerRef.current) return;

    const rect = rootContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distFromCenter = Math.sqrt(dx * dx + dy * dy);

    // Se começou no centro e arrastou para a roda, inicia o tracking 360
    if (!isDraggingWheelRef.current) {
      if (distFromCenter > CENTER_BUTTON_SIZE / 2 + 5) {
        clearLongPress();
        isDraggingWheelRef.current = true;
        lastAngleRef.current = Math.atan2(dy, dx) * (180 / Math.PI);
      }
      return;
    }

    // Ângulo contínuo em 360 graus em relação ao centro da ClickWheel
    const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    let delta = currentAngle - lastAngleRef.current;

    // Normalização do salto na fronteira de -180 / +180 graus
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    lastAngleRef.current = currentAngle;

    accumulatedAngleRef.current += delta;

    // Cancela long press assim que começar a rodar
    if (Math.abs(accumulatedAngleRef.current) >= 6) {
      clearLongPress();
    }

    // Dispara eventos contínuos a cada DEGREES_PER_TICK (8 graus)
    // Sentido dos ponteiros do relógio (clockwise) = aumenta som / avança
    while (accumulatedAngleRef.current >= DEGREES_PER_TICK) {
      dispatchForwardScrollEvent();
      accumulatedAngleRef.current -= DEGREES_PER_TICK;
      hasScrolledTicksRef.current = true;
    }
    // Sentido anti-horário (counter-clockwise) = diminui som / retrocede
    while (accumulatedAngleRef.current <= -DEGREES_PER_TICK) {
      dispatchBackwardScrollEvent();
      accumulatedAngleRef.current += DEGREES_PER_TICK;
      hasScrolledTicksRef.current = true;
    }
  }, [clearLongPress]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    clearLongPress();

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    // Se rodou a roda ativamente gerando ticks de scroll ou ativou long press, não dispara clique de botão
    if (wasLongPressTriggeredRef.current || hasScrolledTicksRef.current) {
      return;
    }

    // Clique estático simples: identifica qual o botão clicado com base na posição inicial do toque
    const distFromCenter = pointerDownDistRef.current;

    // Botão central
    if (distFromCenter <= CENTER_BUTTON_SIZE / 2) {
      dispatchCenterClickEvent();
      return;
    }

    // Botões cardeais na ClickWheel
    const angle = pointerDownAngleRef.current;
    if (angle >= -135 && angle <= -45) {
      // Topo: MENU
      dispatchMenuClickEvent();
    } else if (angle >= -45 && angle <= 45) {
      // Direita: FAST FORWARD
      dispatchForwardClickEvent();
    } else if (angle >= 45 && angle <= 135) {
      // Base: PLAY / PAUSE
      dispatchPlayPauseClickEvent();
    } else {
      // Esquerda: REWIND
      dispatchBackClickEvent();
    }
  }, [clearLongPress]);

  const handlePointerCancel = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    clearLongPress();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  }, [clearLongPress]);

  // Suporte a scroll físico do rato / trackpad sobre a ClickWheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 3) return;
    if (e.deltaY > 0) {
      dispatchForwardScrollEvent();
    } else {
      dispatchBackwardScrollEvent();
    }
  }, []);

  // Controlo por teclado
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => dispatchKeyboardEvent(event.key),
    []
  );

  useEventListener("keydown", handleKeyPress);

  return (
    <RootContainer
      $deviceTheme={deviceTheme}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onWheel={handleWheel}
      ref={rootContainerRef}
    >
      <ButtonContainer $placement="start center">
        <MenuIcon color={iconColor} />
      </ButtonContainer>
      <ButtonContainer $placement="center start">
        <RewindIcon color={iconColor} />
      </ButtonContainer>
      <ButtonContainer $placement="center">
        <CenterButton
          size={CENTER_BUTTON_SIZE}
          $deviceTheme={deviceTheme}
        />
      </ButtonContainer>
      <ButtonContainer $placement="center end">
        <FastForwardIcon color={iconColor} />
      </ButtonContainer>
      <ButtonContainer $placement="end center">
        <PlayPauseIcon color={iconColor} />
      </ButtonContainer>
    </RootContainer>
  );
};

export default ClickWheel;
