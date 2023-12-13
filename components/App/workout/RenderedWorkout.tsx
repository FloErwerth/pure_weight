import { setEditedWorkout } from "../../../store/reducers/workout";
import { HStack } from "../../Stack/HStack/HStack";
import { styles } from "../index/styles";
import { Text } from "../../Themed/ThemedText/Text";
import { ColorIndicator } from "../../ColorIndicator/ColorIndicator";
import React, { useCallback } from "react";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { getHasHistory, getLatestWorkoutDateDisplay, getOverallTrainingTrend, getWorkoutByIndex } from "../../../store/reducers/workout/workoutSelectors";
import { useNavigate } from "../../../hooks/navigate";
import { View } from "react-native";
import { ThemedMaterialCommunityIcons } from "../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ProgressDisplay } from "../../WorkoutCard/components/ProgressDisplay/ProgressDisplay";
import { HistoryDisplay } from "../history/HistoryDisplay/HistoryDisplay";

type RenderedWorkoutProps = {
    index: number;
};
export const RenderedWorkout = ({ index }: RenderedWorkoutProps) => {
    const workout = useAppSelector((state: AppState) => getWorkoutByIndex(state, index));
    const dispatch = useAppDispatch();
    const trend = useAppSelector((state: AppState) => getOverallTrainingTrend(state, index));
    const hasHistory = useAppSelector((state: AppState) => getHasHistory(state, index));
    const latestWorkoutDate = useAppSelector((state: AppState) => getLatestWorkoutDateDisplay(state, index));
    const navigate = useNavigate();
    const handleNavigateToProgress = useCallback(() => {
        dispatch(setEditedWorkout({ index }));
        navigate("workout/progress");
    }, [dispatch, index, navigate]);

    const handleNavigateToHistory = useCallback(() => {
        dispatch(setEditedWorkout({ index }));
        navigate("history");
    }, [dispatch, index, navigate]);

    return (
        <View style={styles.outerTrainWrapper}>
            <HStack style={styles.outerTrainWrapper}>
                <View>
                    <HStack style={styles.innerTrainWrapper}>
                        <Text style={styles.title}>{workout.name}</Text>
                        <ColorIndicator color={workout.calendarColor} height={6} width={6} />
                    </HStack>
                    {latestWorkoutDate && <Text style={styles.date}>{latestWorkoutDate}</Text>}
                </View>
                <ThemedMaterialCommunityIcons name="chevron-right" size={24} />
            </HStack>
            <View style={styles.innerTrainWrapper}>
                {trend !== undefined && <ProgressDisplay type="Workout" wasPositive={trend.isPositive} onPress={handleNavigateToProgress} name={trend.name} percent={trend.percent} />}
                {hasHistory && <HistoryDisplay workoutIndex={index} handleNavigateToHistory={handleNavigateToHistory} />}
            </View>
        </View>
    );
};
