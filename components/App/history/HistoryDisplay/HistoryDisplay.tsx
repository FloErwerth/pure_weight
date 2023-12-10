import { Text } from "../../../Themed/ThemedText/Text";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import React from "react";
import { useTranslation } from "react-i18next";
import { styles } from "./styles";
import { HStack } from "../../../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { borderRadius } from "../../../../theme/border";
import { AppState, useAppSelector } from "../../../../store";
import { getNumberHistories } from "../../../../store/reducers/workout/workoutSelectors";

interface HistoryDisplayProps {
    workoutIndex: number;
    handleNavigateToHistory: () => void;
}

export const HistoryDisplay = ({ workoutIndex, handleNavigateToHistory }: HistoryDisplayProps) => {
    const { t } = useTranslation();
    const numberHistoryEntries = useAppSelector((state: AppState) => getNumberHistories(state, workoutIndex));
    return (
        <ThemedPressable style={styles.wrapper} secondary onPress={handleNavigateToHistory}>
            <HStack style={{ justifyContent: "space-between", alignItems: "center" }} ghost>
                <Text ghost>{numberHistoryEntries} workouts done</Text>
                <HStack secondary style={{ alignItems: "center", padding: 5, borderRadius }}>
                    <Text ghost>{t("history_cta")}</Text>
                    <ThemedMaterialCommunityIcons ghost name="chevron-right" size={20} />
                </HStack>
            </HStack>
        </ThemedPressable>
    );
};
