import { setEditedWorkout } from "../../../store/reducers/workout";
import { styles } from "../index/styles";
import { Text } from "../../Themed/ThemedText/Text";
import React, { useCallback } from "react";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import {
    getHasHistory,
    getIsOngoingWorkout,
    getLatestWorkoutDateDisplay,
    getOverallTrainingTrend,
    getWorkoutByIndex,
} from "../../../store/reducers/workout/workoutSelectors";
import { useNavigate } from "../../../hooks/navigate";
import { TouchableHighlight, View } from "react-native";
import { ProgressDisplay } from "../../WorkoutCard/components/ProgressDisplay/ProgressDisplay";
import { HistoryDisplay } from "../history/HistoryDisplay/HistoryDisplay";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../Themed/ThemedView/View";
import { WorkoutId } from "../../../store/reducers/workout/types";
import { useTheme } from "../../../theme/context";

type RenderedWorkoutProps = {
    workoutId: WorkoutId;
};
export const RenderedWorkout = ({ workoutId }: RenderedWorkoutProps) => {
    const workout = useAppSelector((state: AppState) => getWorkoutByIndex(state, workoutId));
    const { secondaryBackgroundColor } = useTheme();
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

    const pausedTrainingHint = isOngoingWorkout ? { backgroundColor: secondaryBackgroundColor, ...styles.pausedTrainingHint } : null;

    return (
        <ThemedView padding ghost style={styles.outerTrainWrapper}>
            <View>
                <Text style={styles.title}>{workout?.name}</Text>
                {latestWorkoutDate && <Text style={styles.date}>{latestWorkoutDate}</Text>}
            </View>
            {showStats ? (
                <View style={styles.innerTrainWrapper}>
                    <ProgressDisplay type="Workout" trend={trend} onPress={handleNavigateToProgress} />
                    <HistoryDisplay type="workout" id={workoutId} handleNavigateToHistory={handleNavigateToHistory} />
                </View>
            ) : (
                <ThemedView ghost>
                    <Text style={styles.noWorkoutsHint} italic>
                        {t("workout_no_done_workouts_hint")}
                    </Text>
                </ThemedView>
            )}
            {isOngoingWorkout && (
                <TouchableHighlight style={pausedTrainingHint}>
                    <Text style={styles.ongoingWorkoutHint} ghost>
                        {t("workout_paused_hint")}
                    </Text>
                </TouchableHighlight>
            )}
        </ThemedView>
    );
};
