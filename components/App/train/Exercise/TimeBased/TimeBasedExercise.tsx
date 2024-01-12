import { trainStyles } from "../../trainStyles";
import { HStack } from "../../../../Stack/HStack/HStack";
import { ThemedView } from "../../../../Themed/ThemedView/View";
import { Pressable, ScrollView, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PreviousTraining } from "../../../../PreviousTraining/PreviousTraining";
import { useCallback, useId, useMemo } from "react";
import { AddNoteModal } from "../../../../AddNoteModal/AddNoteModal";
import { useTheme } from "../../../../../theme/context";
import { borderRadius } from "../../../../../theme/border";
import { AppState, useAppSelector } from "../../../../../store";
import { useBottomSheetRef } from "../../../../BottomSheetModal/ThemedBottomSheetModal";
import { getSetsArray } from "../../../../../store/reducers/workout/workoutSelectors";
import { ExerciseMetadataDisplay } from "../ExerciseMetadataDisplay";
import { TimeBasedTrainingHeader } from "../../TrainingHeader/TimeBased/TimeBasedTrainingHeader";
import { TimeBasedSetInput } from "../../../../SetInputRow/TimeBased/TimeBasedSetInput";

interface WeightBasedExerciseProps {
    exerciseIndex: number;
}

export const TimeBasedExercise = ({ exerciseIndex }: WeightBasedExerciseProps) => {
    const [editNoteModalRef, open, close] = useBottomSheetRef();
    const showEditNoteModalTitleStyle = useMemo(() => ({ padding: 10, paddingHorizontal: 15, alignSelf: "center" }) as const, []);
    const { mainColor, componentBackgroundColor } = useTheme();
    const setsArray = useAppSelector((state: AppState) => getSetsArray(state, exerciseIndex));

    const id = useId();
    const hideNoteModal = useCallback(() => {
        close();
    }, [close]);

    const showNoteModal = useCallback(() => {
        open();
    }, [open]);

    return (
        <View key={id} style={trainStyles.carouselWrapper}>
            <HStack background style={trainStyles.headerWrapper}>
                <ExerciseMetadataDisplay exerciseIndex={exerciseIndex} />
                <ThemedView style={trainStyles.noteButtonWrapper}>
                    <Pressable style={showEditNoteModalTitleStyle} onPress={showNoteModal}>
                        <MaterialCommunityIcons name="note-edit-outline" color={mainColor} size={24} />
                    </Pressable>
                </ThemedView>
            </HStack>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={trainStyles.innerWrapper}>
                <ThemedView style={{ paddingTop: 15, paddingBottom: 10, borderRadius, backgroundColor: componentBackgroundColor }}>
                    <TimeBasedTrainingHeader />
                    <View>
                        {setsArray?.map((_, setIndex) => {
                            return <TimeBasedSetInput key={exerciseIndex.toString().concat(setIndex.toString())} exerciseIndex={exerciseIndex} setIndex={setIndex} />;
                        })}
                    </View>
                </ThemedView>
                <PreviousTraining exerciseIndex={exerciseIndex} />
            </ScrollView>
            <AddNoteModal reference={editNoteModalRef} onRequestClose={hideNoteModal} />
        </View>
    );
};
