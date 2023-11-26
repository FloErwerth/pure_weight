import { styles } from "./styles";
import { Text } from "react-native";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store";
import { AppState } from "../../store/types";
import { getErrorByKey } from "../../store/selectors";
import { cleanError } from "../../store/reducer";
import { useTheme } from "../../theme/context";
import { ThemedPressable } from "../Themed/Pressable/Pressable";

interface AddExerciseProps {
    onPress?: () => void;
    title?: string;
    disabled?: boolean;
}
export const AddButton = ({ onPress, title, disabled = false }: AddExerciseProps) => {
    const { textDisabled, mainColor } = useTheme();
    const { t } = useTranslation();
    const text = useMemo(() => title ?? t("add_exercise"), [title, t]);
    const textStyles = useMemo(() => ({ ...styles.text, color: disabled ? textDisabled : mainColor }), [disabled, mainColor, textDisabled]);
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state)("create_exercises_empty"));
    const dispatch = useAppDispatch();

    const handlePress = useCallback(() => {
        if (hasError) {
            dispatch(cleanError(["create_exercises_empty"]));
        }
        onPress?.();
    }, [dispatch, hasError, onPress]);

    return (
        <ThemedPressable disabled={disabled} style={styles.add} error={hasError} onPress={handlePress}>
            <Text style={textStyles}>{text}</Text>
        </ThemedPressable>
    );
};
