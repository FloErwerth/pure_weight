import { TextInput, View } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { styles } from "./styles";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { ThemedView } from "../Themed/ThemedView/View";
import { WeightBasedExercise } from "./Content/WeightBasedExercise";
import { useAppDispatch, useAppSelector } from "../../store";
import { getEditedExercise } from "../../store/selectors/workout/workoutSelectors";
import { mutateEditedExercise } from "../../store/reducers/workout";
import { ExerciseMetaData } from "../../store/reducers/workout/types";
import { SlidingSwitch } from "../SlidingSwitch/SlidingSwitch";
import { TimeBasedExercise } from "./Content/TimeBasedExercise";
import { cleanError } from "../../store/reducers/errors";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";

const useOptions = () => {
    const { t } = useTypedTranslation();

    return useMemo(
        () => [
            { value: "WEIGHT_BASED", label: t(TranslationKeys.WEIGHT_BASED_LABEL), Component: <WeightBasedExercise /> },
            { value: "TIME_BASED", label: t(TranslationKeys.TIME_BASED_LABEL), Component: <TimeBasedExercise /> },
        ],
        [t],
    );
};

export const EditableExercise = () => {
    const { t } = useTypedTranslation();
    const inputRef = useRef<TextInput>(null);
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();
    const options = useOptions();

    const initialIndex = useMemo(() => {
        if (editedExercise?.exercise.type === "WEIGHT_BASED") {
            return 0;
        }
        if (editedExercise?.exercise.type === "TIME_BASED") {
            return 1;
        }
        return 0;
    }, [editedExercise?.exercise.type]);

    const handleChange = useCallback(
        (key: keyof ExerciseMetaData, value: string) => {
            dispatch(mutateEditedExercise({ key, value }));
        },
        [dispatch],
    );

    const handleSelectExerciseType = useCallback(
        (value: string) => {
            handleChange("type", value);
        },
        [handleChange],
    );

    const handleChangeName = useCallback(
        (value: string) => {
            dispatch(cleanError(["create_exercise_name"]));
            handleChange("name", value);
        },
        [dispatch, handleChange],
    );

    const exercisePlaceholder = useMemo(() => t(TranslationKeys.EXERCISE_NAME), [t]);

    return (
        <ThemedView stretch ghost>
            <View style={styles.titleWrapper}>
                <ThemedTextInput
                    ghost
                    showClear
                    errorKey="create_exercise_name"
                    placeholder={exercisePlaceholder}
                    reference={inputRef}
                    value={editedExercise?.exercise.name}
                    onChangeText={handleChangeName}
                    style={styles.title}
                />
            </View>
            <SlidingSwitch disabled={!editedExercise?.isNewExercise} initialIndex={initialIndex} options={options} onSelectValue={handleSelectExerciseType} />
        </ThemedView>
    );
};
