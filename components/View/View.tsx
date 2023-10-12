import { View, ViewProps } from "react-native";
import { backgroundColor } from "../../app/theme/colors";

export const ThemedView = (props: ViewProps) => {
  return <View {...props} style={[{ backgroundColor }, props.style]} />;
};
