import { AppState, useAppDispatch, useAppSelector } from "../../../../../store";
import { useCallback } from "react";
import { setEditedExercise } from "../../../../../store/reducers/workout";
import * as Haptics from "expo-haptics";
import { getExerciseMetadataFromWorkoutById } from "../../../../../store/reducers/workout/workoutSelectors";
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
import { ExerciseId } from "../../../../../store/reducers/workout/types";
import { useTypeSpecificComponent } from "../../../../../hooks/useTypeSpecificComponent";

interface ExerciseMetadataDisplayProps {
    exerciseId: ExerciseId;
}

export const ExerciseMetadataDisplay = ({ exerciseId }: ExerciseMetadataDisplayProps) => {
    const dispatch = useAppDispatch();
    const exerciseMetaData = useAppSelector((state: AppState) => getExerciseMetadataFromWorkoutById(state, exerciseId));
    const navigate = useNavigate();
    const handleEditExercise = useCallback(() => {
        dispatch(setEditedExercise({ exerciseId }));
        void Haptics.selectionAsync();
        navigate("workouts/create/exercise");
    }, [dispatch, exerciseId, navigate]);
    const SmallExerciseDataDisplay = useTypeSpecificComponent(exerciseMetaData?.type, WeightBasedSmallExerciseMetadataDisplay, TimeBasedSmallExerciseDataDisplay);

    if (!exerciseMetaData) {
        return null;
    }

    return (
        <>
            <HStack style={styles.wrapper}>
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
