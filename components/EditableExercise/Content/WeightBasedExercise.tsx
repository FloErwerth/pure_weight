import { styles } from "../styles";
import { HStack } from "../../Stack/HStack/HStack";
import { EditableExerciseInputRow } from "../EditableExerciseInputRow";
import { ThemedView } from "../../Themed/ThemedView/View";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback } from "react";
import { mutateEditedExercise, mutateEditedExercisePause } from "../../../store/reducers/workout";

import { getEditedExercise } from "../../../store/reducers/workout/workoutSelectors";
import { getWeightUnit } from "../../../store/reducers/settings/settingsSelectors";
import { TimeInputRow } from "../TimeInputRow";
import { TimeInput, WeightBasedExerciseMetaData } from "../../../store/reducers/workout/types";

export const WeightBasedExercise = () => {
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();
    const weightUnit = useAppSelector(getWeightUnit);

    const handleEditExercise = useCallback(
        (key: keyof WeightBasedExerciseMetaData, value: string | undefined) => {
            dispatch(mutateEditedExercise({ key, value: value ?? "0" }));
        },
        [dispatch],
    );

    const handleSetPause = useCallback(
        (key: keyof TimeInput, value: string | undefined) => {
            dispatch(mutateEditedExercisePause({ key, value }));
        },
        [dispatch],
    );

    return (
        <ThemedView ghost stretch style={styles.inputWrapper}>
            <HStack style={styles.inputWrapper} ghost>
                <EditableExerciseInputRow
                    suffix={weightUnit}
                    stretch
                    i18key="weight"
                    setValue={(weight) => handleEditExercise?.("weight", weight)}
                    errorKey={"create_weight"}
                    value={editedExercise?.exercise?.weight}
                />
                <EditableExerciseInputRow stretch i18key="sets" setValue={(sets) => handleEditExercise?.("sets", sets)} errorKey={"create_sets"} value={editedExercise?.exercise.sets} />
                <EditableExerciseInputRow stretch i18key="reps" setValue={(reps) => handleEditExercise?.("reps", reps)} errorKey={"create_reps"} value={editedExercise?.exercise.reps} />
            </HStack>
            <TimeInputRow i18key="pause" setValue={handleSetPause} value={editedExercise?.exercise?.pause} />
        </ThemedView>
    );
};
