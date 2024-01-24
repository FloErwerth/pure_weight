import { AppState, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/context";
import { useCallback, useMemo } from "react";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedView } from "../Themed/ThemedView/View";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";

import { getActiveSetIndex, getPreviousWorkout } from "../../store/reducers/workout/workoutSelectors";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ExerciseType } from "../../store/reducers/workout/types";
import { styles } from "./styles";
import { PreviousWorkoutHeader } from "./PreviousWorkoutHeader";
import { getMillisecondsFromTimeInput, getTimeDisplayFromMilliseconds } from "../../utils/timeDisplay";

interface PreviousTrainingProps {
    exerciseIndex: number;
    exerciseType: ExerciseType;
}
export const PreviousWorkout = ({ exerciseIndex, exerciseType }: PreviousTrainingProps) => {
    const previousWorkout = useAppSelector((state: AppState) => getPreviousWorkout(state, state.settingsState.language, exerciseIndex));
    const { t } = useTranslation();
    const { textDisabled, mainColor, secondaryColor, inputFieldBackgroundColor } = useTheme();
    const { ref, closeBottomSheet: close } = useBottomSheetRef();
    const activeSetIndex = useAppSelector((state: AppState) => getActiveSetIndex(state, exerciseIndex));
    const mappedData = useMemo(
        () =>
            previousWorkout?.sets.map(({ weight, reps, duration }, index) => {
                const highlight = activeSetIndex === index;
                const filled = activeSetIndex !== undefined && activeSetIndex > index;
                const highlightWrapperStyles = { backgroundColor: highlight ? inputFieldBackgroundColor : "transparent" };
                const computedColor = highlight || filled ? mainColor : secondaryColor;
                if (exerciseType === "TIME_BASED") {
                    return (
                        <HStack key={Math.random() * 102} style={[styles.innerWrapper, highlightWrapperStyles]}>
                            <Text ghost style={[styles.number, { color: computedColor }]}>
                                {index + 1}
                            </Text>
                            <HStack ghost stretch style={styles.setOuterWrapper}>
                                <ThemedView ghost round stretch style={styles.setWrapper}>
                                    <Text ghost style={[{ color: computedColor }, styles.set]}>
                                        {getTimeDisplayFromMilliseconds(getMillisecondsFromTimeInput(duration))}
                                    </Text>
                                </ThemedView>
                            </HStack>
                        </HStack>
                    );
                }
                return (
                    <HStack stretch key={Math.random() * 102} style={[styles.innerWrapper, highlightWrapperStyles]}>
                        <Text ghost style={[styles.number, { color: computedColor }]}>
                            {index + 1}
                        </Text>
                        <HStack ghost stretch style={styles.setOuterWrapper}>
                            <ThemedView ghost round stretch style={styles.setWrapper}>
                                <Text ghost style={[{ color: computedColor }, styles.set]}>
                                    {weight}
                                </Text>
                            </ThemedView>
                            <ThemedView style={styles.setWrapper} ghost round stretch>
                                <Text ghost style={[{ color: computedColor }, styles.set]}>
                                    {reps}
                                </Text>
                            </ThemedView>
                        </HStack>
                    </HStack>
                );
            }),
        [activeSetIndex, exerciseType, inputFieldBackgroundColor, mainColor, previousWorkout?.sets, secondaryColor],
    );

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
    if (!sets || sets?.length === 0 || sets?.some((val) => val === undefined)) {
        return null;
    }

    return (
        <View>
            <HStack ghost style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
                <Text background style={{ fontSize: 16, color: textDisabled, padding: note ? 0 : 10 }}>
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
                {sets?.length > 0 && (
                    <>
                        <PreviousWorkoutHeader exerciseType={exerciseType} />
                        {mappedData}
                    </>
                )}
            </ThemedView>
            <ThemedBottomSheetModal snapPoints={["100%"]} title={t("previous_training_note_title").concat(date)} onRequestClose={handleCloseNote} ref={ref}>
                <ThemedView ghost stretch style={{ margin: 20 }}>
                    <Text ghost stretch style={{ fontSize: 20 }}>
                        {note}
                    </Text>
                    <ThemedPressable onPress={close} padding center round>
                        <Text style={{ fontSize: 20 }}>{t("close_note")}</Text>
                    </ThemedPressable>
                </ThemedView>
            </ThemedBottomSheetModal>
        </View>
    );
};
