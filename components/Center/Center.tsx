import { StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./styles";
import { PropsWithChildren } from "react";

interface CenterProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function Center({ children, style }: CenterProps) {
  return <View style={[styles.innerWrapper, style]}>{children}</View>;
}
