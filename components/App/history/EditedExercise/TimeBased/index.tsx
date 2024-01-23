import { styles } from "../styles";
import { AppState, useAppDispatch, useAppSelector } from "../../../../../store";
import { getDoneExerciseById } from "../../../../../store/reducers/workout/workoutSelectors";
import { useCallback, useId } from "react";
import { HStack } from "../../../../Stack/HStack/HStack";
import { Text } from "../../../../Themed/ThemedText/Text";
import { mutateDoneExercise } from "../../../../../store/reducers/workout";
import { View } from "react-native";
import { getTimeUnit } from "../../../../../store/reducers/settings/settingsSelectors";
import { TimeInput } from "../../../../../store/reducers/workout/types";
import { EditableExerciseInputRow } from "../../../../EditableExercise/EditableExerciseInputRow";

type WeightBasedEditedExerciseProps = {
    index: number;
    doneWorkoutId: number;
};

export const TimeBasedEditedExercise = ({ doneWorkoutId, index }: WeightBasedEditedExerciseProps) => {
    const doneExercise = useAppSelector((state: AppState) => getDoneExerciseById(state, doneWorkoutId, index));
    const dispatch = useAppDispatch();
    const id = useId();
    const timeUnit = useAppSelector(getTimeUnit);

    const handleSetDuration = useCallback(
        (setIndex: number, timeInputKey: "minutes" | "seconds", duration?: TimeInput, value?: string) => {
            if (doneExercise?.doneExerciseId) {
                dispatch(mutateDoneExercise({ doneExerciseId: doneExercise?.doneExerciseId, doneWorkoutId, setIndex, key: "duration", value: { ...duration, [timeInputKey]: value } }));
            }
        },
        [dispatch, doneExercise?.doneExerciseId, doneWorkoutId],
    );

    if (!doneExercise || index === undefined) {
        return null;
    }

    return (
        <View>
            {doneExercise.sets?.map(({ duration }, index) => (
                <HStack key={id + index} ghost style={styles.inputStack}>
                    <Text ghost center style={styles.setIndex}>
                        {index + 1}
                    </Text>
                    <EditableExerciseInputRow stretch suffix={timeUnit.minutesUnit} setValue={(minutes) => handleSetDuration(index, "minutes", duration, minutes)} value={duration?.minutes} />
                    <EditableExerciseInputRow stretch suffix={timeUnit.secondsUnit} setValue={(seconds) => handleSetDuration(index, "seconds", duration, seconds)} value={duration?.seconds} />
                </HStack>
            ))}
        </View>
    );
};
