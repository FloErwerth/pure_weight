import { FlatList, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../store";
import { getHasHistory, getLanguage, getNumberHistories, getOverallTrainingTrend } from "../../store/selectors";
import { styles } from "../../components/App/index/styles";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import * as Locale from "expo-localization";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { PageContent } from "../../components/PageContent/PageContent";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { Text } from "../../components/Themed/ThemedText/Text";
import { ProgressDisplay } from "../../components/WorkoutCard/components/ProgressDisplay/ProgressDisplay";
import { BottomToast } from "../../components/BottomToast/BottomToast";
import { HStack } from "../../components/Stack/HStack/HStack";
import { ColorIndicator } from "../../components/ColorIndicator/ColorIndicator";
import { WorkoutSorting } from "../../components/App/train/WorkoutSorting/WorkoutSorting";
import { HistoryDisplay } from "../../components/App/history/HistoryDisplay/HistoryDisplay";
import { cleanErrors } from "../../store/reducers/errors";
import { getSortedWorkouts } from "../../store/reducers/workout/selectors";
import { recoverWorkout, removeWorkout, setWorkoutIndex, startWorkout } from "../../store/reducers/workout";

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

    useEffect(() => {
        i18n.changeLanguage(language ?? Locale.getLocales()[0].languageCode ?? "en");
        dispatch(cleanErrors());
    }, []);

    const navigate = useNavigate();

    const savedWorkouts = useAppSelector(getSortedWorkouts);

    const handleNavigateToCreateTraining = useCallback(() => {
        dispatch(setWorkoutIndex(-1));
        navigate("create");
    }, [dispatch, navigate]);

    const handleNavigateToTrain = useCallback(
        (index: number) => {
            dispatch(startWorkout(index));
            navigate("train");
        },
        [dispatch, navigate],
    );

    const handleDelete = useCallback(
        (index: number) => {
            dispatch(removeWorkout(index));
            setShowToast(true);
        },
        [dispatch],
    );

    const handleEdit = useCallback(
        (index: number) => {
            handleNavigateToCreateTraining();
            dispatch(setWorkoutIndex(index));
        },
        [dispatch, handleNavigateToCreateTraining],
    );

    const confirmIcon = useMemo((): { name: "plus"; size: number } => ({ name: "plus", size: 40 }), []);

    const mappedTrainings = useMemo(() => {
        return savedWorkouts.map((trainingDay, index) => {
            const onEdit = () => handleEdit(index);
            const onDelete = () => handleDelete(index);
            const key = trainingDay.name.concat("-key").concat((index * Math.random() * 2).toString());
            const onClick = () => handleNavigateToTrain(index);
            const bestPreviousTraining = previousTrainingByIndex(index);
            const hasHistory = hasHistoryByIndex(index);
            const handleNavigateToProgress = () => {
                dispatch(setWorkoutIndex(index));
                navigate("progress");
            };

            const handleNavigateToHistory = () => {
                dispatch(setWorkoutIndex(index));
                navigate("history");
            };

            const numberHistoryEntries = numberHistoryGetter(index);

            const color = trainingDay.calendarColor;
            return {
                handleNavigateToProgress,
                onEdit,
                onDelete,
                key,
                onClick,
                workoutName: trainingDay.name,
                bestPreviousTraining,
                color,
                hasHistory,
                handleNavigateToHistory,
                numberHistoryEntries,
            };
        });
    }, [
        dispatch,
        handleDelete,
        handleEdit,
        handleNavigateToTrain,
        hasHistoryByIndex,
        navigate,
        numberHistoryGetter,
        previousTrainingByIndex,
        savedWorkouts,
    ]);

    const handleRecoverWorkout = useCallback(() => {
        dispatch(recoverWorkout());
        setShowToast(false);
    }, [dispatch]);

    const renderItem = useCallback(
        ({
            item: {
                handleNavigateToProgress,
                workoutName,
                key,
                onEdit,
                onDelete,
                onClick,
                bestPreviousTraining,
                color,
                hasHistory,
                handleNavigateToHistory,
                numberHistoryEntries,
            },
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
        <ThemedView background style={styles.view}>
            <View style={styles.vStack}>
                <SiteNavigationButtons
                    titleFontSize={40}
                    title={t("workouts")}
                    handleConfirmIcon={confirmIcon}
                    handleConfirm={handleNavigateToCreateTraining}
                />
                <PageContent>
                    <WorkoutSorting />
                    <FlatList
                        decelerationRate="normal"
                        keyExtractor={(item) => item.key}
                        style={styles.savedTrainings}
                        data={mappedTrainings}
                        renderItem={renderItem}
                    ></FlatList>
                </PageContent>
            </View>
            <BottomToast
                onRequestClose={() => setShowToast(false)}
                open={showToast}
                messageKey={"workout_deleted_message"}
                titleKey={"workout_deleted_title"}
                onRedo={handleRecoverWorkout}
            />
        </ThemedView>
    );
}
