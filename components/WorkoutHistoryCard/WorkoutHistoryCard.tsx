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
import { useTheme } from "../../theme/context";

type WorkoutHistoryCardProps = {
    date: IsoDate;
    doneWorkoutId: number;
    handleEdit?: () => void;
    selected: boolean;
};

export const WorkoutHistoryCard = ({ date, doneWorkoutId, handleEdit, selected }: WorkoutHistoryCardProps) => {
    const { inputFieldBackgroundColor, secondaryInputFieldBackgroundColor } = useTheme();
    const language = useAppSelector(getLanguage);
    const doneExercises = useAppSelector((state: AppState) => getDoneExercises(state, doneWorkoutId));
    const key = useMemo(() => Math.random() * doneWorkoutId, [doneWorkoutId]);
    const filteredExercises = useMemo(() => doneExercises?.filter((exercise) => exercise.sets.length > 0), [doneExercises]);

    const wrapperStyles = useMemo(
        () => [styles.wrapper, { backgroundColor: selected ? inputFieldBackgroundColor : secondaryInputFieldBackgroundColor }],
        [secondaryInputFieldBackgroundColor, inputFieldBackgroundColor, selected],
    );

    return (
        <ThemedPressable style={wrapperStyles} onPress={handleEdit} key={key} round padding>
            <Text style={styles.date} ghost>
                {getLocaleDate(date, language, { dateStyle: "long" })}
            </Text>
            <View style={styles.doneExercisesWrapper}>
                <View>
                    {filteredExercises?.map((exercise) => (
                        <HStack ghost key={key.toString().concat(exercise.name)}>
                            <Text ghost>{exercise.name}</Text>
                        </HStack>
                    ))}
                </View>
            </View>
        </ThemedPressable>
    );
};
