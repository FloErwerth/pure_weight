import { AppState, useAppSelector } from "../../../../store";
import {
    getExerciseById,
    getHasWeightInTimeBasedExercise,
    getSetsArray,
} from "../../../../store/reducers/workout/workoutSelectors";
import { ExerciseId } from "../../../../store/reducers/workout/types";
import { useBottomSheetRef } from "../../../BottomSheetModal/ThemedBottomSheetModal";
import { useCallback, useId } from "react";
import { useTheme } from "../../../../theme/context";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { trainStyles } from "../trainStyles";
import { HStack } from "../../../Stack/HStack/HStack";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedScrollView } from "../../../Themed/ThemedScrollView/ThemedScrollView";
import { TrainingHeader } from "../TrainingHeader/TrainingHeader";
import { SetInput } from "../../../SetInputRow/SetInput";
import { PreviousWorkout } from "../../../PreviousWorkout/PreviousWorkout";
import { AddNoteModal } from "../../../AddNoteModal/AddNoteModal";
import { ExerciseMetadataDisplay } from "./MetadataDisplay/ExerciseMetadataDisplay";

type TrainedExerciseProps = {
    exerciseId: ExerciseId;
};

export const TrainedExercise = ({ exerciseId }: TrainedExerciseProps) => {
    const { ref: editNoteModalRef, openBottomSheet: open, closeBottomSheet: close } = useBottomSheetRef();
    const exercise = useAppSelector((state: AppState) => getExerciseById(state, exerciseId));
    const { mainColor } = useTheme();
    const setsArray = useAppSelector((state: AppState) => getSetsArray(state, exerciseId));

    const id = useId();
    const hideNoteModal = useCallback(() => {
        close();
    }, [close]);

    const showNoteModal = useCallback(() => {
        open();
    }, [open]);

    const hasWeight = useAppSelector((state: AppState) => getHasWeightInTimeBasedExercise(state, exerciseId));

    return (
        <ThemedView stretch ghost key={id} style={trainStyles.carouselWrapper}>
            <HStack background style={trainStyles.headerWrapper}>
                <ExerciseMetadataDisplay exerciseId={exerciseId} />
                <ThemedView style={trainStyles.noteButtonWrapper}>
                    <Pressable style={trainStyles.showEditNoteModalStyle} onPress={showNoteModal}>
                        <MaterialCommunityIcons name="note-edit-outline" color={mainColor} size={24} />
                    </Pressable>
                </ThemedView>
            </HStack>
            <ThemedScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                ghost
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={trainStyles.innerWrapper}>
                <ThemedView round padding>
                    <TrainingHeader showWeight={hasWeight} exerciseType={exercise?.type} />
                    {setsArray?.map((_, setIndex) => {
                        return (
                            <SetInput
                                key={exerciseId.toString().concat(setIndex.toString())}
                                exerciseId={exerciseId}
                                setIndex={setIndex}
                            />
                        );
                    })}
                </ThemedView>
            </ThemedScrollView>
            <PreviousWorkout exerciseType={exercise?.type ?? "WEIGHT_BASED"} exerciseId={exerciseId} />
            <AddNoteModal reference={editNoteModalRef} onRequestClose={hideNoteModal} />
        </ThemedView>
    );
};
