import { ViewProps } from "react-native";
import { useTheme } from "../../../theme/context";
import { ThemedView } from "../ThemedView/View";
import { useMemo } from "react";

export const ComponentBackground = (props: ViewProps) => {
  const { componentBackgroundColor } = useTheme();
  const themedStyle = useMemo(() => [{ backgroundColor: componentBackgroundColor }, props.style], [componentBackgroundColor, props.style]);
  return <ThemedView {...props} style={themedStyle} />;
};
