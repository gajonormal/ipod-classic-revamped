import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { styled, css } from "styled-components";
import FastForwardIcon from "./icons/FastForwardIcon";
import MenuIcon from "./icons/MenuIcon";
import PlayPauseIcon from "./icons/PlayPauseIcon";
import RewindIcon from "./icons/RewindIcon";
import { DeviceThemeName, getTheme } from "@/utils/themes";
import { useSettings, useViewContext } from "@/hooks";
import { IpodEventsContext } from "@/providers/IpodEventsContext";
import { clickWheelKeys, type IpodEvent } from "@/utils/events";

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
  -webkit-tap-highlight-color: transparent;

  &:active {
    cursor: grabbing;
  }

  &:focus-visible:not([data-pointer-focus]) {
    outline: 2px solid #72b9ee;
    outline-offset: 3px;
  }

  &[data-pointer-focus]:focus {
    outline: none;
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
  const events = useContext(IpodEventsContext);
  const { viewStack } = useViewContext();
  const keyboardOpen = viewStack.at(-1)?.type === "keyboard";

  const dispatch = useCallback(
    (name: IpodEvent) => events?.dispatchEvent(new Event(name)),
    [events]
  );

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

  useEffect(() => clearLongPress, [clearLongPress]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (
        !events ||
        !rootContainerRef.current ||
        !e.isPrimary ||
        e.button !== 0
      )
        return;
      e.currentTarget.setAttribute("data-pointer-focus", "");
      e.currentTarget.focus({ preventScroll: true });

      // Captura o ponteiro para que o movimento em 360 graus NUNCA se perca
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}

      const rect = rootContainerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distFromCenter =
        Math.hypot(dx / rect.width, dy / rect.height) * WHEEL_SIZE;

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
          dispatch("centerlongclick");
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
            dispatch("menulongpress");
          }
        }, 500);
      }
    },
    [clearLongPress, dispatch, events]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (
        !e.isPrimary ||
        !isPointerDownRef.current ||
        !rootContainerRef.current
      )
        return;

      const rect = rootContainerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distFromCenter =
        Math.hypot(dx / rect.width, dy / rect.height) * WHEEL_SIZE;

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
        dispatch("forwardscroll");
        accumulatedAngleRef.current -= DEGREES_PER_TICK;
        hasScrolledTicksRef.current = true;
      }
      // Sentido anti-horário (counter-clockwise) = diminui som / retrocede
      while (accumulatedAngleRef.current <= -DEGREES_PER_TICK) {
        dispatch("backwardscroll");
        accumulatedAngleRef.current += DEGREES_PER_TICK;
        hasScrolledTicksRef.current = true;
      }
    },
    [clearLongPress, dispatch]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!e.isPrimary || !isPointerDownRef.current) return;
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
        dispatch("centerclick");
        return;
      }

      // Botões cardeais na ClickWheel
      const angle = pointerDownAngleRef.current;
      if (angle >= -135 && angle <= -45) {
        // Topo: MENU
        dispatch("menuclick");
      } else if (angle >= -45 && angle <= 45) {
        // Direita: FAST FORWARD
        dispatch("forwardclick");
      } else if (angle >= 45 && angle <= 135) {
        // Base: PLAY / PAUSE
        dispatch("playpauseclick");
      } else {
        // Esquerda: REWIND
        dispatch("backwardclick");
      }
    },
    [clearLongPress, dispatch]
  );

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) return;
    isPointerDownRef.current = false;
    clearLongPress();
  };

  const handleWheel = (event: React.WheelEvent) => {
    if (Math.abs(event.deltaY) < 3) return;
    dispatch(event.deltaY > 0 ? "forwardscroll" : "backwardscroll");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.currentTarget.removeAttribute("data-pointer-focus");
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.nativeEvent.isComposing
    )
      return;
    const { key } = event;
    if (
      keyboardOpen &&
      (key.length === 1 || key === "Backspace" || key === "Enter")
    ) {
      event.preventDefault();
      events?.dispatchEvent(new CustomEvent("input", { detail: { key } }));
      return;
    }
    const action = clickWheelKeys.get(key);
    if (action) {
      event.preventDefault();
      dispatch(action);
    }
  };

  return (
    <RootContainer
      $deviceTheme={deviceTheme}
      tabIndex={events ? 0 : undefined}
      role="group"
      aria-label="iPod Click Wheel"
      onBlur={(event) => event.currentTarget.removeAttribute("data-pointer-focus")}
      onKeyDown={handleKeyDown}
      onLostPointerCapture={handlePointerCancel}
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
        <CenterButton size={CENTER_BUTTON_SIZE} $deviceTheme={deviceTheme} />
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
