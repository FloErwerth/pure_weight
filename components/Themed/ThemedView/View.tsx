import { View, ViewProps } from "react-native";
import { useMemo } from "react";
import { useTheme } from "../../../theme/context";

export const ThemedView = (props: ViewProps & { stretch?: boolean; component?: boolean }) => {
  const { backgroundColor, componentBackgroundColor } = useTheme();
  const wrapperStyle = useMemo(
    () => [{ backgroundColor: props.component ? componentBackgroundColor : backgroundColor, flex: props.stretch ? 1 : 0 }, props.style],
    [backgroundColor, componentBackgroundColor, props.component, props.stretch, props.style],
  );
  return <View {...props} style={wrapperStyle} />;
};
