import { ThemedPressable } from "../Pressable/Pressable";
import { useCallback, useEffect, useMemo } from "react";
import { useTheme } from "../../../theme/context";
import { ThemedMaterialCommunityIcons } from "../ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { HStack } from "../../HStack/HStack";
import { Text } from "../ThemedText/Text";
import { styles } from "./styles";
import { ThemedView } from "../ThemedView/View";
import { borderRadius } from "../../../theme/border";
import { Pressable } from "react-native";

interface CheckBoxProps {
  checked: boolean;
  onChecked: (checked: boolean) => void;
  size?: number;
  label: string;
  helpText?: string;
}

export const CheckBox = ({ checked, onChecked, size = 20, label, helpText }: CheckBoxProps) => {
  const { inputFieldBackgroundColor } = useTheme();
  const opacity = useSharedValue(0);
  const checkBoxWrapperStyle = useMemo(() => ({ borderRadius: borderRadius < size ? size / 4 : borderRadius, width: size, height: size }), [inputFieldBackgroundColor, size]);
  const checkStyle = useMemo(() => ({ opacity: opacity }), [opacity]);

  useEffect(() => {
    opacity.value = withTiming(checked ? 1 : 0, { duration: 100 });
  }, [checked]);

  const handleCheck = useCallback(() => {
    onChecked(!checked);
  }, [checked, onChecked]);

  return (
    <ThemedPressable ghost onPress={handleCheck}>
      <HStack input style={styles.wrapper}>
        <Text style={styles.text}>{label}</Text>
        <HStack style={{ gap: 10 }}>
          <ThemedView component style={checkBoxWrapperStyle}>
            <Animated.View style={checkStyle}>
              <ThemedMaterialCommunityIcons ghost name="check" size={size} />
            </Animated.View>
          </ThemedView>
          {helpText && (
            <Pressable>
              <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={size} />
            </Pressable>
          )}
        </HStack>
      </HStack>
    </ThemedPressable>
  );
};