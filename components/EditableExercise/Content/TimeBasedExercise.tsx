import { styles } from "../styles";
import { EditableExerciseInputRow } from "../EditableExerciseInputRow";
import { ThemedView } from "../../Themed/ThemedView/View";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback } from "react";
import { mutateEditedExercise, mutateEditedExerciseTimeValue } from "../../../store/reducers/workout";

import { getEditedExercise } from "../../../store/reducers/workout/workoutSelectors";
import { TimeInput } from "../../../store/reducers/workout/types";

export const TimeBasedExercise = () => {
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();

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

    return (
        <ThemedView ghost stretch style={styles.inputWrapper}>
            <EditableExerciseInputRow
                type="WEIGHT_BASED"
                i18key="sets"
                setValue={handleSetSets}
                errorKey={"create_sets"}
                suffix="x"
                value={editedExercise?.exercise.sets}
            />
            <EditableExerciseInputRow
                type="TIME_BASED"
                i18key="preparation"
                setValue={handleSetPreperation}
                value={editedExercise?.exercise?.preparation}
            />
            <EditableExerciseInputRow
                type="TIME_BASED"
                i18key="duration"
                setValue={handleSetDuration}
                value={editedExercise?.exercise?.duration}
            />
            <EditableExerciseInputRow type="TIME_BASED" i18key="pause" setValue={handleSetPause} value={editedExercise?.exercise?.pause} />
        </ThemedView>
    );
};
