import { useMemo } from "react";
import { useTheme } from "../theme/context";

interface ComputedBackgroundColorProps {
  component?: boolean;
  secondary?: boolean;
  ghost?: boolean;
  input?: boolean;
}
export const useComputedBackgroundColor = (props: ComputedBackgroundColorProps) => {
  const { componentBackgroundColor, secondaryBackgroundColor, backgroundColor, inputFieldBackgroundColor } = useTheme();

  return useMemo(() => {
    if (props.component) {
      return componentBackgroundColor;
    }
    if (props.ghost) {
      return "transparent";
    }
    if (props.secondary) {
      return secondaryBackgroundColor;
    }
    if (props.input) {
      return inputFieldBackgroundColor;
    }
    return backgroundColor;
  }, [backgroundColor, componentBackgroundColor, inputFieldBackgroundColor, props.component, props.ghost, props.input, props.secondary, secondaryBackgroundColor]);
};
