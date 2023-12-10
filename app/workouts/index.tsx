import { FlatList } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../store";
import { styles } from "../../components/App/index/styles";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import * as Locale from "expo-localization";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { Text } from "../../components/Themed/ThemedText/Text";
import { ProgressDisplay } from "../../components/WorkoutCard/components/ProgressDisplay/ProgressDisplay";
import { BottomToast } from "../../components/BottomToast/BottomToast";
import { HStack } from "../../components/Stack/HStack/HStack";
import { ColorIndicator } from "../../components/ColorIndicator/ColorIndicator";
import { HistoryDisplay } from "../../components/App/history/HistoryDisplay/HistoryDisplay";
import { cleanErrors } from "../../store/reducers/errors";
import { getHasHistory, getNumberHistories, getOverallTrainingTrend, getWorkouts } from "../../store/reducers/workout/workoutSelectors";
import { createNewWorkout, recoverWorkout, removeWorkout, setEditedWorkout, startWorkout } from "../../store/reducers/workout";

import { getLanguage } from "../../store/reducers/settings/settingsSelectors";
import { WorkoutSorting } from "../../components/App/train/WorkoutSorting/WorkoutSorting";

type RenderedItem = {
    handleNavigateToProgress: () => void;
    workoutName: string;
    key: string;
    onEdit: () => void;
    onDelete: () => void;
    onClick: () => void;
    color: string;
    bestPreviousTraining: { name: string; percent: number; isPositive?: boolean } | undefined;
    hasHistory: boolean;
    handleNavigateToHistory: () => void;
    numberHistoryEntries: number;
};

export function Workouts() {
    const language = useAppSelector(getLanguage);
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();
    const previousTrainingByIndex = useAppSelector(getOverallTrainingTrend);
    const numberHistoryGetter = useAppSelector(getNumberHistories);
    const hasHistoryByIndex = useAppSelector(getHasHistory);
    const [showToast, setShowToast] = useState(false);
    const savedWorkouts = useAppSelector(getWorkouts);
    const navigate = useNavigate();

    useEffect(() => {
        i18n.changeLanguage(language ?? Locale.getLocales()[0].languageCode ?? "en");
        dispatch(cleanErrors());
    }, []);

    const handleCreateWorkout = useCallback(() => {
        dispatch(createNewWorkout());
        navigate("create");
    }, [dispatch, navigate]);

    const confirmIcon = useMemo((): { name: "plus"; size: number } => ({ name: "plus", size: 40 }), []);

    const mappedWorkouts = useMemo(() => {
        return savedWorkouts.map((workout, index) => {
            const onEdit = () => {
                dispatch(setEditedWorkout({ index }));
                navigate("create");
            };

            const onDelete = () => {
                dispatch(removeWorkout(index));
                setShowToast(true);
            };

            const key = workout.name.concat("-key").concat((index * Math.random() * 2).toString());
            const onClick = () => {
                dispatch(startWorkout(index));
                navigate("train");
            };
            const bestPreviousTraining = previousTrainingByIndex(index);
            const hasHistory = hasHistoryByIndex(index);

            const handleNavigateToProgress = () => {
                dispatch(setEditedWorkout({ index }));
                navigate("workout/progress");
            };

            const handleNavigateToHistory = () => {
                dispatch(setEditedWorkout({ index }));
                navigate("history");
            };

            const numberHistoryEntries = numberHistoryGetter(index);

            const color = workout.calendarColor;
            return {
                handleNavigateToProgress,
                onEdit,
                onDelete,
                key,
                onClick,
                workoutName: workout.name,
                bestPreviousTraining,
                color,
                hasHistory,
                handleNavigateToHistory,
                numberHistoryEntries,
            };
        });
    }, [dispatch, hasHistoryByIndex, navigate, numberHistoryGetter, previousTrainingByIndex, savedWorkouts]);

    const handleRecoverWorkout = useCallback(() => {
        dispatch(recoverWorkout());
        setShowToast(false);
    }, [dispatch]);

    const renderItem = useCallback(
        ({
            item: { handleNavigateToProgress, workoutName, key, onEdit, onDelete, onClick, bestPreviousTraining, color, hasHistory, handleNavigateToHistory, numberHistoryEntries },
        }: {
            item: RenderedItem;
        }) => {
            return (
                <Swipeable onEdit={onEdit} onDelete={onDelete} onClick={onClick} key={key}>
                    <HStack style={styles.outerTrainWrapper}>
                        <Text style={styles.title}>{workoutName}</Text>
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
            );
        },
        [],
    );

    return (
        <ThemedView stretch background style={styles.view}>
            <SiteNavigationButtons titleFontSize={40} title={t("workouts")} handleConfirmIcon={confirmIcon} handleConfirm={handleCreateWorkout} />
            <WorkoutSorting />
            <FlatList decelerationRate="normal" keyExtractor={(item) => item.key} style={styles.savedTrainings} data={mappedWorkouts} renderItem={renderItem}></FlatList>
            <BottomToast onRequestClose={() => setShowToast(false)} open={showToast} messageKey={"workout_deleted_message"} titleKey={"workout_deleted_title"} onRedo={handleRecoverWorkout} />
        </ThemedView>
    );
}
