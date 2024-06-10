import { AppState, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { useCallback, useMemo } from "react";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedView } from "../Themed/ThemedView/View";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";

import { getActiveSetIndex, getPreviousWorkout } from "../../store/selectors/workout/workoutSelectors";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ExerciseId, ExerciseType } from "../../store/reducers/workout/types";
import { styles } from "./styles";
import { getMillisecondsFromTimeInput, getTimeDisplayFromMilliseconds } from "../../utils/timeDisplay";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";

interface PreviousTrainingProps {
    exerciseId: ExerciseId;
    exerciseType: ExerciseType;
}
export const PreviousWorkout = ({ exerciseId, exerciseType }: PreviousTrainingProps) => {
    const previousWorkout = useAppSelector((state: AppState) => getPreviousWorkout(state, state.settingsState.language, exerciseId));

    const { t } = useTypedTranslation();
    const { ref } = useBottomSheetRef();
    const activeSetIndex = useAppSelector((state: AppState) => getActiveSetIndex(state, exerciseId)) ?? -1;
    const currentSet = previousWorkout?.sets[activeSetIndex ?? 0];

    const handleShowEditNoteModal = useCallback(() => {
        ref.current?.present();
    }, [ref]);

    const handleCloseNote = useCallback(() => {
        ref.current?.dismiss();
    }, [ref]);

    const dateTextStyles = useMemo(() => ({ fontSize: 16, padding: previousWorkout?.note ? 0 : 10 }), [previousWorkout?.note]);
    const previousTrainingTitle = useMemo(() => previousWorkout?.date && t(TranslationKeys.PREVIOUS_TRAINING_NOTE_TITLE).concat(previousWorkout.date), [previousWorkout?.date, t]);
    if (!previousWorkout) {
        return null;
    }

    const { sets, date, note } = previousWorkout;

    if (!currentSet || activeSetIndex === -1 || !sets || sets?.length === 0 || sets?.some((val) => val === undefined)) {
        return null;
    }

    return (
        <ThemedView ghost>
            <HStack ghost center style={{ justifyContent: "space-between" }}>
                <Text ghost secondary style={dateTextStyles}>
                    {t(TranslationKeys.PREVIOUS_TRAINING_TITLE_WITH_DATE)}
                    {date}
                </Text>
                {note && (
                    <ThemedView ghost>
                        <ThemedPressable padding style={styles.noteButtonWrapper} onPress={handleShowEditNoteModal}>
                            <Text>{t(TranslationKeys.TRAINING_INPUT_SHOW_NOTE)}</Text>
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
                                    {getTimeDisplayFromMilliseconds(getMillisecondsFromTimeInput(currentSet?.durationMinutes, currentSet?.durationSeconds))}
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
            <ThemedBottomSheetModal title={previousTrainingTitle} onRequestClose={handleCloseNote} ref={ref}>
                <ThemedView ghost stretch style={styles.modalWrapper}>
                    <Text ghost stretch style={styles.modalText}>
                        {note}
                    </Text>
                </ThemedView>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
