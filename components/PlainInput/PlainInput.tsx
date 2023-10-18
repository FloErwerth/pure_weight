import { KeyboardType, Pressable, StyleProp, TextInput, TextStyle, ViewStyle } from "react-native";
import { styles } from "./styles";
import { Text } from "../Text/Text";
import { HStack } from "../HStack/HStack";
import { mainColor, secondaryColor } from "../../app/theme/colors";
import { useRef } from "react";

interface PlainInputProps {
  placeholder?: string;
  fontSize?: number;
  value?: string;
  setValue: (value?: string) => void;
  suffix?: string;
  keyboardType?: KeyboardType;
  style?: StyleProp<ViewStyle | TextStyle>;
}
export const PlainInput = ({ keyboardType, placeholder, fontSize = 14, value, setValue, suffix, style }: PlainInputProps) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <Pressable style={[style, styles.wrapper]} onPress={() => inputRef.current?.focus()}>
      <HStack>
        <TextInput
          ref={inputRef}
          returnKeyType="done"
          keyboardType={keyboardType}
          onChangeText={setValue}
          value={value}
          placeholderTextColor={secondaryColor}
          placeholder={placeholder}
          style={{ fontSize, color: mainColor }}
        ></TextInput>
        {suffix && value && <Text style={{ fontSize, marginLeft: 5, color: mainColor }}>{suffix}</Text>}
      </HStack>
    </Pressable>
  );
};
