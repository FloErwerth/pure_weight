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
import { WorkoutId, WorkoutIdType } from "../../../../store/reducers/workout/types";
import { MeasurementId, MeasurementIdType } from "../../measurements/types";

interface HistoryDisplayProps {
    type: WorkoutIdType | MeasurementIdType;
    id: WorkoutId | MeasurementId;
    handleNavigateToHistory: () => void;
}

const useHistoryText = (numberHistoryEntries?: number, type: WorkoutIdType | MeasurementIdType = "workout") => {
    const { t } = useTranslation();
    if (!numberHistoryEntries || numberHistoryEntries === 0) {
        return type === "workout" ? t("workout_history_empty") : t("measurement_history_empty");
    } else if (numberHistoryEntries === 1) {
        return type === "workout" ? t("workout_history_single") : t("measurement_history_single");
    } else {
        return type === "workout" ? `${numberHistoryEntries} ${t("workout_history_plural")}` : `${numberHistoryEntries} ${t("measurement_history_plural")}`;
    }
};

const useHistoryEntries = (type: WorkoutIdType | MeasurementIdType, id: WorkoutId | MeasurementId) => {
    const workoutHistoryEntries = useAppSelector((state: AppState) => getNumberWorkoutHistoryEntries(state, id as WorkoutId));
    const measurementHistoryEntries = useAppSelector((state: AppState) => getNumberMeasurementEntries(state, id as MeasurementId));
    return type === "workout" ? workoutHistoryEntries : measurementHistoryEntries;
};

export const HistoryDisplay = ({ type, id, handleNavigateToHistory }: HistoryDisplayProps) => {
    const numberOfEntries = useHistoryEntries(type, id);
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
