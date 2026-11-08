import { useSettings } from "@/hooks";
import styled from "styled-components";
import { Unit } from "@/utils/constants";
import sadMacIcon from "@public/sad_mac.svg";

const RootContainer = styled.div`
  display: grid;
  place-content: center;
  text-align: center;
  height: 100%;
  background: white;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 60px;
  width: 60px;
  margin: auto;
`;

const StyledImg = styled.img`
  position: absolute;
  top: 0%;
  left: 0;
  height: 100%;
  width: 100%;
  transition: all 0.5s ease-in-out;
`;

const Title = styled.h3`
  margin: ${Unit.XS} 0 ${Unit.XXS};
  font-weight: bold;
  font-size: 18px;
`;

const Text = styled.p`
  font-size: 14px;
  margin: 0;
  max-width: 120px;
  color: rgb(100, 100, 100);
`;

const strings = {
  title: "YouTube",
  defaultMessage: "Sign in to view this content",
  offlineTitle: "Offline",
  offlineMessage: "Connect to the internet to view this content",
};

interface Props {
  message?: string;
}

const AuthPrompt = ({ message }: Props) => {
  const { isOffline } = useSettings();

  if (isOffline) {
    return (
      <RootContainer>
        <ImageContainer>
          <StyledImg alt="offline" src={sadMacIcon.src} />
        </ImageContainer>
        <Title>{strings.offlineTitle}</Title>
        <Text>{strings.offlineMessage}</Text>
      </RootContainer>
    );
  }

  return (
    <RootContainer>
      <Title>{strings.title}</Title>
      <Text>{message ?? strings.defaultMessage}</Text>
    </RootContainer>
  );
};

export default AuthPrompt;
