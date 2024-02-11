import { styles } from "../styles";
import { HStack } from "../../Stack/HStack/HStack";
import { EditableExerciseInputRow } from "../EditableExerciseInputRow";
import { ThemedView } from "../../Themed/ThemedView/View";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback } from "react";
import { mutateEditedExercise, mutateEditedExerciseTimeValue } from "../../../store/reducers/workout";

import { getEditedExercise } from "../../../store/reducers/workout/workoutSelectors";
import { getWeightUnit } from "../../../store/reducers/settings/settingsSelectors";
import { TimeInput } from "../../../store/reducers/workout/types";

export const WeightBasedExercise = () => {
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();
    const weightUnit = useAppSelector(getWeightUnit);

    const handleSetSets = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExercise({ key: "sets", value: value ?? "0" }));
        },
        [dispatch],
    );

    const handleSetReps = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExercise({ key: "reps", value: value ?? "0" }));
        },
        [dispatch],
    );

    const handleSetWeight = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExercise({ key: "weight", value: value ?? "0" }));
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

    return (
        <ThemedView ghost stretch style={styles.inputWrapper}>
            <HStack style={styles.inputWrapper} ghost>
                <EditableExerciseInputRow
                    type="WEIGHT_BASED"
                    suffix={weightUnit}
                    stretch
                    i18key="weight"
                    setValue={handleSetWeight}
                    errorKey={"create_weight"}
                    value={editedExercise?.exercise?.weight}
                />
                <EditableExerciseInputRow
                    type="WEIGHT_BASED"
                    stretch
                    i18key="sets"
                    setValue={handleSetSets}
                    errorKey={"create_sets"}
                    suffix="x"
                    value={editedExercise?.exercise.sets}
                />
                <EditableExerciseInputRow
                    type="WEIGHT_BASED"
                    stretch
                    i18key="reps"
                    setValue={handleSetReps}
                    errorKey={"create_reps"}
                    suffix="x"
                    value={editedExercise?.exercise.reps}
                />
            </HStack>
            <EditableExerciseInputRow type="TIME_BASED" i18key="pause" setValue={handleSetPause} value={editedExercise?.exercise?.pause} />
        </ThemedView>
    );
};
