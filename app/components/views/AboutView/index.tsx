import { SelectableList, SelectableListOption } from "@/components";
import { useSelectableList } from "@/hooks";
import styled from "styled-components";
import { Unit } from "@/utils/constants";
import { APP_URL } from "@/utils/constants/api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  height: ${Unit.XL};
  width: auto;
  margin: ${Unit.XS};
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${Unit.MD} ${Unit.MD} 0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 900;
`;

const Description = styled.h3`
  margin: 0 0 ${Unit.MD};
  font-size: 14px;
  font-weight: normal;
  text-align: center;
`;

const ListContainer = styled.div`
  flex: 1;
`;

const AboutView = () => {
  const options: SelectableListOption[] = [
    {
      type: "link",
      label: "GitHub Repo",
      url: "https://github.com/gajonormal/ipod-classic-revamped",
    },
    {
      type: "link",
      label: "Original Repo",
      url: "https://github.com/tvillarete/ipod-classic-js",
    },
    {
      type: "link",
      label: "Tanner's Website",
      url: "http://tannerv.com",
    },
  ];

  const { activeIndex: scrollIndex } = useSelectableList({ viewId: "about", options });

  return (
    <Container>
      <ListContainer>
        <TitleContainer>
          <Image alt="iPod" src={`${APP_URL}/ipod_logo.svg`} />
          <Title>iPod.js Revamped</Title>
        </TitleContainer>
        <Description>
          Revamped by gajonormal<br />
          <span style={{ fontSize: "11px", opacity: 0.7 }}>Original by Tanner Villarete</span>
        </Description>
        <SelectableList options={options} activeIndex={scrollIndex} />
      </ListContainer>
    </Container>
  );
};

export default AboutView;
