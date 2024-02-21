import { styles } from "../styles";
import { AppState, useAppDispatch, useAppSelector } from "../../../../../store";
import { getDoneExerciseById } from "../../../../../store/reducers/workout/workoutSelectors";
import { useCallback, useId } from "react";
import { HStack } from "../../../../Stack/HStack/HStack";
import { Text } from "../../../../Themed/ThemedText/Text";
import { mutateDoneExercise } from "../../../../../store/reducers/workout";
import { View } from "react-native";
import { getTimeUnit } from "../../../../../store/reducers/settings/settingsSelectors";
import { ExerciseId, WorkoutId } from "../../../../../store/reducers/workout/types";
import { EditableExerciseInputRow } from "../../../../EditableExercise/EditableExerciseInputRow";

type WeightBasedEditedExerciseProps = {
    doneExerciseId: ExerciseId;
    doneWorkoutId: WorkoutId;
};

export const TimeBasedEditedExercise = ({ doneWorkoutId, doneExerciseId }: WeightBasedEditedExerciseProps) => {
    const doneExercise = useAppSelector((state: AppState) => getDoneExerciseById(state, doneWorkoutId, doneExerciseId));
    const dispatch = useAppDispatch();
    const id = useId();
    const timeUnit = useAppSelector(getTimeUnit);

    const handleSetDuration = useCallback(
        (setIndex: number, timeInputKey: "durationMinutes" | "durationSeconds", value?: string) => {
            if (doneExercise?.doneExerciseId) {
                dispatch(
                    mutateDoneExercise({
                        doneExerciseId: doneExercise?.doneExerciseId,
                        doneWorkoutId,
                        setIndex,
                        key: timeInputKey,
                        value,
                    }),
                );
            }
        },
        [dispatch, doneExercise?.doneExerciseId, doneWorkoutId],
    );

    if (!doneExercise) {
        return null;
    }

    return (
        <View>
            {doneExercise.sets?.map(({ durationMinutes, durationSeconds }, index) => (
                <HStack key={id + index} ghost style={styles.inputStack}>
                    <Text ghost center style={styles.setIndex}>
                        {index + 1}
                    </Text>
                    <EditableExerciseInputRow
                        stretch
                        background
                        suffix={timeUnit.minutesUnit}
                        setValue={(minutes) => handleSetDuration(index, "durationMinutes", minutes)}
                        value={durationMinutes}
                    />
                    <EditableExerciseInputRow
                        stretch
                        background
                        suffix={timeUnit.secondsUnit}
                        setValue={(seconds) => handleSetDuration(index, "durationSeconds", seconds)}
                        value={durationSeconds}
                    />
                </HStack>
            ))}
        </View>
    );
};
