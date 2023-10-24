import { View, ViewProps } from "react-native";
import { backgroundColor } from "../App/theme/colors";
import { useMemo } from "react";

export const ThemedView = (props: ViewProps & { stretch?: boolean }) => {
  const wrapperStyle = useMemo(() => [{ backgroundColor, flex: props.stretch ? 1 : 0 }, props.style], [props.stretch, props.style]);
  return <View {...props} style={wrapperStyle} />;
};
