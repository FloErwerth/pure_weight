import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useMemo } from "react";
import { EditableExerciseTheme, styles } from "./styles";
import { useTranslation } from "react-i18next";
import { AppState, ErrorFields } from "../../store/types";
import { useAppSelector } from "../../store";
import { getErrorByKey } from "../../store/selectors";
import { Center } from "../Center/Center";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";

interface EditableExerciseInputRowProps {
  value?: string;
  setValue: (value: string) => void;
  theme?: EditableExerciseTheme;
  errorKey?: ErrorFields;
  i18key?: string;
}
export const EditableExerciseInputRow = ({ theme, value, setValue, errorKey, i18key }: EditableExerciseInputRowProps) => {
  const { t } = useTranslation();
  const { errorColor } = useTheme();
  const classes = useMemo(() => styles(theme), [theme]);
  const hasError = useAppSelector((state: AppState) => getErrorByKey(state)(errorKey));
  return (
    <Center style={classes.wrapper}>
      <ThemedTextInput
        errorKey={errorKey}
        inputMode="decimal"
        textAlign="center"
        style={[{ borderColor: hasError ? errorColor : "transparent" }, classes.input]}
        onChangeText={setValue}
        value={value}
      ></ThemedTextInput>
      <Text>{t(i18key ?? "")}</Text>
    </Center>
  );
};
