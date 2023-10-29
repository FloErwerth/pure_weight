import { PropsWithChildren, RefObject, useCallback, useMemo } from "react";
import { Pressable, Text, TextStyle, View, ViewProps, ViewStyle } from "react-native";
import { styles } from "./styles";
import * as Haptics from "expo-haptics";
import { HStack } from "../../HStack/HStack";
import { useTheme } from "../../../theme/context";

export type ButtonThemes = "primary" | "ghost";
interface ButtonProps extends PropsWithChildren {
  onPress?: () => void;
  title?: string;
  disabled?: boolean;
  theme?: ButtonThemes;
  style?: { button?: ViewStyle; text?: TextStyle };
  reference?: RefObject<View>;
  onLayout?: ViewProps["onLayout"];
}
export const Button = ({ onLayout, onPress, children, theme = "primary", title, disabled, style, reference }: ButtonProps) => {
  const { primaryColor, mainColor } = useTheme();
  const buttonStyles = useMemo(() => [{ backgroundColor: theme === "primary" ? primaryColor : "transparent" }, styles.button, style?.button], [primaryColor, style, theme]);
  const textStyles = useMemo(() => [styles.text, { backgroundColor: primaryColor, color: mainColor }], [mainColor, primaryColor]);
  const handlePress = useCallback(() => {
    if (onPress) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress?.();
    }
  }, [onPress]);

  return (
    <Pressable onLayout={onLayout} ref={reference} disabled={disabled} style={buttonStyles} onPress={handlePress}>
      <HStack>
        {title && <Text style={[textStyles, style?.text]}>{title}</Text>}
        {children}
      </HStack>
    </Pressable>
  );
};
