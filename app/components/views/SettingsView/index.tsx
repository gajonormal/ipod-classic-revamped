import { useCallback, useMemo } from "react";
import { useGoogleLogin } from "@react-oauth/google";

import { getConditionalOption } from "@/components/SelectableList";
import SelectableList, {
  SelectableListOption,
} from "@/components/SelectableList";
import { SplitScreenPreview } from "@/components/previews";
import {
  useAudioPlayer,
  useSelectableList,
  useSettings,
} from "@/hooks";

const THEMES = ["silver", "black", "u2"] as const;

const SERVICE_LABELS = {
  youtube: "YouTube",
} as const;

const formatCurrentLabel = (label: string, isCurrent: boolean) =>
  `${label}${isCurrent ? " (Current)" : ""}`;

const getThemeLabel = (theme: (typeof THEMES)[number]) => {
  if (theme === "u2") return "U2 Edition";
  return theme.charAt(0).toUpperCase() + theme.slice(1);
};

const SettingsView = () => {
  const {
    isAuthorized,
    isYoutubeAuthorized,
    setYoutubeToken,
    isOffline,
    service,
    deviceTheme,
    setDeviceTheme,
    shuffleMode,
    repeatMode,
    hapticsEnabled,
    setHapticsEnabled,
  } = useSettings();
  const { setShuffleMode, setRepeatMode, reset } = useAudioPlayer();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setYoutubeToken(tokenResponse.access_token);
    },
    scope: "https://www.googleapis.com/auth/youtube.readonly",
  });

  const createResetHandler = useCallback(
    (handler: () => void | Promise<void>) => () => {
      reset();
      handler();
    },
    [reset]
  );

  const themeOptions: SelectableListOption[] = useMemo(
    () =>
      THEMES.map((theme) => ({
        type: "action",
        isSelected: deviceTheme === theme,
        label: formatCurrentLabel(getThemeLabel(theme), deviceTheme === theme),
        onSelect: () => setDeviceTheme(theme),
      })),
    [deviceTheme, setDeviceTheme]
  );

  const signInOptions: SelectableListOption[] = useMemo(
    () => [
      {
        type: "action",
        label: "Sign in with YouTube",
        onSelect: () => login(),
      },
    ],
    [login]
  );

  const signOutOptions: SelectableListOption[] = useMemo(
    () => [
      {
        type: "action",
        label: "Sign out of YouTube",
        onSelect: createResetHandler(() => setYoutubeToken(undefined)),
      },
    ],
    [createResetHandler, setYoutubeToken]
  );

  const options: SelectableListOption[] = useMemo(
    () => [
      {
        type: "view",
        label: "About",
        viewId: "about",
        preview: SplitScreenPreview.Settings,
      },
      ...getConditionalOption(isAuthorized, {
        type: "actionSheet",
        id: "shuffle-mode-action-sheet",
        label: "Shuffle",
        listOptions: [
          {
            type: "action",
            isSelected: shuffleMode === "off",
            label: `Off ${shuffleMode === "off" ? "(Current)" : ""}`,
            onSelect: () => setShuffleMode("off"),
          },
          {
            type: "action",
            isSelected: shuffleMode === "songs",
            label: `Songs ${shuffleMode === "songs" ? "(Current)" : ""}`,
            onSelect: () => setShuffleMode("songs"),
          },
          {
            type: "action",
            isSelected: shuffleMode === "albums",
            label: `Albums ${shuffleMode === "albums" ? "(Current)" : ""}`,
            onSelect: () => setShuffleMode("albums"),
          },
        ],
        preview: SplitScreenPreview.Settings,
      }),
      ...getConditionalOption(isAuthorized, {
        type: "actionSheet",
        id: "repeat-mode-action-sheet",
        label: "Repeat",
        listOptions: [
          {
            type: "action",
            isSelected: repeatMode === "off",
            label: `Off ${repeatMode === "off" ? "(Current)" : ""}`,
            onSelect: () => setRepeatMode("off"),
          },
          {
            type: "action",
            isSelected: repeatMode === "one",
            label: `One ${repeatMode === "one" ? "(Current)" : ""}`,
            onSelect: () => setRepeatMode("one"),
          },
          {
            type: "action",
            isSelected: repeatMode === "all",
            label: `All ${repeatMode === "all" ? "(Current)" : ""}`,
            onSelect: () => setRepeatMode("all"),
          },
        ],
        preview: SplitScreenPreview.Settings,
      }),
      {
        type: "actionSheet",
        id: "device-theme-action-sheet",
        label: "Device theme",
        listOptions: themeOptions,
        preview: SplitScreenPreview.Theme,
      },
      {
        type: "actionSheet",
        id: "haptics-action-sheet",
        label: "Haptic feedback",
        listOptions: [
          {
            type: "action",
            isSelected: hapticsEnabled,
            label: `On ${hapticsEnabled ? "(Current)" : ""}`,
            onSelect: () => setHapticsEnabled(true),
          },
          {
            type: "action",
            isSelected: !hapticsEnabled,
            label: `Off ${!hapticsEnabled ? "(Current)" : ""}`,
            onSelect: () => setHapticsEnabled(false),
          },
        ],
        preview: SplitScreenPreview.Settings,
      },
      ...getConditionalOption(!isYoutubeAuthorized, {
        type: "actionSheet",
        id: "signin-popup",
        label: "Sign in",
        listOptions: signInOptions,
        preview: SplitScreenPreview.Music,
      }),
      ...getConditionalOption(isYoutubeAuthorized, {
        type: "actionSheet",
        id: "sign-out-popup",
        label: "Sign out",
        listOptions: signOutOptions,
        preview: SplitScreenPreview.Service,
      }),
    ],
    [
      isAuthorized,
      isYoutubeAuthorized,
      themeOptions,
      signInOptions,
      signOutOptions,
      shuffleMode,
      setShuffleMode,
      repeatMode,
      setRepeatMode,
      hapticsEnabled,
      setHapticsEnabled,
    ]
  );

  const { activeIndex: scrollIndex } = useSelectableList({ viewId: "settings", options });

  return <SelectableList options={options} activeIndex={scrollIndex} />;
};

export default SettingsView;
