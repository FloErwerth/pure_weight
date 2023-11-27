import { styles } from "../styles";
import { HStack } from "../../Stack/HStack/HStack";
import { EditableExerciseInputRow } from "../EditableExerciseInputRow";
import { ThemedView } from "../../Themed/ThemedView/View";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback } from "react";
import { WeightBasedExerciseMetaData } from "../../../store/types";

export const WeightBasedExercise = () => {
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();

    const handleEditExercise = useCallback((key: keyof WeightBasedExerciseMetaData, value: string) => {}, []);

    return (
        <ThemedView ghost stretch style={styles.inputWrapper}>
            <HStack style={styles.inputWrapper} ghost>
                <EditableExerciseInputRow
                    stretch
                    i18key="weight"
                    setValue={(weight) => handleEditExercise?.("weight", weight)}
                    errorKey={"create_weight"}
                    value={editedExercise.weight}
                />
                <EditableExerciseInputRow
                    stretch
                    i18key="sets"
                    setValue={(sets) => handleEditExercise?.("sets", sets)}
                    errorKey={"create_sets"}
                    value={editedExercise.sets}
                />
                <EditableExerciseInputRow
                    stretch
                    i18key="reps"
                    setValue={(reps) => handleEditExercise?.("reps", reps)}
                    errorKey={"create_reps"}
                    value={editedExercise.reps}
                />
            </HStack>
            <EditableExerciseInputRow
                type="MINUTES_SECONDS"
                i18key="pause"
                setValue={(pause) => handleEditExercise?.("pause", pause)}
                value={editedExercise?.pause}
            />
        </ThemedView>
    );
};
