import { setEditedWorkout } from "../../../store/reducers/workout";
import { HStack } from "../../Stack/HStack/HStack";
import { styles } from "../index/styles";
import { Text } from "../../Themed/ThemedText/Text";
import { ColorIndicator } from "../../ColorIndicator/ColorIndicator";
import React, { useCallback } from "react";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { getHasHistory, getIsOngoingWorkout, getLatestWorkoutDateDisplay, getOverallTrainingTrend, getWorkoutByIndex } from "../../../store/reducers/workout/workoutSelectors";
import { useNavigate } from "../../../hooks/navigate";
import { View } from "react-native";
import { ProgressDisplay } from "../../WorkoutCard/components/ProgressDisplay/ProgressDisplay";
import { HistoryDisplay } from "../history/HistoryDisplay/HistoryDisplay";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../Themed/ThemedView/View";

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
    const { t } = useTranslation();
    const isOngoingWorkout = useAppSelector((state: AppState) => getIsOngoingWorkout(state, index));
    const showHint = trend || hasHistory;

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
                {isOngoingWorkout && (
                    <ThemedView style={styles.pausedTrainigWrapper} input round>
                        <Text ghost>{t("workout_paused_hint")}</Text>
                    </ThemedView>
                )}
            </HStack>

            {showHint ? (
                <View style={styles.innerTrainWrapper}>
                    {trend !== undefined && <ProgressDisplay type="Workout" wasPositive={trend.isPositive} onPress={handleNavigateToProgress} name={trend.name} percent={trend.percent} />}
                    {hasHistory && <HistoryDisplay workoutIndex={index} handleNavigateToHistory={handleNavigateToHistory} />}
                </View>
            ) : (
                <ThemedView ghost round>
                    <Text italic>{t("workout_no_done_workouts_hint")}</Text>
                </ThemedView>
            )}
        </View>
    );
};
