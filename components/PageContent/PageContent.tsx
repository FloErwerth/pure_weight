import { PropsWithChildren } from "react";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";
import { StyleProp, ViewStyle } from "react-native";

interface PageContentProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}
export const PageContent = ({ children, style }: PageContentProps) => {
  return (
    <ThemedView background style={[styles.wrapper, style]}>
      {children}
    </ThemedView>
  );
};
