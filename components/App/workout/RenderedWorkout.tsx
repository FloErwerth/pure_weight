import { setEditedWorkout } from "../../../store/reducers/workout";
import { HStack } from "../../Stack/HStack/HStack";
import { styles } from "../index/styles";
import { Text } from "../../Themed/ThemedText/Text";
import { ColorIndicator } from "../../ColorIndicator/ColorIndicator";
import { ProgressDisplay } from "../../WorkoutCard/components/ProgressDisplay/ProgressDisplay";
import { HistoryDisplay } from "../history/HistoryDisplay/HistoryDisplay";
import React from "react";
import { navigate } from "@react-navigation/routers/src/CommonActions";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { getHasHistory, getNumberHistories, getOverallTrainingTrend, getWorkoutByIndex } from "../../../store/reducers/workout/workoutSelectors";

type RenderedWorkoutProps = {
    index: number;
};
export const RenderedWorkout = ({ index }: RenderedWorkoutProps) => {
    const workout = useAppSelector((state: AppState) => getWorkoutByIndex(state, index));
    const dispatch = useAppDispatch();
    const trend = useAppSelector((state: AppState) => getOverallTrainingTrend(state, index));
    const hasHistory = useAppSelector((state: AppState) => getHasHistory(state, index));
    const numberHistoryEntries = useAppSelector((state: AppState) => getNumberHistories(state, index));

    const handleNavigateToProgress = () => {
        dispatch(setEditedWorkout({ index }));
        navigate("workout/progress");
    };

    const handleNavigateToHistory = () => {
        dispatch(setEditedWorkout({ index }));
        navigate("history");
    };

    return (
        <>
            <HStack style={styles.outerTrainWrapper}>
                <Text style={styles.title}>{workout.name}</Text>
                <ColorIndicator color={workout.calendarColor} height={6} width={6} />
            </HStack>
            {trend && <ProgressDisplay type="Workout" wasPositive={trend.isPositive} onPress={handleNavigateToProgress} name={trend.name} percent={trend.percent} />}
            {hasHistory && <HistoryDisplay numberHistoryEntries={numberHistoryEntries} handleNavigateToHistory={handleNavigateToHistory} />}
        </>
    );
};
