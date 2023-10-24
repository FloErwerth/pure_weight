import { StyleProp, ViewStyle } from "react-native";
import { styles } from "./styles";
import { PropsWithChildren } from "react";
import { ThemedView } from "../Themed/ThemedView/View";

interface VStackProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function VStack({ children, style }: VStackProps) {
  return <ThemedView style={[styles.innerWrapper, style]}>{children}</ThemedView>;
}
