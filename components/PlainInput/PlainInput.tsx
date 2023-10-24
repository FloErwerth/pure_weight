import { KeyboardType, StyleProp, TextInput, TextStyle, ViewStyle } from "react-native";
import { HStack } from "../HStack/HStack";
import { mainColor, secondaryColor } from "../App/theme/colors";
import { useRef } from "react";
import { ThemedTextInput } from "../TextInput/ThemedTextInput";

interface PlainInputProps {
  placeholder?: string;
  fontSize?: number;
  value?: string;
  setValue: (value?: string) => void;
  suffix?: string;
  keyboardType?: KeyboardType;
  style?: StyleProp<ViewStyle | TextStyle>;
  showClear?: boolean;
  autoFocus?: boolean;
}
export const PlainInput = ({ keyboardType, placeholder, fontSize = 14, value, setValue, style, autoFocus, showClear }: PlainInputProps) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <HStack>
      <ThemedTextInput
        autoFocus={autoFocus}
        clearButtonMode={showClear ? "while-editing" : "never"}
        hideErrorBorder={true}
        errorKey="workout_name"
        reference={inputRef}
        returnKeyType="done"
        keyboardType={keyboardType}
        onChangeText={setValue}
        value={value}
        placeholderTextColor={secondaryColor}
        placeholder={placeholder}
        style={[{ fontSize, color: mainColor, backgroundColor: "transparent", flex: 1 }, style]}
      ></ThemedTextInput>
    </HStack>
  );
};
