import { AppState, useAppSelector } from "../../../../store";
import { getExerciseById, getSetsArray } from "../../../../store/reducers/workout/workoutSelectors";
import { ExerciseId } from "../../../../store/reducers/workout/types";
import { useBottomSheetRef } from "../../../BottomSheetModal/ThemedBottomSheetModal";
import { useCallback, useId, useMemo } from "react";
import { useTheme } from "../../../../theme/context";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { trainStyles } from "../trainStyles";
import { HStack } from "../../../Stack/HStack/HStack";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedScrollView } from "../../../Themed/ThemedScrollView/ThemedScrollView";
import { WeightBasedTrainingHeader } from "../TrainingHeader/WeightBased/WeightBasedTrainingHeader";
import { WeightBasedSetInput } from "../../../SetInputRow/WeightBased/WeightBasedSetInput";
import { PreviousWorkout } from "../../../PreviousWorkout/PreviousWorkout";
import { AddNoteModal } from "../../../AddNoteModal/AddNoteModal";
import { ExerciseMetadataDisplay } from "./MetadataDisplay/ExerciseMetadataDisplay";
import { TimeBasedTrainingHeader } from "../TrainingHeader/TimeBased/TimeBasedTrainingHeader";
import { TimeBasedSetInput } from "../../../SetInputRow/TimeBased/TimeBasedSetInput";
import { useTypeSpecificComponent } from "../../../../hooks/useTypeSpecificComponent";

type TrainedExerciseProps = {
    exerciseId: ExerciseId;
};

export const TrainedExercise = ({ exerciseId }: TrainedExerciseProps) => {
    const { ref: editNoteModalRef, openBottomSheet: open, closeBottomSheet: close } = useBottomSheetRef();
    const exercise = useAppSelector((state: AppState) => getExerciseById(state, exerciseId));
    const TrainingHeader = useTypeSpecificComponent(exercise?.type, WeightBasedTrainingHeader, TimeBasedTrainingHeader);
    const SetInput = useTypeSpecificComponent(exercise?.type, WeightBasedSetInput, TimeBasedSetInput);
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
                <ExerciseMetadataDisplay exerciseId={exerciseId} />
                <ThemedView style={trainStyles.noteButtonWrapper}>
                    <Pressable style={showEditNoteModalTitleStyle} onPress={showNoteModal}>
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
                    <TrainingHeader />
                    {setsArray?.map((_, setIndex) => {
                        return (
                            <SetInput key={exerciseId.toString().concat(setIndex.toString())} exerciseId={exerciseId} setIndex={setIndex} />
                        );
                    })}
                </ThemedView>
                <PreviousWorkout exerciseType={exercise?.type ?? "WEIGHT_BASED"} exerciseId={exerciseId} />
            </ThemedScrollView>
            <AddNoteModal reference={editNoteModalRef} onRequestClose={hideNoteModal} />
        </ThemedView>
    );
};
