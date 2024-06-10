import { Text } from "../../../Themed/ThemedText/Text";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import React from "react";
import { styles } from "./styles";
import { HStack } from "../../../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { AppState, useAppSelector } from "../../../../store";
import { WorkoutId, WorkoutIdType } from "../../../../store/reducers/workout/types";
import { MeasurementId, MeasurementIdType } from "../../measurements/types";
import { getNumberWorkoutHistoryEntries } from "../../../../store/selectors/workout/workoutSelectors";
import { getNumberMeasurementEntries } from "../../../../store/selectors/measurements/measurementSelectors";
import { useTypedTranslation } from "../../../../locales/i18next";
import { TranslationKeys } from "../../../../locales/translationKeys";

interface HistoryDisplayProps {
    type: WorkoutIdType | MeasurementIdType;
    id: WorkoutId | MeasurementId;
    handleNavigateToHistory: () => void;
}

const useHistoryEntries = (type: WorkoutIdType | MeasurementIdType, id: WorkoutId | MeasurementId) => {
    const workoutHistoryEntries = useAppSelector((state: AppState) => getNumberWorkoutHistoryEntries(state, id as WorkoutId));
    const measurementHistoryEntries = useAppSelector((state: AppState) => getNumberMeasurementEntries(state, id as MeasurementId));
    return type === "workout" ? workoutHistoryEntries : measurementHistoryEntries;
};

const useHistoryText = (numberHistoryEntries?: number, type: WorkoutIdType | MeasurementIdType = "workout") => {
    const { t } = useTypedTranslation();
    if (!numberHistoryEntries || numberHistoryEntries === 0) {
        return t(type === "workout" ? TranslationKeys.WORKOUT_HISTORY_EMPTY : TranslationKeys.MEASUREMENT_HISTORY_EMPTY);
    } else if (numberHistoryEntries === 1) {
        return t(type === "workout" ? TranslationKeys.WORKOUT_HISTORY_SINGLE : TranslationKeys.MEASUREMENT_HISTORY_SINGLE);
    } else {
        return type === "workout" ? `${numberHistoryEntries} ${t(TranslationKeys.WORKOUT_HISTORY_PLURAL)}` : `${numberHistoryEntries} ${t(TranslationKeys.MEASUREMENT_HISTORY_PLURAL)}`;
    }
};

export const HistoryDisplay = ({ type, id, handleNavigateToHistory }: HistoryDisplayProps) => {
    const numberOfEntries = useHistoryEntries(type, id);
    const historyText = useHistoryText(numberOfEntries, type);
    return (
        <ThemedPressable style={styles.wrapper} secondary onPress={handleNavigateToHistory}>
            <HStack style={styles.hStack} ghost>
                <Text ghost style={styles.text}>
                    {historyText}
                </Text>
                <ThemedMaterialCommunityIcons ghost name="chevron-right" size={20} />
            </HStack>
        </ThemedPressable>
    );
};
