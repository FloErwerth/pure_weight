import { AppState, useAppDispatch, useAppSelector } from "../../../../store";
import { useCallback } from "react";
import { setEditedExercise } from "../../../../store/reducers/workout";
import * as Haptics from "expo-haptics";
import { getExerciseMetadataFromWorkoutByIndex } from "../../../../store/reducers/workout/workoutSelectors";
import { HStack } from "../../../Stack/HStack/HStack";
import { styles } from "./TimeBased/ExerciseMetadataDisplay/styles";
import { VStack } from "../../../Stack/VStack/VStack";
import { Text } from "../../../Themed/ThemedText/Text";
import { trainStyles } from "../trainStyles";
import { Pressable } from "react-native";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { WeightBasedSmallExerciseMetadataDisplay } from "./WeightBased/ExerciseMetaDataDisplay/WeightBasedExerciseMetadataDisplay";
import { TimeBasedSmallExerciseDataDisplay } from "./TimeBased/ExerciseMetadataDisplay/TimeBasedExerciseMetadataDisplay";
import { useNavigate } from "../../../../hooks/navigate";

interface ExerciseMetadataDisplayProps {
    exerciseIndex: number;
}

export const ExerciseMetadataDisplay = ({ exerciseIndex }: ExerciseMetadataDisplayProps) => {
    const dispatch = useAppDispatch();
    const exerciseMetaData = useAppSelector((state: AppState) => getExerciseMetadataFromWorkoutByIndex(state, exerciseIndex));
    const navigate = useNavigate();
    const handleShowModal = useCallback(() => {
        dispatch(setEditedExercise({ index: exerciseIndex, isTrained: true }));
        void Haptics.selectionAsync();
        navigate("workouts/create/exercise", { to: "workouts/train/index" });
    }, [dispatch, exerciseIndex, navigate]);

    if (!exerciseMetaData) {
        return null;
    }

    return (
        <>
            <HStack style={styles.wrapper}>
                <VStack>
                    <Text style={trainStyles.exerciseName}>{exerciseMetaData?.name}</Text>
                    {exerciseMetaData.type === "TIME_BASED" ? (
                        <TimeBasedSmallExerciseDataDisplay exerciseIndex={exerciseIndex} />
                    ) : (
                        <WeightBasedSmallExerciseMetadataDisplay exerciseIndex={exerciseIndex} />
                    )}
                </VStack>
                <Pressable onPress={handleShowModal} style={styles.pressable}>
                    <ThemedMaterialCommunityIcons name="pencil" size={24} />
                </Pressable>
            </HStack>
        </>
    );
};
