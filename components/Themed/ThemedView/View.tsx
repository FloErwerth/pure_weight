import { View, ViewProps } from "react-native";
import { useMemo } from "react";
import { useTheme } from "../../../theme/context";

export interface ThemedViewProps extends ViewProps {
  stretch?: boolean;
  component?: boolean;
  secondary?: boolean;
  ghost?: boolean;
  input?: boolean;
}

export const ThemedView = (props: ThemedViewProps) => {
  const { backgroundColor, componentBackgroundColor, secondaryBackgroundColor, inputFieldBackgroundColor } = useTheme();

  const computedBackgroundColor = useMemo(() => {
    if (props.component) {
      return componentBackgroundColor;
    }
    if (props.input) {
      return inputFieldBackgroundColor;
    }
    if (props.ghost) {
      return "transparent";
    }
    if (props.secondary) {
      return secondaryBackgroundColor;
    }
    return backgroundColor;
  }, [backgroundColor, componentBackgroundColor, props.component, props.ghost, props.secondary, secondaryBackgroundColor]);

  const wrapperStyle = useMemo(() => [{ backgroundColor: computedBackgroundColor, flex: props.stretch ? 1 : 0 }, props.style], [computedBackgroundColor, props.stretch, props.style]);
  return <View {...props} style={wrapperStyle} />;
};
