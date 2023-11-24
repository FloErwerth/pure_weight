import { KeyboardType, StyleProp, TextInput, TextStyle, ViewStyle } from "react-native";
import { useMemo, useRef } from "react";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useTheme } from "../../theme/context";
import { styles } from "./styles";

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
    const { mainColor, secondaryColor } = useTheme();
    const textInputStyles = useMemo(() => [styles.inputStyle, { fontSize, color: mainColor }, style], [fontSize, mainColor, style]);
    return (
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
            style={textInputStyles}
        />
    );
};
