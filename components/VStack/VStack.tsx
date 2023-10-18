import { StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./styles";
import { PropsWithChildren } from "react";

interface VStackProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function VStack({ children, style }: VStackProps) {
  return <View style={[styles.innerWrapper, style]}>{children}</View>;
}
