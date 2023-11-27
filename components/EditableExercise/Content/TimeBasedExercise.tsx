import { styles } from "../styles";
import { EditableExerciseInputRow } from "../EditableExerciseInputRow";
import { ThemedView } from "../../Themed/ThemedView/View";

export const TimeBasedExercise = () => {
    return (
        <ThemedView ghost stretch style={styles.inputWrapper}>
            <EditableExerciseInputRow
                stretch
                type="MINUTES_SECONDS"
                i18key="timePerSet"
                setValue={(timePerSet) => handleEditExercise?.("timePerSet", timePerSet)}
                errorKey={"create_timePerSet"}
                value={editedExercise?.timePerSet}
            />
            <EditableExerciseInputRow
                i18key="sets"
                setValue={(sets) => handleEditExercise?.("sets", sets)}
                errorKey={"create_sets"}
                value={editedExercise?.sets}
            />
            <EditableExerciseInputRow
                stretch
                type="MINUTES_SECONDS"
                i18key="pause"
                setValue={(pause) => handleEditExercise?.("pause", pause)}
                value={editedExercise?.pause}
            />
        </ThemedView>
    );
};
