import { AppState, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { Pressable, View } from "react-native";
import { borderRadius } from "../../theme/border";
import { VStack } from "../Stack/VStack/VStack";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/context";
import { useCallback, useMemo } from "react";
import { HStack } from "../Stack/HStack/HStack";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedView } from "../Themed/ThemedView/View";
import { ThemedButtomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedButtomSheetModal";

import { getPreviousTraining } from "../../store/reducers/workout/workoutSelectors";

interface PreviousTrainingProps {
    exerciseIndex: number;
    activeSetIndex: number;
}
export const PreviousTraining = ({ exerciseIndex, activeSetIndex }: PreviousTrainingProps) => {
    const previousWorkout = useAppSelector((state: AppState) => getPreviousTraining(state, state.settingsState.language, exerciseIndex));
    const { t } = useTranslation();
    const { textDisabled, componentBackgroundColor, mainColor, secondaryColor, inputFieldBackgroundColor } = useTheme();
    const [ref] = useBottomSheetRef();
    const mappedData = useMemo(
        () =>
            previousWorkout?.sets.map(({ weight, reps }, index) => {
                const highlight = activeSetIndex === index;
                const filled = activeSetIndex > index;
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
                    <ThemedView>
                        <Pressable onPress={handleShowEditNoteModal}>
                            <HStack style={styles.noteButtonWrapper}>
                                <Text>Show note</Text>
                                <MaterialCommunityIcons name="note-text-outline" color={mainColor} size={20} />
                            </HStack>
                        </Pressable>
                    </ThemedView>
                )}
            </HStack>
            <ThemedView style={{ padding: 10, borderRadius }}>
                {sets?.length > 0 && (
                    <VStack style={{ backgroundColor: componentBackgroundColor }}>
                        <HStack ghost style={styles.innerWrapper}>
                            <Text style={[styles.setDisplayStyle, { color: secondaryColor }]}>{"#"}</Text>
                            <Text style={[{ color: secondaryColor }, styles.set]}>{t("training_header_weight")}</Text>
                            <Text style={[{ color: secondaryColor }, styles.set]}>{t("training_header_reps")}</Text>
                        </HStack>
                        {mappedData}
                    </VStack>
                )}
            </ThemedView>
            <ThemedButtomSheetModal title={`Your note from ${date}`} onRequestClose={handleCloseNote} ref={ref}>
                <Text style={{ fontSize: 20 }}>{note}</Text>
            </ThemedButtomSheetModal>
        </View>
    );
};
