import { trainStyles } from "../../trainStyles";
import { HStack } from "../../../../Stack/HStack/HStack";
import { WeightBasedExerciseMetadataDisplay } from "./ExerciseMetaDataDisplay/WeightBasedExerciseMetadataDisplay";
import { ThemedView } from "../../../../Themed/ThemedView/View";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PreviousWorkout } from "../../../../PreviousWorkout/PreviousWorkout";
import { useCallback, useId, useMemo } from "react";
import { AddNoteModal } from "../../../../AddNoteModal/AddNoteModal";
import { useTheme } from "../../../../../theme/context";
import { WeightBasedTrainingHeader } from "../../TrainingHeader/WeightBased/WeightBasedTrainingHeader";
import { AppState, useAppSelector } from "../../../../../store";
import { useBottomSheetRef } from "../../../../BottomSheetModal/ThemedBottomSheetModal";
import { getSetsArray } from "../../../../../store/reducers/workout/workoutSelectors";
import { WeightBasedSetInput } from "../../../../SetInputRow/WeightBased/WeightBasedSetInput";
import { ThemedScrollView } from "../../../../Themed/ThemedScrollView/ThemedScrollView";
import { ExerciseId } from "../../../../../store/reducers/workout/types";

interface WeightBasedExerciseProps {
    exerciseId: ExerciseId;
}

export const WeightBasedExercise = ({ exerciseId }: WeightBasedExerciseProps) => {
    const { ref: editNoteModalRef, openBottomSheet: open, closeBottomSheet: close } = useBottomSheetRef();
    const showEditNoteModalTitleStyle = useMemo(() => ({ padding: 10, paddingHorizontal: 15, alignSelf: "center" }) as const, []);
    const { mainColor } = useTheme();
    const setsArray = useAppSelector((state: AppState) => getSetsArray(state, exerciseId));

    const id = useId();
    const hideNoteModal = useCallback(() => {
        close();
    }, [close]);

    const showNoteModal = useCallback(() => {
        open();
    }, [open]);

    return (
        <ThemedView stretch ghost key={id} style={trainStyles.carouselWrapper}>
            <HStack background style={trainStyles.headerWrapper}>
                <WeightBasedExerciseMetadataDisplay exerciseId={exerciseId} />
                <ThemedView style={trainStyles.noteButtonWrapper}>
                    <Pressable style={showEditNoteModalTitleStyle} onPress={showNoteModal}>
                        <MaterialCommunityIcons name="note-edit-outline" color={mainColor} size={24} />
                    </Pressable>
                </ThemedView>
            </HStack>
            <ThemedScrollView ghost keyboardShouldPersistTaps="handled" contentContainerStyle={trainStyles.innerWrapper}>
                <ThemedView round padding>
                    <WeightBasedTrainingHeader />
                    {setsArray?.map((_, setIndex) => {
                        return <WeightBasedSetInput key={exerciseId.toString().concat(setIndex.toString())} exerciseId={exerciseId} setIndex={setIndex} />;
                    })}
                </ThemedView>
                <PreviousWorkout exerciseType="WEIGHT_BASED" exerciseId={exerciseId} />
            </ThemedScrollView>
            <AddNoteModal reference={editNoteModalRef} onRequestClose={hideNoteModal} />
        </ThemedView>
    );
};
