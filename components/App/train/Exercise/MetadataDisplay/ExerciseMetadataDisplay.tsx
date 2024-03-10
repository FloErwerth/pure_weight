import { AppState, useAppDispatch, useAppSelector } from "../../../../../store";
import { useCallback } from "react";
import { setEditedExercise } from "../../../../../store/reducers/workout";
import * as Haptics from "expo-haptics";
import { getExerciseMetadataFromWorkoutById } from "../../../../../store/selectors/workout/workoutSelectors";
import { HStack } from "../../../../Stack/HStack/HStack";
import { styles } from "./styles";
import { VStack } from "../../../../Stack/VStack/VStack";
import { Text } from "../../../../Themed/ThemedText/Text";
import { trainStyles } from "../../trainStyles";
import { Pressable } from "react-native";
import { ThemedMaterialCommunityIcons } from "../../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { WeightBasedSmallExerciseMetadataDisplay } from "./WeightBased/WeightBasedExerciseMetadataDisplay";
import { TimeBasedSmallExerciseDataDisplay } from "./TimeBased/TimeBasedExerciseMetadataDisplay";
import { useNavigate } from "../../../../../hooks/navigate";
import { ExerciseId, WorkoutId } from "../../../../../store/reducers/workout/types";
import { useTypeSpecificComponent } from "../../../../../hooks/useTypeSpecificComponent";

interface ExerciseMetadataDisplayProps {
    workoutId?: WorkoutId;
    exerciseId: ExerciseId;
}

export const ExerciseMetadataDisplay = ({ workoutId, exerciseId }: ExerciseMetadataDisplayProps) => {
    const dispatch = useAppDispatch();
    const exerciseMetaData = useAppSelector((state: AppState) => getExerciseMetadataFromWorkoutById(state, exerciseId));
    const navigate = useNavigate();

    const handleEditExercise = useCallback(() => {
        dispatch(setEditedExercise({ workoutId, exerciseId, isNewExercise: false }));
        void Haptics.selectionAsync();
        navigate("workouts/create/exercise");
    }, [dispatch, exerciseId, navigate, workoutId]);

    const SmallExerciseDataDisplay = useTypeSpecificComponent(
        exerciseMetaData?.type,
        WeightBasedSmallExerciseMetadataDisplay,
        TimeBasedSmallExerciseDataDisplay,
    );

    if (!exerciseMetaData) {
        return null;
    }

    return (
        <>
            <HStack padding style={styles.wrapper}>
                <VStack>
                    <Text style={trainStyles.exerciseName}>{exerciseMetaData?.name}</Text>
                    <SmallExerciseDataDisplay exerciseMetaData={exerciseMetaData} />
                </VStack>
                <Pressable onPress={handleEditExercise} style={styles.pressable}>
                    <ThemedMaterialCommunityIcons name="pencil" size={24} />
                </Pressable>
            </HStack>
        </>
    );
};
