import { View, ViewProps } from "react-native";
import { useMemo } from "react";
import { useTheme } from "../../../theme/context";

export const ThemedView = (props: ViewProps & { stretch?: boolean; component?: boolean; secondary?: boolean }) => {
  const { backgroundColor, componentBackgroundColor, secondaryBackgroundColor } = useTheme();

  const computedBackgroundColor = useMemo(() => {
    if (props.component) {
      return componentBackgroundColor;
    }
    if (props.secondary) {
      return secondaryBackgroundColor;
    }
    return backgroundColor;
  }, [backgroundColor, componentBackgroundColor, props.component, props.secondary, secondaryBackgroundColor]);

  const wrapperStyle = useMemo(() => [{ backgroundColor: computedBackgroundColor, flex: props.stretch ? 1 : 0 }, props.style], [computedBackgroundColor, props.stretch, props.style]);
  return <View {...props} style={wrapperStyle} />;
};
