import { Animated, KeyboardType, Pressable, StyleProp, TextStyle, TouchableWithoutFeedback, ViewStyle } from "react-native";
import { styles } from "./styles";
import { Text } from "../Text/Text";
import { HStack } from "../HStack/HStack";
import { mainColor, secondaryColor } from "../App/theme/colors";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThemedTextInput } from "../TextInput/ThemedTextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface PlainInputProps {
  placeholder?: string;
  fontSize?: number;
  value?: string;
  setValue: (value?: string) => void;
  suffix?: string;
  keyboardType?: KeyboardType;
  style?: StyleProp<ViewStyle | TextStyle>;
  showDeleteX?: boolean;
}
export const PlainInput = ({ keyboardType, placeholder, fontSize = 14, value, setValue, suffix, style, showDeleteX = false }: PlainInputProps) => {
  const [hasFocus, setHasFocus] = useState(false);
  const showClear = useMemo(() => showDeleteX && hasFocus && Boolean(value), [hasFocus, showDeleteX, value]);
  const iconSize = useMemo(() => Math.max(12, fontSize - 4), [fontSize]);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: showClear ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [opacity, showClear]);

  const handleSetFocus = useCallback(() => {
    if (showDeleteX) {
      setHasFocus(true);
    }
  }, [showDeleteX]);

  const handleBlur = useCallback(() => {
    if (showDeleteX) {
      setHasFocus(false);
    }
  }, [showDeleteX]);
  const handleClear = useCallback(() => {
    setValue("");
  }, [setValue]);

  return (
    <Pressable style={[style, styles.wrapper]} onPress={handleSetFocus}>
      <HStack style={[styles.innerWrapper, { justifyContent: showClear ? "space-around" : "flex-start" }]}>
        <HStack style={{ flex: 1 }}>
          <ThemedTextInput
            onFocus={handleSetFocus}
            autoFocus={true}
            onBlur={handleBlur}
            hideErrorBorder={true}
            errorKey="workout_name"
            returnKeyType="done"
            keyboardType={keyboardType}
            onChangeText={setValue}
            value={value}
            placeholderTextColor={secondaryColor}
            placeholder={placeholder}
            style={{ fontSize, color: mainColor, backgroundColor: "transparent" }}
          ></ThemedTextInput>
          {suffix && value && <Text style={{ fontSize, marginLeft: 5, color: mainColor }}>{suffix}</Text>}
        </HStack>
        <Animated.View style={{ opacity }}>
          <TouchableWithoutFeedback style={[styles.clearWrapper, { opacity }]} onPress={handleClear}>
            <MaterialCommunityIcons name="close-circle" size={iconSize} color={mainColor} />
          </TouchableWithoutFeedback>
        </Animated.View>
      </HStack>
    </Pressable>
  );
};
