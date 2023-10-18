import { ThemedTextInput } from "../TextInput/ThemedTextInput";
import { Text } from "react-native";
import { Center } from "../Center/Center";
import { Dispatch, SetStateAction, useMemo } from "react";
import { EditableExerciseTheme, styles } from "./styles";
import { useTranslation } from "react-i18next";
import { AppState, ErrorFields } from "../../store/types";
import { useAppSelector } from "../../store";
import { getErrorByKey } from "../../store/selectors";
import { errorColor } from "../../app/theme/colors";

interface EditableExerciseInputRowProps {
  value?: string;
  setValue: Dispatch<SetStateAction<string | undefined>>;
  theme?: EditableExerciseTheme;
  errorKey?: ErrorFields;
  i18key?: string;
}
export const EditableExerciseInputRow = ({ theme, value, setValue, errorKey, i18key }: EditableExerciseInputRowProps) => {
  const { t } = useTranslation();
  const classes = useMemo(() => styles(theme), [theme]);
  const hasError = useAppSelector((state: AppState) => getErrorByKey(state)(errorKey));
  return (
    <Center style={{ width: "25%" }}>
      <ThemedTextInput
        errorKey={errorKey}
        inputMode="decimal"
        textAlign="center"
        style={[{ borderWidth: 1, borderColor: hasError ? errorColor : "transparent" }, classes.input]}
        onChangeText={setValue}
        value={value}
      ></ThemedTextInput>
      <Text style={classes.text}>{t(i18key ?? "")}</Text>
    </Center>
  );
};
