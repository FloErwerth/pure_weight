import { StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./styles";
import { PropsWithChildren } from "react";

interface HStackProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function HStack({ children, style }: HStackProps) {
  return <View style={[styles.wrapper, style]}>{children}</View>;
}
