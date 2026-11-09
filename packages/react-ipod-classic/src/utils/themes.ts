import * as Theme from "@/utils/constants/Theme";

const supportedThemes = {
  silver: "silver",
  black: "black",
  u2: "u2",
  mnelia: "mnelia",
};

export type DeviceThemeName = keyof typeof supportedThemes;

export const getTheme = (deviceTheme: DeviceThemeName): Theme.DeviceTheme => {
  switch (deviceTheme) {
    case "black":
      return Theme.Black;
    case "u2":
      return Theme.U2;
    case "mnelia":
      return Theme.Mnelia;
    default:
      return Theme.Silver;
  }
};
