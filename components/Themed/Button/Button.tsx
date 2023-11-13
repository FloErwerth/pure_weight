import { PropsWithChildren, RefObject, useCallback, useMemo } from "react";
import { Pressable, Text, TextStyle, View, ViewProps, ViewStyle } from "react-native";
import { styles } from "./styles";
import * as Haptics from "expo-haptics";
import { HStack } from "../../Stack/HStack/HStack";
import { useTheme } from "../../../theme/context";

export type ButtonThemes = "primary" | "secondary" | "ghost";
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
  const { primaryColor, mainColor, secondaryBackgroundColor } = useTheme();

  const computedBackgroundColor = useMemo(() => {
    if (theme === "primary") {
      return primaryColor;
    }
    if (theme === "secondary") {
      return secondaryBackgroundColor;
    }
    return "transparent";
  }, [primaryColor, secondaryBackgroundColor, theme]);

  const buttonStyles = useMemo(() => [{ backgroundColor: computedBackgroundColor }, styles.button, style?.button], [computedBackgroundColor, style?.button]);
  const textStyles = useMemo(() => [styles.text, { color: mainColor }], [mainColor]);
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
