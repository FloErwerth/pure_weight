import { styles } from "./styles";
import { Pressable, Text } from "react-native";
import { useCallback, useMemo } from "react";
import { errorColor, mainColor, mainDisabledColor } from "../App/theme/colors";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store";
import { AppState } from "../../store/types";
import { getErrorByKey } from "../../store/selectors";
import { cleanError } from "../../store/reducer";

interface AddExerciseProps {
  onPress?: () => void;
  title?: string;
  disabled?: boolean;
}
export const AddButton = ({ onPress, title, disabled = false }: AddExerciseProps) => {
  const { t } = useTranslation();
  const text = useMemo(() => title ?? t("add_exercise"), [title, t]);
  const textStyles = useMemo(() => ({ ...styles.text, color: disabled ? mainDisabledColor : mainColor }), [disabled]);
  const hasError = useAppSelector((state: AppState) => getErrorByKey(state)("create_exercises_empty"));
  const dispatch = useAppDispatch();

  const handlePress = useCallback(() => {
    if (hasError) {
      dispatch(cleanError(["create_exercises_empty"]));
    }
    onPress?.();
  }, [dispatch, hasError, onPress]);

  return (
    <Pressable disabled={disabled} style={[styles.add, { borderColor: hasError ? errorColor : "transparent" }]} onPress={handlePress}>
      <Text style={textStyles}>{text}</Text>
    </Pressable>
  );
};
