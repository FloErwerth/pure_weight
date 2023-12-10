import { recoverWorkout, removeWorkout, setEditedWorkout, startWorkout } from "../../../store/reducers/workout";
import { Swipeable } from "../../WorkoutCard/Swipeable";
import { HStack } from "../../Stack/HStack/HStack";
import { styles } from "../index/styles";
import { Text } from "../../Themed/ThemedText/Text";
import { ColorIndicator } from "../../ColorIndicator/ColorIndicator";
import { ProgressDisplay } from "../../WorkoutCard/components/ProgressDisplay/ProgressDisplay";
import { HistoryDisplay } from "../history/HistoryDisplay/HistoryDisplay";
import React, { useCallback, useState } from "react";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { useNavigate } from "../../../hooks/navigate";
import { getHasHistory, getNumberHistories, getOverallTrainingTrend, getWorkoutByIndex } from "../../../store/reducers/workout/workoutSelectors";
import { BottomToast } from "../../BottomToast/BottomToast";

type RenderedWorkoutProps = {
    index: number;
};
export const RenderedWorkout = ({ index }: RenderedWorkoutProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const bestPreviousTraining = useAppSelector((state: AppState) => getOverallTrainingTrend(state, index));
    const numberHistoryGetter = useAppSelector(getNumberHistories);
    const hasHistoryByIndex = useAppSelector(getHasHistory);
    const [showToast, setShowToast] = useState(false);
    const workout = useAppSelector((state: AppState) => getWorkoutByIndex(state, index));

    const onEdit = () => {
        dispatch(setEditedWorkout({ index }));
        navigate("create");
    };

    const onDelete = () => {
        dispatch(removeWorkout(index));
        setShowToast(true);
    };

    const onClick = () => {
        dispatch(startWorkout(index));
        navigate("train");
    };
    const hasHistory = hasHistoryByIndex(index);

    const handleNavigateToProgress = () => {
        dispatch(setEditedWorkout({ index }));
        navigate("workout/progress");
    };

    const handleNavigateToHistory = () => {
        dispatch(setEditedWorkout({ index }));
        navigate("history");
    };

    const handleRecoverWorkout = useCallback(() => {
        dispatch(recoverWorkout());
        setShowToast(false);
    }, [dispatch]);

    const numberHistoryEntries = numberHistoryGetter(index);

    const color = workout.calendarColor;

    return (
        <>
            <Swipeable onEdit={onEdit} onDelete={onDelete} onClick={onClick}>
                <HStack style={styles.outerTrainWrapper}>
                    <Text style={styles.title}>{workout.name}</Text>
                    <ColorIndicator color={color} height={6} width={6} />
                </HStack>
                {bestPreviousTraining && (
                    <ProgressDisplay
                        type="Workout"
                        wasPositive={bestPreviousTraining.isPositive}
                        onPress={handleNavigateToProgress}
                        name={bestPreviousTraining.name}
                        percent={bestPreviousTraining.percent}
                    />
                )}
                {hasHistory && <HistoryDisplay numberHistoryEntries={numberHistoryEntries} handleNavigateToHistory={handleNavigateToHistory} />}
            </Swipeable>
            <BottomToast onRequestClose={() => setShowToast(false)} open={showToast} messageKey={"workout_deleted_message"} titleKey={"workout_deleted_title"} onRedo={handleRecoverWorkout} />
        </>
    );
};
