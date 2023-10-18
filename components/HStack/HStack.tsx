import { View, ViewProps } from "react-native";
import { styles } from "./styles";

export function HStack(props: ViewProps) {
  return <View style={[styles.innerWrapper, props.style]}>{props.children}</View>;
}
