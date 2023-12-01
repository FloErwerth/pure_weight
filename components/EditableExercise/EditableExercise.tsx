import { TextInput } from "react-native";
import { useCallback, useRef } from "react";
import { ExerciseMetaData } from "../../store/types";
import { styles } from "./styles";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../Themed/ThemedView/View";
import { WeightBasedExercise } from "./Content/WeightBasedExercise";
import { useAppDispatch, useAppSelector } from "../../store";
import { getEditedExercise } from "../../store/reducers/workout/workoutSelectors";
import { mutateEditedExercise } from "../../store/reducers/workout";

export const EditableExercise = () => {
    const { t } = useTranslation();
    const inputRef = useRef<TextInput>(null);
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();

    const handleChange = useCallback(
        (key: keyof ExerciseMetaData, value: string) => {
            dispatch(mutateEditedExercise({ key, value }));
        },
        [dispatch],
    );

    const handleChangeName = useCallback(
        (value: string) => {
            handleChange("name", value);
        },
        [handleChange],
    );

    return (
        <ThemedView stretch ghost>
            <ThemedTextInput
                ghost
                showClear
                errorKey="create_name"
                placeholder={t("exercise_name")}
                reference={inputRef}
                value={editedExercise?.exercise.name}
                onChangeText={handleChangeName}
                style={styles.title}
            />
            <WeightBasedExercise />
        </ThemedView>
    );
};
