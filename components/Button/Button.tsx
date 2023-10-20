import { PropsWithChildren, RefObject, useCallback, useMemo } from "react";
import { Pressable, Text, TextStyle, View, ViewStyle } from "react-native";
import { styles } from "./styles";
import * as Haptics from "expo-haptics";
import {HStack} from "../HStack/HStack";

export type ButtonThemes = "primary" | "secondary" | "ghost";
interface ButtonProps extends PropsWithChildren {
  onPress?: () => void;
  title?: string;
  disabled?: boolean;
  theme?: ButtonThemes;
  style?: { button?: ViewStyle; text?: TextStyle };
  reference?: RefObject<View>;
}
export const Button = ({ onPress, children, theme = "primary", title, disabled, style, reference }: ButtonProps) => {
  const internalStyles = useMemo(() => styles(theme), [theme]);

  const handlePress = useCallback(() => {
    if (onPress) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress?.();
    }
  }, [onPress]);

  return (
    <Pressable ref={reference} disabled={disabled} style={[internalStyles.singleButton, style?.button]} onPress={handlePress}>
      <HStack>{title && <Text style={[internalStyles.text, internalStyles.commonText, style?.text]}>{title}</Text>}
        {children}</HStack>
    </Pressable>
  );
};
