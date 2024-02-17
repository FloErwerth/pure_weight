import { styles } from "../styles";
import { EditableExerciseInputRow } from "../EditableExerciseInputRow";
import { ThemedView } from "../../Themed/ThemedView/View";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback, useMemo } from "react";
import { mutateEditedExercise, mutateEditedExerciseTimeValue } from "../../../store/reducers/workout";

import { getEditedExercise } from "../../../store/reducers/workout/workoutSelectors";
import { TimeInputRow } from "../TimeInputRow";
import { TimeInput } from "../../../store/reducers/workout/types";
import { useTranslation } from "react-i18next";
import { ErrorTextConfig } from "../../../store/reducers/errors/types";

export const TimeBasedExercise = () => {
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const handleSetSets = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExercise({ key: "sets", value: value ?? "0" }));
        },
        [dispatch],
    );

    const handleSetPause = useCallback(
        (value: { timeInputKey: keyof TimeInput; value: string }) => {
            dispatch(
                mutateEditedExerciseTimeValue({
                    key: "pause",
                    value: { ...editedExercise?.exercise?.pause, [value.timeInputKey]: value.value },
                }),
            );
        },
        [dispatch, editedExercise?.exercise?.pause],
    );

    const handleSetDuration = useCallback(
        (value: { timeInputKey: keyof TimeInput; value: string }) => {
            dispatch(
                mutateEditedExerciseTimeValue({
                    key: "duration",
                    value: { ...editedExercise?.exercise?.duration, [value.timeInputKey]: value.value },
                }),
            );
        },
        [dispatch, editedExercise?.exercise?.duration],
    );

    const handleSetPreperation = useCallback(
        (value: { timeInputKey: keyof TimeInput; value: string }) => {
            dispatch(
                mutateEditedExerciseTimeValue({
                    key: "preparation",
                    value: { ...editedExercise?.exercise?.preparation, [value.timeInputKey]: value.value },
                }),
            );
        },
        [dispatch, editedExercise?.exercise?.preparation],
    );

    const helpTextConfigPreparation = useMemo(() => ({ text: t("preparation_help_text"), title: t("preparation") }), [t]);

    const errorTextConfigs: Record<string, ErrorTextConfig> = useMemo(
        () => ({
            sets: {
                errorKey: "create_exercise_sets",
                errorText: "Sets are required",
            },
            duration: {
                errorKey: "create_exercise_duration",
                errorText: "Duration is required",
            },
        }),
        [],
    );

    return (
        <ThemedView ghost stretch style={styles.inputWrapper}>
            <EditableExerciseInputRow
                i18key="sets"
                suffix="x"
                setValue={handleSetSets}
                errorTextConfig={errorTextConfigs.sets}
                value={editedExercise?.exercise.sets}
            />
            <TimeInputRow
                i18key="duration"
                setValue={handleSetDuration}
                errorTextConfig={errorTextConfigs.duration}
                value={editedExercise?.exercise?.duration}
            />
            <TimeInputRow
                i18key="preparation"
                helpTextConfig={helpTextConfigPreparation}
                setValue={handleSetPreperation}
                value={editedExercise?.exercise?.preparation}
            />
            <TimeInputRow i18key="pause" setValue={handleSetPause} value={editedExercise?.exercise?.pause} />
        </ThemedView>
    );
};
