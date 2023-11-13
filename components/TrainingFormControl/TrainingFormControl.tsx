import { InputModeOptions, Text, TextInput, View } from "react-native";
import { styles } from "./styles";

export interface CreateTrainingFormControlProps {
  label: string;
  setValue: (value?: string) => void;
  value?: string;
  inputMode?: InputModeOptions;
}
export const TrainingFormControl = ({ label, setValue, value, inputMode }: CreateTrainingFormControlProps) => {
  return (
    <View style={styles.innerWrapper}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ width: 50, fontWeight: "200" }}>{label}</Text>
        <TextInput inputMode={inputMode} style={{ padding: 20, width: "100%" }} onChangeText={setValue} value={value}></TextInput>
      </View>
    </View>
  );
};
