import React, { useEffect, useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { useAudioPlayer, useEventListener, useVolumeHandler } from "@/hooks";
import useMenuHideView from "@/hooks/navigation/useMenuHideView";
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
  
  /* The iframe will be injected here by YouTube */
  iframe {
    position: absolute;
    top: -80px; /* Push top UI out of bounds */
    left: 0;
    
    /* SCALE TRICK: Render at 400% (1280px wide) to force Desktop UI, 
       which does NOT have a central pause button when controls=1. */
    width: 400%;
    height: calc(400% + 640px); /* 4x of (100% + 160px) */
    transform: scale(0.25);
    transform-origin: top left;
    
    border: none;
    pointer-events: none; /* Let the ClickWheel handle all interactions */
  }
`;

const VideoControlsOverlay = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  padding: 8px 12px;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 4px;
  backdrop-filter: blur(4px);
`;

const ControlsText = styled.div`
  color: white;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 0.1s linear;
`;

const TimeText = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 10px;
  font-variant-numeric: tabular-nums;
`;

const VideoPlayerView = ({ videoId }: Props) => {
  const { pause, playbackInfo, volume } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(true);
  const [player, setPlayer] = useState<any>(null);
  const playerRef = useRef<any>(null);

  useMenuHideView("videoPlayer");

  const containerRef = useRef<HTMLDivElement>(null);

  // Pause background music when video view is mounted
  useEffect(() => {
    if (playbackInfo.isPlaying) {
      pause();
    }
  }, [pause, playbackInfo.isPlaying]);

  // Sync volume with global audio player
  useEffect(() => {
    if (player && typeof player.setVolume === 'function') {
      player.setVolume(globalVolume * 100);
    }
  }, [globalVolume, player]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create the target div manually to hide it from React
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
        // If YT API hasn't replaced the div, remove it.
        // If YT API replaced it with an iframe, the iframe is still a child of containerRef,
        // but it's a different node. We should just clean up all children to be safe.
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

  const { increaseVolume, decreaseVolume, volume: globalVolume, active: volumeActive, setEnabled: setVolumeEnabled } = useVolumeHandler();
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubberActive, setScrubberActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const scrubberTimeoutRef = useRef<any>(null);

  // Poll for current time
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

  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isOverlayVisible = (!isScrubbing && volumeActive) || (isScrubbing && scrubberActive);

  return (
    <Container>
      <IframeWrapper ref={containerRef} />
      
      <VideoControlsOverlay $isVisible={isOverlayVisible}>
        <ControlsText>
          {isScrubbing ? "Scrubbing" : "Volume"}
        </ControlsText>
        <ProgressBarContainer>
          <ProgressFill style={{ width: `${isScrubbing ? percent : globalVolume * 100}%` }} />
        </ProgressBarContainer>
        {isScrubbing && (
          <TimeText>
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(duration - currentTime)}</span>
          </TimeText>
        )}
      </VideoControlsOverlay>
    </Container>
  );
};

export default VideoPlayerView;
