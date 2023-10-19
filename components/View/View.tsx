import { View, ViewProps } from "react-native";
import { backgroundColor } from "../App/theme/colors";

export const ThemedView = (props: ViewProps) => {
  return <View {...props} style={[{ backgroundColor }, props.style]} />;
};
