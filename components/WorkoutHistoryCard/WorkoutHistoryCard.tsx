import { styles } from "./styles";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { HStack } from "../Stack/HStack/HStack";
import { Text } from "../Themed/ThemedText/Text";
import { IsoDate } from "../../types/date";
import { getLocaleDate } from "../../utils/date";
import { AppState, useAppSelector } from "../../store";
import { getLanguage } from "../../store/reducers/settings/settingsSelectors";
import { getDoneExercises } from "../../store/reducers/workout/workoutSelectors";
import { View } from "react-native";
import { useMemo } from "react";

type WorkoutHistoryCardProps = {
    date: IsoDate;
    weight: string;
    weightUnit: string;
    duration?: string;
    numExercisesDone: number;
    doneWorkoutId: number;
    index: number;
    handleEdit?: (doneExerciseIndex: number) => void;
};

export const WorkoutHistoryCard = ({ date, doneWorkoutId, numExercisesDone, index, weight, weightUnit, duration, handleEdit }: WorkoutHistoryCardProps) => {
    const language = useAppSelector(getLanguage);
    const doneExercises = useAppSelector((state: AppState) => getDoneExercises(state, doneWorkoutId));
    const key = useMemo(() => Math.random() * doneWorkoutId * index, [doneWorkoutId, index]);
    return (
        <ThemedPressable style={styles.wrapper} onPress={() => handleEdit?.(index)} key={key} input round padding>
            <Text style={styles.date} ghost>
                {getLocaleDate(date, language, { dateStyle: "long" })}
            </Text>
            <View style={styles.doneExercisesWrapper}>
                <View>
                    {doneExercises?.map((exercise) => (
                        <HStack ghost key={key.toString().concat(exercise.name)}>
                            <Text ghost>{exercise.name}</Text>
                        </HStack>
                    ))}
                </View>
            </View>
        </ThemedPressable>
    );
};
