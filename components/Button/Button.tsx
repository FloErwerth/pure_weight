import { PropsWithChildren, useMemo } from "react";
import { Pressable, Text, TextStyle, ViewStyle } from "react-native";
import { styles } from "./styles";

export type ButtonThemes = "primary" | "secondary" | "ghost";
interface ButtonProps extends PropsWithChildren {
  onPress?: () => void;
  title?: string;
  disabled?: boolean;
  theme?: ButtonThemes;
  style?: { button?: ViewStyle; text?: TextStyle };
}
export const Button = ({ onPress, children, theme = "primary", title, disabled, style }: ButtonProps) => {
  const internalStyles = useMemo(() => styles(theme, disabled), [disabled, theme]);
  return (
    <Pressable style={[internalStyles.button, style?.button, theme !== "ghost" && internalStyles.wrapper]} onPress={onPress}>
      {title && <Text style={[internalStyles.text, internalStyles.commonText, style?.text]}>{title}</Text>}
      {children}
    </Pressable>
  );
};
