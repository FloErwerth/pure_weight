import { Center } from "../../../../Center/Center";
import { ThemedTextInput } from "../../../../Themed/ThemedTextInput/ThemedTextInput";
import { styles } from "../styles";
import { AppState, useAppDispatch, useAppSelector } from "../../../../../store";
import { getDoneExerciseById } from "../../../../../store/reducers/workout/workoutSelectors";
import { useCallback, useId } from "react";
import { HStack } from "../../../../Stack/HStack/HStack";
import { Text } from "../../../../Themed/ThemedText/Text";
import { mutateDoneExercise } from "../../../../../store/reducers/workout";
import { View } from "react-native";

type WeightBasedEditedExerciseProps = {
    index: number;
    doneWorkoutId: number;
};

export const WeightBasedEditedExercise = ({ doneWorkoutId, index }: WeightBasedEditedExerciseProps) => {
    const doneExercise = useAppSelector((state: AppState) => getDoneExerciseById(state, doneWorkoutId, index));
    const dispatch = useAppDispatch();
    const id = useId();

    const handleSetWeight = useCallback(
        (setIndex: number, newWeight?: string) => {
            if (doneExercise?.doneExerciseId) {
                dispatch(mutateDoneExercise({ doneExerciseId: doneExercise?.doneExerciseId, doneWorkoutId, setIndex, key: "weight", value: newWeight }));
            }
        },
        [dispatch, doneExercise?.doneExerciseId, doneWorkoutId],
    );

    const handleSetReps = useCallback(
        (setIndex: number, newReps?: string) => {
            if (doneExercise?.doneExerciseId) {
                dispatch(mutateDoneExercise({ doneExerciseId: doneExercise?.doneExerciseId, doneWorkoutId, setIndex, key: "reps", value: newReps }));
            }
        },
        [dispatch, doneExercise?.doneExerciseId, doneWorkoutId],
    );

    if (!doneExercise || index === undefined) {
        return null;
    }

    return (
        <View>
            {doneExercise?.sets.map(({ weight, reps }, index) => (
                <HStack key={id + index} ghost style={styles.inputStack}>
                    <Text ghost center style={styles.setIndex}>
                        {index + 1}
                    </Text>
                    <Center style={styles.center}>
                        <ThemedTextInput
                            returnKeyType="done"
                            style={styles.textInput}
                            value={weight}
                            onChangeText={(weight) => handleSetWeight(index, weight)}
                            textAlign="center"
                            inputMode="decimal"
                        />
                    </Center>
                    <Center style={styles.center}>
                        <ThemedTextInput returnKeyType="done" style={styles.textInput} value={reps} onChangeText={(reps) => handleSetReps(index, reps)} textAlign="center" inputMode="decimal" />
                    </Center>
                </HStack>
            ))}
        </View>
    );
};
