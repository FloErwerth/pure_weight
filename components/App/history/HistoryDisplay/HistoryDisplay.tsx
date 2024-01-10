import { Text } from "../../../Themed/ThemedText/Text";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import React from "react";
import { styles } from "./styles";
import { HStack } from "../../../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { AppState, useAppSelector } from "../../../../store";
import { getNumberHistories } from "../../../../store/reducers/workout/workoutSelectors";
import { useTranslation } from "react-i18next";

interface HistoryDisplayProps {
    workoutId: number;
    handleNavigateToHistory: () => void;
}

const useHistoryText = (numberHistoryEntries?: number) => {
    const { t } = useTranslation();
    if (!numberHistoryEntries || numberHistoryEntries === 0) {
        return t("workout_history_empty");
    } else if (numberHistoryEntries === 1) {
        return t("workout_history_single");
    } else {
        return `${numberHistoryEntries} ${t("workout_history_plural")}`;
    }
};

export const HistoryDisplay = ({ workoutId, handleNavigateToHistory }: HistoryDisplayProps) => {
    const numberHistoryEntries = useAppSelector((state: AppState) => getNumberHistories(state, workoutId));
    const historyText = useHistoryText(numberHistoryEntries);
    return (
        <ThemedPressable style={styles.wrapper} secondary onPress={handleNavigateToHistory}>
            <HStack style={{ justifyContent: "space-between", alignItems: "center" }} ghost>
                <Text ghost style={styles.text}>
                    {historyText}
                </Text>
                <ThemedMaterialCommunityIcons ghost name="chevron-right" size={20} />
            </HStack>
        </ThemedPressable>
    );
};
