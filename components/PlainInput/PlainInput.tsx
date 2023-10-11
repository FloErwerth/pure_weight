import { StyleSheet, TextInput } from "react-native";
import { styles } from "./styles";
import { useMemo } from "react";

interface PlainInputProps {
  placeholder?: string;
  fontSize?: number;
  value?: string;
  setValue: (value?: string) => void;
  suffix?: string;
}
export const PlainInput = ({ placeholder, fontSize = 14, value, setValue, suffix }: PlainInputProps) => {
  const inputStyles = useMemo(() => StyleSheet.create({ wrapper: { fontSize, ...styles.wrapper } }), [fontSize]);
  const combinedValue = useMemo(() => value?.concat(suffix ?? ""), [value, suffix]);
  return <TextInput onChangeText={setValue} value={combinedValue} placeholderTextColor="lightgrey" placeholder={placeholder} style={inputStyles.wrapper}></TextInput>;
};
