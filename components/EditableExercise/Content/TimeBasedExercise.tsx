import { styles } from "../styles";
import { EditableExerciseInputRow } from "../EditableExerciseInputRow";
import { ThemedView } from "../../Themed/ThemedView/View";
import { useCallback } from "react";
import { TimeBasedExerciseMetaData } from "../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../store";
import { mutateEditedExercise } from "../../../store/reducers/workout";
import { getEditedExercise } from "../../../store/reducers/workout/workoutSelectors";

export const TimeBasedExercise = () => {
    const dispatch = useAppDispatch();
    const editedExercise = useAppSelector(getEditedExercise);

    const handleEditExercise = useCallback(
        (key: keyof TimeBasedExerciseMetaData, value: string) => {
            dispatch(mutateEditedExercise({ key, value }));
        },
        [dispatch],
    );

    const handleSetMinutesSeconds = useCallback(
        (value: string) => {
            handleEditExercise("timePerSet", value);
        },
        [handleEditExercise],
    );

    const handleSetSets = useCallback(
        (value: string) => {
            handleEditExercise("sets", value);
        },
        [handleEditExercise],
    );
    const handleSetPause = useCallback(
        (value: string) => {
            handleEditExercise("pause", value);
        },
        [handleEditExercise],
    );

    const handleTimeBeforeSet = useCallback(
        (value: string) => {
            handleEditExercise("timeBeforeSet", value);
        },
        [handleEditExercise],
    );

    if (editedExercise?.exercise.type === "WEIGHT_BASED") {
        return null;
    }

    return (
        <ThemedView ghost stretch style={styles.inputWrapper}>
            <EditableExerciseInputRow
                stretch
                type="MINUTES_SECONDS"
                i18key="timePerSet"
                setValue={handleSetMinutesSeconds}
                errorKey={"create_timePerSet"}
                value={editedExercise?.exercise.timePerSet}
            />
            <EditableExerciseInputRow i18key="sets" setValue={handleSetSets} errorKey={"create_sets"} value={editedExercise?.exercise.sets} />
            <EditableExerciseInputRow stretch type="MINUTES_SECONDS" i18key="pause" setValue={handleSetPause} value={editedExercise?.exercise.pause} />
            <EditableExerciseInputRow stretch type="MINUTES_SECONDS" i18key="timeBeforeSet" setValue={handleTimeBeforeSet} value={editedExercise?.exercise.pause} />
        </ThemedView>
    );
};
