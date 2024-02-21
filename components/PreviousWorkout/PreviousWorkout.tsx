import { AppState, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedView } from "../Themed/ThemedView/View";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";

import { getActiveSetIndex, getPreviousWorkout } from "../../store/reducers/workout/workoutSelectors";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ExerciseId, ExerciseType } from "../../store/reducers/workout/types";
import { styles } from "./styles";
import { getMillisecondsFromTimeInput, getTimeDisplayFromMilliseconds } from "../../utils/timeDisplay";

interface PreviousTrainingProps {
    exerciseId: ExerciseId;
    exerciseType: ExerciseType;
}
export const PreviousWorkout = ({ exerciseId, exerciseType }: PreviousTrainingProps) => {
    const previousWorkout = useAppSelector((state: AppState) => getPreviousWorkout(state, state.settingsState.language, exerciseId));

    const { t } = useTranslation();
    const { ref } = useBottomSheetRef();
    const activeSetIndex = useAppSelector((state: AppState) => getActiveSetIndex(state, exerciseId)) ?? -1;
    const currentSet = previousWorkout?.sets[activeSetIndex ?? 0];

    const handleShowEditNoteModal = useCallback(() => {
        ref.current?.present();
    }, [ref]);

    const handleCloseNote = useCallback(() => {
        ref.current?.dismiss();
    }, [ref]);

    if (!previousWorkout) {
        return null;
    }

    const { date, sets, note } = previousWorkout;
    if (!currentSet || activeSetIndex === -1 || !sets || sets?.length === 0 || sets?.some((val) => val === undefined)) {
        return null;
    }

    return (
        <ThemedView ghost>
            <HStack ghost center style={{ justifyContent: "space-between" }}>
                <Text ghost secondary style={{ fontSize: 16, padding: note ? 0 : 10 }}>
                    {t("previous_training_title_with_date")}
                    {date}
                </Text>
                {note && (
                    <ThemedView ghost>
                        <ThemedPressable padding style={styles.noteButtonWrapper} onPress={handleShowEditNoteModal}>
                            <Text>{t("training_input_show_note")}</Text>
                        </ThemedPressable>
                    </ThemedView>
                )}
            </HStack>
            <ThemedView padding round>
                <HStack key={Math.random() * 102} style={styles.innerWrapper}>
                    <Text stretch ghost style={styles.number}>
                        {activeSetIndex + 1}
                    </Text>
                    <HStack ghost stretch style={styles.setOuterWrapper}>
                        {exerciseType === "TIME_BASED" ? (
                            <ThemedView ghost round stretch style={styles.setWrapper}>
                                <Text ghost style={styles.set}>
                                    {getTimeDisplayFromMilliseconds(
                                        getMillisecondsFromTimeInput(currentSet?.durationMinutes, currentSet?.durationSeconds),
                                    )}
                                </Text>
                            </ThemedView>
                        ) : (
                            <>
                                <ThemedView ghost round stretch style={styles.setWrapper}>
                                    <Text ghost style={styles.set}>
                                        {currentSet?.weight}
                                    </Text>
                                </ThemedView>
                                <ThemedView style={styles.setWrapper} ghost round stretch>
                                    <Text ghost style={styles.set}>
                                        {currentSet?.reps}
                                    </Text>
                                </ThemedView>
                            </>
                        )}
                    </HStack>
                    <ThemedView ghost padding style={{ width: 49 }} />
                </HStack>
            </ThemedView>
            <ThemedBottomSheetModal title={t("previous_training_note_title").concat(date)} onRequestClose={handleCloseNote} ref={ref}>
                <ThemedView ghost stretch style={{ margin: 20 }}>
                    <Text ghost stretch style={{ fontSize: 20 }}>
                        {note}
                    </Text>
                </ThemedView>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
