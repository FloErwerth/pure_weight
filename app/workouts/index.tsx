import { ScrollView } from "react-native";
import React, { useCallback, useMemo } from "react";
import { useNavigate } from "../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../store";
import { styles } from "../../components/App/index/styles";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { getWorkouts } from "../../store/reducers/workout/workoutSelectors";
import { createNewWorkout } from "../../store/reducers/workout";
import { WorkoutSorting } from "../../components/App/train/WorkoutSorting/WorkoutSorting";
import { RenderedWorkout } from "../../components/App/workout/RenderedWorkout";

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
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const savedWorkouts = useAppSelector(getWorkouts);
    const navigate = useNavigate();

    const handleCreateWorkout = useCallback(() => {
        dispatch(createNewWorkout());
        navigate("create");
    }, [dispatch, navigate]);

    const confirmIcon = useMemo((): { name: "plus"; size: number } => ({ name: "plus", size: 40 }), []);

    return (
        <ThemedView stretch background style={styles.view}>
            <SiteNavigationButtons titleFontSize={40} title={t("workouts")} handleConfirmIcon={confirmIcon} handleConfirm={handleCreateWorkout} />
            <WorkoutSorting />
            <ScrollView style={styles.savedTrainings}>
                {savedWorkouts.map(({ name }, index) => (
                    <RenderedWorkout key={name.concat(index.toString())} index={index} />
                ))}
            </ScrollView>
        </ThemedView>
    );
}
