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

interface WeightBasedExerciseProps {
    exerciseIndex: number;
}

export const TimeBasedExercise = ({ exerciseIndex }: WeightBasedExerciseProps) => {
    const [editNoteModalRef, open, close] = useBottomSheetRef();
    const showEditNoteModalTitleStyle = useMemo(() => ({ padding: 10, paddingHorizontal: 15, alignSelf: "center" }) as const, []);
    const { mainColor } = useTheme();
    const setsArray = useAppSelector((state: AppState) => getSetsArray(state, exerciseIndex));

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
                <ExerciseMetadataDisplay exerciseIndex={exerciseIndex} />
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
                        return <TimeBasedSetInput key={exerciseIndex.toString().concat(setIndex.toString())} exerciseIndex={exerciseIndex} setIndex={setIndex} />;
                    })}
                </ThemedView>
                <PreviousWorkout exerciseType="TIME_BASED" exerciseIndex={exerciseIndex} />
            </ThemedScrollView>
            <AddNoteModal reference={editNoteModalRef} onRequestClose={hideNoteModal} />
        </ThemedView>
    );
};
