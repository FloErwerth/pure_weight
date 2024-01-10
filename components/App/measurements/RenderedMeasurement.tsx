import { VStack } from "../../Stack/VStack/VStack";
import { View } from "react-native";
import { Text } from "../../Themed/ThemedText/Text";
import { HStack } from "../../Stack/HStack/HStack";
import { useCallback, useMemo } from "react";
import { styles } from "./styles";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { ProgressDisplay } from "../../WorkoutCard/components/ProgressDisplay/ProgressDisplay";
import { Measurement } from "./types";

import { getLanguage } from "../../../store/reducers/settings/settingsSelectors";
import { getLatestMeasurements, getMeasurmentProgress } from "../../../store/reducers/measurements/measurementSelectors";
import { useNavigate } from "../../../hooks/navigate";
import { setEditedMeasurement } from "../../../store/reducers/measurements";
import { getSinceDate } from "../../../utils/timeAgo";

interface MeasurementProps {
    index: number;
    measurement: Measurement;
}

export const RenderedMeasurement = ({ index, measurement }: MeasurementProps) => {
    const latestMeasurements = useAppSelector(getLatestMeasurements);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const language = useAppSelector(getLanguage);
    const progress = useAppSelector((state: AppState) => getMeasurmentProgress(state, index));
    const wasPositive = useMemo(() => progress !== undefined && progress > 0, [progress]);
    const handleNavigateToChart = useCallback(() => {
        dispatch(setEditedMeasurement({ index, isNew: false, isDataPoint: false }));
        navigate("measurement/progress");
    }, [dispatch, index, navigate]);
    const trend = useMemo(
        () => ({
            isPositive: wasPositive,
            percent: progress ?? 0,
            name: measurement.name,
        }),
        [wasPositive, progress, measurement.name],
    );
    return (
        <HStack style={styles.pressableWrapper}>
            <VStack style={styles.vStack}>
                <View>
                    <Text style={styles.text}>{measurement.name}</Text>
                    <Text style={styles.date}>{getSinceDate(latestMeasurements[index], language)}</Text>
                </View>
                <ProgressDisplay type="Measurement" trend={trend} higherIsBetter={measurement.higherIsBetter} onPress={handleNavigateToChart} />
            </VStack>
        </HStack>
    );
};
