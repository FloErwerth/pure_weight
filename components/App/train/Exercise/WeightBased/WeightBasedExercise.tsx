import { trainStyles } from "../../trainStyles";
import { HStack } from "../../../../Stack/HStack/HStack";
import { ExerciseMetaDataDisplay } from "../../ExerciseMetaDataDisplay/ExerciseMetaDataDisplay";
import { ThemedView } from "../../../../Themed/ThemedView/View";
import { Pressable, ScrollView, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PreviousTraining } from "../../../../PreviousTraining/PreviousTraining";
import { useCallback, useId, useMemo } from "react";
import { AddNoteModal } from "../../../../AddNoteModal/AddNoteModal";
import { useTheme } from "../../../../../theme/context";
import { borderRadius } from "../../../../../theme/border";
import { TrainingHeader } from "../../TrainingHeader/TrainingHeader";
import { SetInputRow } from "../../../../SetInputRow/SetInputRow";
import { AppState, useAppSelector } from "../../../../../store";
import { useBottomSheetRef } from "../../../../BottomSheetModal/ThemedButtomSheetModal";
import { getActiveSetIndex, getWorkoutExercises } from "../../../../../store/reducers/workout/workoutSelectors";

interface WeightBasedExerciseProps {
    exerciseIndex: number;
}

export const Exercise = ({ exerciseIndex }: WeightBasedExerciseProps) => {
    const [editNoteModalRef, open, close] = useBottomSheetRef();
    const showEditNoteModalTitleStyle = useMemo(() => ({ padding: 10, paddingHorizontal: 15, alignSelf: "center" }) as const, []);
    const { mainColor, componentBackgroundColor } = useTheme();
    const exercises = useAppSelector(getWorkoutExercises);
    const activeSetIndex = useAppSelector((state: AppState) => getActiveSetIndex(state, exerciseIndex));
    const id = useId();
    const hideNoteModal = useCallback(() => {
        close();
    }, [close]);

    const showNoteModal = useCallback(() => {
        open();
    }, [open]);
    const mappedDoneSets = useMemo(
        () =>
            Array(parseFloat(exercises?.[exerciseIndex].sets ?? "0"))
                .fill(undefined)
                .map((_, setIndex) => ({ isActiveSet: setIndex === activeSetIndex })),
        [activeSetIndex, exerciseIndex, exercises],
    );

    console.log(mappedDoneSets);

    return (
        <View key={id} style={trainStyles.carouselWrapper}>
            <HStack background style={trainStyles.headerWrapper}>
                <ExerciseMetaDataDisplay exerciseIndex={exerciseIndex} />
                <ThemedView style={trainStyles.noteButtonWrapper}>
                    <Pressable style={showEditNoteModalTitleStyle} onPress={showNoteModal}>
                        <MaterialCommunityIcons name="note-edit-outline" color={mainColor} size={30} />
                    </Pressable>
                </ThemedView>
            </HStack>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={trainStyles.innerWrapper}>
                <ThemedView style={{ paddingTop: 15, paddingBottom: 10, borderRadius, backgroundColor: componentBackgroundColor }}>
                    <TrainingHeader />
                    {mappedDoneSets?.map(({ isActiveSet }, setIndex) => {
                        return <SetInputRow isActiveSet={isActiveSet} key={Math.random()} exerciseIndex={exerciseIndex} setIndex={setIndex} />;
                    })}
                </ThemedView>
                <PreviousTraining exerciseIndex={exerciseIndex} />
            </ScrollView>
            <AddNoteModal index={exerciseIndex} reference={editNoteModalRef} onRequestClose={hideNoteModal} />
        </View>
    );
};
