import { PropsWithChildren, useMemo } from "react";
import { Pressable, Text } from "react-native";
import { styles } from "./styles";
export type ButtonThemes = "primary" | "secondary" | "ghost";
interface ButtonProps extends PropsWithChildren {
  onPress?: () => void;
  title?: string;
  theme: ButtonThemes;
}
export const Button = ({ onPress, children, theme, title }: ButtonProps) => {
  const style = useMemo(() => styles(theme), [theme]);
  return (
    <Pressable style={[style.button, style.wrapper]} onPress={onPress}>
      <Text style={[style.text, style.commonText]}>{title}</Text>
      {children}
    </Pressable>
  );
};
