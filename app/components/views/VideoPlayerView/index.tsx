import React, { useEffect, useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { useAudioPlayer, useEventListener, useVolumeHandler } from "@/hooks";
import useMenuHideView from "@/hooks/navigation/useMenuHideView";
import VolumeBar from "@/components/Controls/VolumeBar";
import ProgressBar from "@/components/Controls/ProgressBar";
import { IpodEvent } from "@/utils/events";

interface Props {
  videoId: string;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  position: relative;
  overflow: hidden;
`;

const IframeWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  
  iframe {
    position: absolute;
    top: -80px;
    left: 0;
    width: 400%;
    height: calc(400% + 640px);
    transform: scale(0.25);
    transform-origin: top left;
    border: none;
    pointer-events: none;
  }
`;

const VideoControlsOverlay = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: 20px;
  left: 10%;
  right: 10%;
  background: linear-gradient(to bottom, #f4f4f4, #d4d4d4);
  border: 1px solid #777;
  border-radius: 6px;
  padding: 6px 8px;
  opacity: ${props => props.$isVisible ? 0.95 : 0};
  transition: opacity 0.3s;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.6);
`;

const ScrubberGrid = styled.div`
  display: grid;
  grid-template-columns: 35px 1fr 35px;
  gap: 8px;
  align-items: center;
  width: 100%;
  height: 16px;
`;

const TimeText = styled.div<{ $align: 'left' | 'right' }>`
  font-size: 11px;
  font-weight: bold;
  color: #333;
  text-align: ${p => p.$align};
  font-variant-numeric: tabular-nums;
`;

const VideoPlayerView = ({ videoId }: Props) => {
  const { pause, playbackInfo, volume: globalVolume } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(true);
  const [player, setPlayer] = useState<any>(null);
  const playerRef = useRef<any>(null);

  useMenuHideView("videoPlayer");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playbackInfo.isPlaying) {
      pause();
    }
  }, [pause, playbackInfo.isPlaying]);

  useEffect(() => {
    if (player && typeof player.setVolume === 'function') {
      player.setVolume(globalVolume * 100);
    }
  }, [globalVolume, player]);

  useEffect(() => {
    if (!containerRef.current) return;

    const targetDiv = document.createElement("div");
    targetDiv.id = `video-player-${videoId}`;
    containerRef.current.appendChild(targetDiv);

    const initPlayer = () => {
      const ytPlayer = new (window as any).YT.Player(targetDiv, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
            playerRef.current = event.target;
            event.target.setVolume(globalVolume * 100);
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          }
        },
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      const prevCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      if (containerRef.current && containerRef.current.contains(targetDiv)) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [videoId]);

  const handlePlayPauseClick = useCallback(() => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [player, isPlaying]);

  const handleForwardClick = useCallback(() => {
    if (!player) return;
    const currentTime = player.getCurrentTime();
    player.seekTo(currentTime + 10, true);
  }, [player]);

  const handleBackwardClick = useCallback(() => {
    if (!player) return;
    const currentTime = player.getCurrentTime();
    player.seekTo(Math.max(0, currentTime - 10), true);
  }, [player]);

  const { increaseVolume, decreaseVolume, volume, active: volumeActive, setEnabled: setVolumeEnabled } = useVolumeHandler();
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubberActive, setScrubberActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const scrubberTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (!player || !isPlaying) return;
    const interval = setInterval(() => {
      if (!isScrubbing) {
        setCurrentTime(player.getCurrentTime() || 0);
        setDuration(player.getDuration() || 0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [player, isPlaying, isScrubbing]);

  const showScrubberTemporarily = useCallback(() => {
    setScrubberActive(true);
    if (scrubberTimeoutRef.current) clearTimeout(scrubberTimeoutRef.current);
    scrubberTimeoutRef.current = setTimeout(() => {
      setScrubberActive(false);
    }, 3000);
  }, []);

  const handleCenterClick = useCallback(() => {
    if (isScrubbing) {
      setVolumeEnabled(true);
      setIsScrubbing(false);
    } else {
      setVolumeEnabled(false);
      setIsScrubbing(true);
      showScrubberTemporarily();
    }
  }, [isScrubbing, setVolumeEnabled, showScrubberTemporarily]);

  const handleForwardScroll = useCallback(() => {
    if (isScrubbing && player) {
      const newTime = Math.min((player.getCurrentTime() || 0) + 5, player.getDuration() || 0);
      player.seekTo(newTime, true);
      setCurrentTime(newTime);
      showScrubberTemporarily();
    } else {
      increaseVolume();
    }
  }, [isScrubbing, player, increaseVolume, showScrubberTemporarily]);

  const handleBackwardScroll = useCallback(() => {
    if (isScrubbing && player) {
      const newTime = Math.max((player.getCurrentTime() || 0) - 5, 0);
      player.seekTo(newTime, true);
      setCurrentTime(newTime);
      showScrubberTemporarily();
    } else {
      decreaseVolume();
    }
  }, [isScrubbing, player, decreaseVolume, showScrubberTemporarily]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEventListener<IpodEvent>("centerclick", handleCenterClick);
  useEventListener<IpodEvent>("playpauseclick", handlePlayPauseClick);
  useEventListener<IpodEvent>("forwardclick", handleForwardClick);
  useEventListener<IpodEvent>("backwardclick", handleBackwardClick);
  useEventListener<IpodEvent>("forwardscroll", handleForwardScroll);
  useEventListener<IpodEvent>("backwardscroll", handleBackwardScroll);

  const percent = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
  const isOverlayVisible = (!isScrubbing && volumeActive) || (isScrubbing && scrubberActive);

  return (
    <Container>
      <IframeWrapper ref={containerRef} />
      
      <VideoControlsOverlay $isVisible={isOverlayVisible}>
        {isScrubbing ? (
          <ScrubberGrid>
            <TimeText $align="left">{formatTime(currentTime)}</TimeText>
            <ProgressBar percent={percent} isScrubber />
            <TimeText $align="right">-{formatTime(duration - currentTime)}</TimeText>
          </ScrubberGrid>
        ) : (
          <div style={{ padding: '0 4px' }}>
            <VolumeBar percent={volume * 100} />
          </div>
        )}
      </VideoControlsOverlay>
    </Container>
  );
};

export default VideoPlayerView;
