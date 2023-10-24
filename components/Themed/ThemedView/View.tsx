import { View, ViewProps } from "react-native";
import { useMemo } from "react";
import { useTheme } from "../../../theme/context";

export const ThemedView = (props: ViewProps & { stretch?: boolean }) => {
  const { backgroundColor } = useTheme();
  const wrapperStyle = useMemo(() => [{ backgroundColor, flex: props.stretch ? 1 : 0 }, props.style], [backgroundColor, props.stretch, props.style]);
  return <View {...props} style={wrapperStyle} />;
};
