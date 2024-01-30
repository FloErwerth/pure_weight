import { trainStyles } from "../../trainStyles";
import { HStack } from "../../../../Stack/HStack/HStack";
import { ThemedView } from "../../../../Themed/ThemedView/View";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PreviousWorkout } from "../../../../PreviousWorkout/PreviousWorkout";
import { useCallback, useId, useMemo } from "react";
import { AddNoteModal } from "../../../../AddNoteModal/AddNoteModal";
import { useTheme } from "../../../../../theme/context";
import { AppState, useAppSelector } from "../../../../../store";
import { useBottomSheetRef } from "../../../../BottomSheetModal/ThemedBottomSheetModal";
import { getSetsArray } from "../../../../../store/reducers/workout/workoutSelectors";
import { ExerciseMetadataDisplay } from "../ExerciseMetadataDisplay";
import { TimeBasedTrainingHeader } from "../../TrainingHeader/TimeBased/TimeBasedTrainingHeader";
import { TimeBasedSetInput } from "../../../../SetInputRow/TimeBased/TimeBasedSetInput";
import { ThemedScrollView } from "../../../../Themed/ThemedScrollView/ThemedScrollView";
import { ExerciseId } from "../../../../../store/reducers/workout/types";

interface WeightBasedExerciseProps {
    exerciseId: ExerciseId;
}

export const TimeBasedExercise = ({ exerciseId }: WeightBasedExerciseProps) => {
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
        <ThemedView ghost stretch key={id} style={trainStyles.carouselWrapper}>
            <HStack background style={trainStyles.headerWrapper}>
                <ExerciseMetadataDisplay exerciseId={exerciseId} />
                <ThemedView style={trainStyles.noteButtonWrapper}>
                    <Pressable style={showEditNoteModalTitleStyle} onPress={showNoteModal}>
                        <MaterialCommunityIcons name="note-edit-outline" color={mainColor} size={24} />
                    </Pressable>
                </ThemedView>
            </HStack>
            <ThemedScrollView alwaysBounceVertical={true} showsVerticalScrollIndicator={false} ghost stretch keyboardShouldPersistTaps="handled" contentContainerStyle={trainStyles.innerWrapper}>
                <ThemedView padding round>
                    <TimeBasedTrainingHeader />
                    {setsArray?.map((_, setIndex) => {
                        return <TimeBasedSetInput key={exerciseId.concat(setIndex.toString())} exerciseId={exerciseId} setIndex={setIndex} />;
                    })}
                </ThemedView>
                <PreviousWorkout exerciseType="TIME_BASED" exerciseId={exerciseId} />
            </ThemedScrollView>
            <AddNoteModal reference={editNoteModalRef} onRequestClose={hideNoteModal} />
        </ThemedView>
    );
};
