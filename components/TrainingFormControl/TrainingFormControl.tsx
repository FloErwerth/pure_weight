import { useMemo } from "react";
import { InputModeOptions, Text, TextInput, View } from "react-native";
import { styles } from "./styles";

export interface CreateTrainingFormControlProps {
  label: string;
  required?: boolean;
  setValue: (value?: string) => void;
  value?: string;
  inputMode?: InputModeOptions;
  helper?: string;
  errorText?: string;
}
export const TrainingFormControl = ({ required = false, label, setValue, value, inputMode, helper, errorText }: CreateTrainingFormControlProps) => {
  const showHelper = useMemo(() => !errorText && Boolean(helper), [errorText, helper]);
  return (
    <View style={styles.innerWrapper}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ width: 50, fontWeight: "200" }}>{label}</Text>
        <TextInput style={{ padding: 20, width: "100%" }} onChangeText={setValue} value={value}></TextInput>
      </View>
    </View>
  );
};
