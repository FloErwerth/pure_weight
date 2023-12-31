import { AppState, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { View } from "react-native";
import { borderRadius } from "../../theme/border";
import { VStack } from "../Stack/VStack/VStack";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/context";
import { useCallback, useMemo } from "react";
import { HStack } from "../Stack/HStack/HStack";
import { styles } from "./styles";
import { ThemedView } from "../Themed/ThemedView/View";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";

import { getActiveSetIndex, getPreviousTraining } from "../../store/reducers/workout/workoutSelectors";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { getLanguage, getWeightUnit } from "../../store/reducers/settings/settingsSelectors";
import { getLocaleDate } from "../../utils/date";
import { IsoDate } from "../../types/date";

interface PreviousTrainingProps {
    exerciseIndex: number;
}
export const PreviousTraining = ({ exerciseIndex }: PreviousTrainingProps) => {
    const previousWorkout = useAppSelector((state: AppState) => getPreviousTraining(state, state.settingsState.language, exerciseIndex));
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();
    const { textDisabled, componentBackgroundColor, mainColor, secondaryColor, inputFieldBackgroundColor } = useTheme();
    const [ref, , close] = useBottomSheetRef();
    const activeSetIndex = useAppSelector((state: AppState) => getActiveSetIndex(state, exerciseIndex));
    const weightUnit = useAppSelector(getWeightUnit);
    const mappedData = useMemo(
        () =>
            previousWorkout?.sets.map(({ weight, reps }, index) => {
                const highlight = activeSetIndex === index;
                const filled = activeSetIndex !== undefined && activeSetIndex > index;
                const highlightWrapperStyles = { backgroundColor: highlight ? inputFieldBackgroundColor : "transparent" };
                const computedColor = highlight || filled ? mainColor : secondaryColor;
                return (
                    <HStack key={Math.random() * 102} style={[styles.innerWrapper, highlightWrapperStyles]}>
                        <Text ghost style={[styles.setDisplayStyle, { color: computedColor }]}>
                            {index + 1}
                        </Text>
                        <Text ghost style={[{ color: computedColor }, styles.set]}>
                            {weight}
                        </Text>
                        <Text ghost style={[{ color: computedColor }, styles.set]}>
                            {reps}
                        </Text>
                    </HStack>
                );
            }),
        [activeSetIndex, inputFieldBackgroundColor, mainColor, previousWorkout?.sets, secondaryColor],
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
            <ThemedView style={{ padding: 10, borderRadius }}>
                {sets?.length > 0 && (
                    <VStack style={{ backgroundColor: componentBackgroundColor }}>
                        <HStack ghost style={styles.innerWrapper}>
                            <Text style={[styles.setDisplayStyle, { color: secondaryColor }]}>{"#"}</Text>
                            <Text style={[{ color: secondaryColor }, styles.set]}>{weightUnit}</Text>
                            <Text style={[{ color: secondaryColor }, styles.set]}>{t("training_header_reps")}</Text>
                        </HStack>
                        {mappedData}
                    </VStack>
                )}
            </ThemedView>
            <ThemedBottomSheetModal
                snapPoints={["100%"]}
                title={t("previous_training_note_title").concat(getLocaleDate(date as IsoDate, language, { dateStyle: "medium" }))}
                onRequestClose={handleCloseNote}
                ref={ref}
            >
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
