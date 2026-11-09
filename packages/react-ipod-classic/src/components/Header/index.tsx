import BatteryIndicator from "@/components/BatteryIndicator";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useAudioPlayer, useViewContext } from "@/hooks";
import { styled } from "styled-components";
import { ASSET_PLAY, ASSET_PAUSE } from "@/assets";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
  height: 20px;
  background: linear-gradient(180deg, #feffff 0%, #b1b6b9 100%);
  border-bottom: 1px solid #7995a3;
  min-width: 0;
  color: #000000;
`;

const Text = styled.h3`
  margin: 0;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
  color: #000000;
  font-weight: 700;
`;

const IconContainer = styled.div`
  display: flex;
`;

const Icon = styled.img`
  max-height: 12px;
  margin-left: 8px;
`;

const StyledBatteryIndicator = styled(BatteryIndicator)`
  margin-left: 8px;
`;

const Header = () => {
  const { headerTitle } = useViewContext();
  const { playbackInfo } = useAudioPlayer();

  const { isPlaying, isPaused, isLoading } = playbackInfo;

  return headerTitle ? (
    <Container>
      <Text>{headerTitle}</Text>
      <IconContainer>
        {isLoading && (
          <IconContainer>
            <LoadingIndicator size={10} />
          </IconContainer>
        )}
        {isPlaying && !isPaused && <Icon src={ASSET_PLAY} />}
        {isPaused && <Icon src={ASSET_PAUSE} />}
        <StyledBatteryIndicator />
      </IconContainer>
    </Container>
  ) : null;
};

export default Header;
