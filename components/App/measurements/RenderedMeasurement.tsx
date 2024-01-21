import { VStack } from "../../Stack/VStack/VStack";
import { View } from "react-native";
import { Text } from "../../Themed/ThemedText/Text";
import { HStack } from "../../Stack/HStack/HStack";
import React, { useCallback, useMemo } from "react";
import { styles } from "./styles";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { ProgressDisplay } from "../../WorkoutCard/components/ProgressDisplay/ProgressDisplay";
import { Measurement } from "./types";

import { getLanguage } from "../../../store/reducers/settings/settingsSelectors";
import { getLatestMeasurements, getMeasurmentProgress } from "../../../store/reducers/measurements/measurementSelectors";
import { useNavigate } from "../../../hooks/navigate";
import { setEditedMeasurement } from "../../../store/reducers/measurements";
import { getSinceDate } from "../../../utils/timeAgo";
import { HistoryDisplay } from "../history/HistoryDisplay/HistoryDisplay";

interface MeasurementProps {
    measurement: Measurement;
}

export const RenderedMeasurement = ({ measurement }: MeasurementProps) => {
    const latestMeasurements = useAppSelector(getLatestMeasurements);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const language = useAppSelector(getLanguage);
    const progress = useAppSelector((state: AppState) => getMeasurmentProgress(state, measurement.measurementId));

    const handleNavigateToChart = useCallback(() => {
        dispatch(setEditedMeasurement({ isNew: false, isEditing: false, measurement }));
        navigate("measurement/progress");
    }, [dispatch, measurement, navigate]);

    const handleGoToHistory = useCallback(() => {
        dispatch(setEditedMeasurement({ isNew: false, isEditing: false, measurement }));
        navigate("measurement/history");
    }, [dispatch, measurement, navigate]);

    const trend = useMemo(
        () => ({
            percent: progress ?? 0,
            name: measurement.name,
        }),
        [progress, measurement.name],
    );

    return (
        <HStack style={styles.pressableWrapper}>
            <VStack style={styles.vStack}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.text}>{measurement.name}</Text>
                    <Text style={styles.date}>{getSinceDate(latestMeasurements[measurement.measurementId], language)}</Text>
                </View>
                <ProgressDisplay type="Measurement" trend={trend} higherIsBetter={measurement.higherIsBetter} onPress={handleNavigateToChart} />
                <HistoryDisplay id={measurement.measurementId} type="Measurement" handleNavigateToHistory={handleGoToHistory} />
            </VStack>
        </HStack>
    );
};
