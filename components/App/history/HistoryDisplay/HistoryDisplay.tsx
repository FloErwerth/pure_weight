import { Text } from "../../../Themed/ThemedText/Text";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import React from "react";
import { styles } from "./styles";
import { HStack } from "../../../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { AppState, useAppSelector } from "../../../../store";
import { getNumberWorkoutHistoryEntries } from "../../../../store/reducers/workout/workoutSelectors";
import { useTranslation } from "react-i18next";
import { getNumberMeasurementEntries } from "../../../../store/reducers/measurements/measurementSelectors";

interface HistoryDisplayProps {
    type: "Workout" | "Measurement";
    id: number;
    handleNavigateToHistory: () => void;
}

const useHistoryText = (numberHistoryEntries?: number, type: "Workout" | "Measurement") => {
    const { t } = useTranslation();
    if (!numberHistoryEntries || numberHistoryEntries === 0) {
        return type === "Workout" ? t("workout_history_empty") : t("measurement_history_empty");
    } else if (numberHistoryEntries === 1) {
        return type === "Workout" ? t("workout_history_single") : t("measurement_history_single");
    } else {
        return type === "Workout" ? `${numberHistoryEntries} ${t("workout_history_plural")}` : `${numberHistoryEntries} ${t("measurement_history_plural")}`;
    }
};

export const HistoryDisplay = ({ type, id, handleNavigateToHistory }: HistoryDisplayProps) => {
    const workoutHistoryEntries = useAppSelector((state: AppState) => getNumberWorkoutHistoryEntries(state, id));
    const measurementHistoryEntries = useAppSelector((state: AppState) => getNumberMeasurementEntries(state, id));

    const numberOfEntries = type === "Workout" ? workoutHistoryEntries : measurementHistoryEntries;

    const historyText = useHistoryText(numberOfEntries, type);
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
