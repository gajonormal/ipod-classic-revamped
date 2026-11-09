import { useCallback, useState } from "react";

import { useViewContext } from "@/hooks";
import { useEventListener } from "@/hooks/utils";

interface KeyboardInputHook {
  value: string;
  showKeyboard: () => void;
}

interface Props {
  initialValue?: string;
  onEnterPress?: () => void;
  onChange?: (value: string) => void;
}

const useKeyboardInput = ({
  initialValue = "",
  onEnterPress = () => {},
  onChange = () => {},
}: Props = {}): KeyboardInputHook => {
  const {
    showKeyboard: showKeyboardView,
    hideView,
    viewStack,
  } = useViewContext();
  const [value, setValue] = useState(initialValue);

  const showKeyboard = useCallback(() => {
    showKeyboardView({ id: "keyboard" });
  }, [showKeyboardView]);

  useEventListener("input", ({ detail }: CustomEvent<{ key: string }>) => {
    if (viewStack.at(-1)?.type !== "keyboard") return;
    const { key } = detail;

    if (key === "Enter") {
      onEnterPress();
      hideView("keyboard");
      return;
    }

    setValue((prevValue) => {
      let newValue = prevValue;

      if (key === "Backspace" || key === "delete") {
        newValue = prevValue.slice(0, -1);
      } else if (key === " ") {
        newValue = `${prevValue} `;
      } else {
        newValue = `${prevValue}${key}`;
      }

      onChange(newValue);
      return newValue;
    });
  });

  return {
    value,
    showKeyboard,
  };
};

export default useKeyboardInput;
