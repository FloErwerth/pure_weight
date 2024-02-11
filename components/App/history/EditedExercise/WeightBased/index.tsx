import { styles } from "../styles";
import { AppState, useAppDispatch, useAppSelector } from "../../../../../store";
import { getDoneExerciseById } from "../../../../../store/reducers/workout/workoutSelectors";
import { useCallback, useId } from "react";
import { HStack } from "../../../../Stack/HStack/HStack";
import { Text } from "../../../../Themed/ThemedText/Text";
import { mutateDoneExercise } from "../../../../../store/reducers/workout";
import { View } from "react-native";
import { getWeightUnit } from "../../../../../store/reducers/settings/settingsSelectors";
import { EditableExerciseInputRow } from "../../../../EditableExercise/EditableExerciseInputRow";
import { ExerciseId, WorkoutId } from "../../../../../store/reducers/workout/types";

type WeightBasedEditedExerciseProps = {
    doneExerciseId: ExerciseId;
    doneWorkoutId: WorkoutId;
};

export const WeightBasedEditedExercise = ({ doneWorkoutId, doneExerciseId }: WeightBasedEditedExerciseProps) => {
    const doneExercise = useAppSelector((state: AppState) => getDoneExerciseById(state, doneWorkoutId, doneExerciseId));
    const dispatch = useAppDispatch();
    const id = useId();
    const weightUnit = useAppSelector(getWeightUnit);

    const handleSetWeight = useCallback(
        (setIndex: number, newWeight?: string) => {
            if (doneExercise?.doneExerciseId) {
                dispatch(
                    mutateDoneExercise({
                        doneExerciseId: doneExercise?.doneExerciseId,
                        doneWorkoutId,
                        setIndex,
                        key: "weight",
                        value: newWeight,
                    }),
                );
            }
        },
        [dispatch, doneExercise?.doneExerciseId, doneWorkoutId],
    );

    const handleSetReps = useCallback(
        (setIndex: number, newReps?: string) => {
            if (doneExercise?.doneExerciseId) {
                dispatch(
                    mutateDoneExercise({
                        doneExerciseId: doneExercise?.doneExerciseId,
                        doneWorkoutId,
                        setIndex,
                        key: "reps",
                        value: newReps,
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
            {doneExercise?.sets.map(({ weight, reps }, index) => (
                <HStack round key={id + index} ghost style={styles.inputStack}>
                    <Text ghost style={styles.setIndex}>
                        {index + 1}
                    </Text>
                    <EditableExerciseInputRow
                        stretch
                        suffix={weightUnit}
                        value={weight}
                        setValue={(value) => handleSetWeight(index, value)}
                    />
                    <EditableExerciseInputRow stretch suffix="x" value={reps} setValue={(value) => handleSetReps(index, value)} />
                </HStack>
            ))}
        </View>
    );
};
