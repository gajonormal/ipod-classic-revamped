import styled from "styled-components";
import { Screen, Unit } from "@/utils/constants";
import { DeviceThemeName, getTheme } from "@/utils/themes";

export const Shell = styled.div<{ $deviceTheme: DeviceThemeName; $showReflection?: boolean; $disableAnimation?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 370px;
  max-height: 37em;
  margin: auto;
  border-radius: 30px;
  background: ${({ $deviceTheme }) => getTheme($deviceTheme).body.background};
  -webkit-box-reflect: ${({ $showReflection }) => 
    $showReflection ? "below 0px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(50%, transparent), to(rgba(250, 250, 250, 0.3)))" : "none"};
  animation: ${({ $disableAnimation }) => ($disableAnimation ? "none" : "descend 1.5s ease")};
  overflow: hidden;
  
  /* Pseudo-element for inner shadow to avoid Chrome scaling bugs and translateZ side-effects */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 30px;
    box-shadow: inset 0 0 2.4em #555;
    pointer-events: none;
  }

  @media (prefers-color-scheme: dark) {
    &::before {
      box-shadow: inset 0 0 2.4em black;
    }
  }

  @keyframes descend {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export const ScreenContainer = styled.div`
  position: relative;
  height: 260px;
  margin: ${Unit.LG} ${Unit.LG} 0;
  border: 4px solid black;
  border-radius: ${Unit.XS};
  overflow: hidden;
  background: white;
  animation: fadeFromBlack 0.5s;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    
    /* LCD Scanlines */
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.02) 50%),
                linear-gradient(90deg, rgba(255, 0, 0, 0.01), rgba(0, 255, 0, 0.005), rgba(0, 0, 255, 0.01));
    background-size: 100% 3px, 3px 100%;
    
    /* Screen bezel depth */
    box-shadow: inset 0 2px 10px rgba(0,0,0,0.5), inset 0 -2px 10px rgba(0,0,0,0.2);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 9998;
    /* Subtle screen glare */
    background: linear-gradient(115deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 40%, transparent 40%);
  }

  @keyframes fadeFromBlack {
    0% {
      filter: brightness(0);
    }
  }
`;

export const ClickWheelContainer = styled.div`
  margin: auto;
`;

export const Sticker = styled.div<{ $deviceTheme: DeviceThemeName }>`
  position: absolute;
  background: ${({ $deviceTheme }) =>
    getTheme($deviceTheme).body.sticker1?.background};
  ${({ $deviceTheme: deviceTheme }) =>
    getTheme(deviceTheme).body.sticker1?.styles ?? {}};
`;

export const Sticker2 = styled.div<{ $deviceTheme: DeviceThemeName }>`
  position: absolute;
  background: ${({ $deviceTheme }) =>
    getTheme($deviceTheme).body.sticker2?.background};
  ${({ $deviceTheme: deviceTheme }) =>
    getTheme(deviceTheme).body.sticker2?.styles ?? {}};
`;

export const Sticker3 = styled.div<{ $deviceTheme: DeviceThemeName }>`
  position: absolute;
  background: ${({ $deviceTheme }) =>
    getTheme($deviceTheme).body.sticker3?.background};
  ${({ $deviceTheme: deviceTheme }) =>
    getTheme(deviceTheme).body.sticker3?.styles ?? {}};
`;
