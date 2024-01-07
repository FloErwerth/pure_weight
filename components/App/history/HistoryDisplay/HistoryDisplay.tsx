import { Text } from "../../../Themed/ThemedText/Text";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import React from "react";
import { styles } from "./styles";
import { HStack } from "../../../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { AppState, useAppSelector } from "../../../../store";
import { getNumberHistories } from "../../../../store/reducers/workout/workoutSelectors";

interface HistoryDisplayProps {
    workoutIndex: number;
    handleNavigateToHistory: () => void;
}

export const HistoryDisplay = ({ workoutIndex, handleNavigateToHistory }: HistoryDisplayProps) => {
    const numberHistoryEntries = useAppSelector((state: AppState) => getNumberHistories(state, workoutIndex));
    return (
        <ThemedPressable style={styles.wrapper} secondary onPress={handleNavigateToHistory}>
            <HStack style={{ justifyContent: "space-between", alignItems: "center" }} ghost>
                <Text ghost>{numberHistoryEntries} workouts done</Text>
                <ThemedMaterialCommunityIcons ghost name="chevron-right" size={20} />
            </HStack>
        </ThemedPressable>
    );
};
