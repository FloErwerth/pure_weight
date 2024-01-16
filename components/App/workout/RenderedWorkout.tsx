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
    workoutId: number;
};
export const RenderedWorkout = ({ workoutId }: RenderedWorkoutProps) => {
    const workout = useAppSelector((state: AppState) => getWorkoutByIndex(state, workoutId));
    const dispatch = useAppDispatch();
    const trend = useAppSelector((state: AppState) => getOverallTrainingTrend(state, workoutId));
    const hasHistory = useAppSelector((state: AppState) => getHasHistory(state, workoutId));
    const latestWorkoutDate = useAppSelector((state: AppState) => getLatestWorkoutDateDisplay(state, workoutId));
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isOngoingWorkout = useAppSelector((state: AppState) => getIsOngoingWorkout(state, workoutId));
    const showStats = trend || hasHistory;
    const handleNavigateToProgress = useCallback(() => {
        dispatch(setEditedWorkout({ workoutId }));
        navigate("workout/progress");
    }, [dispatch, workoutId, navigate]);

    const handleNavigateToHistory = useCallback(() => {
        dispatch(setEditedWorkout({ workoutId }));
        navigate("history");
    }, [dispatch, workoutId, navigate]);

    return (
        <View style={styles.outerTrainWrapper}>
            <HStack style={styles.outerTrainWrapper}>
                <View>
                    <HStack style={styles.innerTrainWrapper}>
                        <Text style={styles.title}>{workout?.name}</Text>
                        <ColorIndicator color={workout?.calendarColor} height={6} width={6} />
                    </HStack>
                    {latestWorkoutDate && <Text style={styles.date}>{latestWorkoutDate}</Text>}
                </View>
                {isOngoingWorkout && (
                    <ThemedView style={styles.pausedTrainigWrapper} input round>
                        <Text style={styles.pausedTrainingHint} ghost>
                            {t("workout_paused_hint")}
                        </Text>
                    </ThemedView>
                )}
            </HStack>

            {showStats ? (
                <View style={styles.innerTrainWrapper}>
                    <ProgressDisplay type="Workout" trend={trend} onPress={handleNavigateToProgress} />
                    <HistoryDisplay type="Workout" id={workoutId} handleNavigateToHistory={handleNavigateToHistory} />
                </View>
            ) : (
                <ThemedView ghost>
                    <Text style={styles.noWorkoutsHint} italic>
                        {t("workout_no_done_workouts_hint")}
                    </Text>
                </ThemedView>
            )}
        </View>
    );
};
