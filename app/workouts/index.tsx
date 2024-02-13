import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "../../hooks/navigate";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import {
    getIsOngoingWorkout,
    getSearchedWorkout,
    getSortedWorkouts,
    getTrainedWorkout,
    getWorkouts,
} from "../../store/reducers/workout/workoutSelectors";
import {
    createNewWorkout,
    recoverWorkout,
    removeWorkout,
    resumeTrainedWorkout,
    setEditedWorkout,
    setSearchedWorkout,
    startWorkout,
} from "../../store/reducers/workout";
import { Sorting } from "../../components/Sorting/Sorting";
import { RenderedWorkout } from "../../components/App/workout/RenderedWorkout";
import { PageContent } from "../../components/PageContent/PageContent";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { BottomToast } from "../../components/BottomToast/BottomToast";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../components/BottomSheetModal/ThemedBottomSheetModal";
import { Text } from "../../components/Themed/ThemedText/Text";
import { ThemedPressable } from "../../components/Themed/Pressable/Pressable";
import { getLanguage } from "../../store/reducers/settings/settingsSelectors";
import { trainStyles } from "../../components/App/train/trainStyles";
import { HStack } from "../../components/Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { useToast } from "../../components/BottomToast/useToast";
import { WorkoutId } from "../../store/reducers/workout/types";
import { View } from "react-native";
import { ExpandableSearchbar } from "../../components/Searchbar/ExpandableSearchbar";

const usePauseWarningContent = () => {
    const language = useAppSelector(getLanguage);

    if (language === "de") {
        return {
            title: "Bereits pausiertes Training",
            message: `Bitte beachte, dass ein Workout pausiert ist. Bitte wähle, ob Du ein neues Workout starten oder dein pausiertes Training fortsetzen möchtest.`,
            resumeTrainingText: "Training fortsetzen",
            newTrainingText: "Neues Training starten",
        };
    }
    return {
        title: "Paused workout",
        message: `Please note that a workout is paused. Please choose whether you want to start a new workout or continue your paused training.`,
        resumeTrainingText: "Resume training",
        newTrainingText: "Start new workout",
    };
};

export function Workouts() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const savedWorkouts = useAppSelector(getSortedWorkouts);
    const workoutFilter = useAppSelector(getSearchedWorkout);

    const filteredWorkouts = useMemo(
        () =>
            savedWorkouts.filter((workout) => {
                if (!workoutFilter) {
                    return true;
                }

                return workout.name.toLowerCase().includes(workoutFilter?.toLowerCase());
            }),
        [savedWorkouts, workoutFilter],
    );
    const numberOfWorkouts = useAppSelector(getWorkouts).length;

    const navigate = useNavigate();
    const trainedWorkout = useAppSelector(getTrainedWorkout);
    const { ref, openBottomSheet, closeBottomSheet } = useBottomSheetRef();
    const [newWorkoutIndex, setNewWorkoutIndex] = useState<WorkoutId | undefined>(undefined);
    const isOngoingWorkout = useAppSelector((state: AppState) => getIsOngoingWorkout(state, newWorkoutIndex));
    const { toastRef, openToast, closeToast, showToast } = useToast();
    const { resumeTrainingText, title, message, newTrainingText } = usePauseWarningContent();

    const handleCreateWorkout = useCallback(() => {
        dispatch(createNewWorkout());
        navigate("create");
    }, [dispatch, navigate]);

    const confirmIcon = useMemo((): { name: "plus"; size: number } => ({ name: "plus", size: 40 }), []);

    const onEdit = useCallback(
        (workoutId: WorkoutId) => {
            dispatch(setEditedWorkout({ workoutId }));
            navigate("create");
        },
        [dispatch, navigate],
    );

    const onDelete = useCallback(
        (workoutId: WorkoutId) => {
            dispatch(removeWorkout(workoutId));
            if (showToast && toastRef.current) {
                toastRef.current.restart();
            } else {
                openToast();
            }
        },
        [dispatch, openToast, showToast, toastRef],
    );

    const handleStartWorkout = useCallback(
        (workoutId?: WorkoutId) => {
            if (workoutId === undefined && newWorkoutIndex !== undefined) {
                dispatch(startWorkout(newWorkoutIndex));
            } else if (workoutId !== undefined) {
                dispatch(startWorkout(workoutId));
            } else {
                navigate("workouts");
                return;
            }
            navigate("train");
        },
        [dispatch, navigate, newWorkoutIndex],
    );

    const handleStartWorkoutCases = useCallback(
        (workoutId: WorkoutId) => {
            if (trainedWorkout) {
                openBottomSheet();
                setNewWorkoutIndex(workoutId);
                return;
            }
            handleStartWorkout(workoutId);
        },
        [handleStartWorkout, openBottomSheet, trainedWorkout],
    );

    const handleConfirmResume = useCallback(() => {
        dispatch(resumeTrainedWorkout());
        navigate("train");
        closeBottomSheet();
    }, [closeBottomSheet, dispatch, navigate]);

    const handleConfirmOverwrite = useCallback(() => {
        handleStartWorkout();
        closeBottomSheet();
    }, [closeBottomSheet, handleStartWorkout]);

    const handleRecoverWorkout = useCallback(() => {
        dispatch(recoverWorkout());
        closeToast();
    }, [closeToast, dispatch]);

    const mappedWorkouts = useMemo(
        () =>
            filteredWorkouts.map(({ name, workoutId }) => (
                <Swipeable
                    key={name.concat(workoutId?.toString())}
                    onClick={() => handleStartWorkoutCases(workoutId)}
                    onDelete={() => onDelete(workoutId)}
                    onEdit={() => onEdit(workoutId)}>
                    <RenderedWorkout workoutId={workoutId} />
                </Swipeable>
            )),
        [filteredWorkouts, handleStartWorkoutCases, onDelete, onEdit],
    );

    const handleSetSearchedWorkouts = useCallback(
        (searchString?: string) => {
            dispatch(setSearchedWorkout(searchString));
        },
        [dispatch],
    );

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons
                titleFontSize={40}
                title={t("workouts")}
                handleConfirmIcon={confirmIcon}
                handleConfirm={handleCreateWorkout}
            />
            {numberOfWorkouts > 1 && (
                <PageContent ghost>
                    <HStack ghost style={trainStyles.searchAndFilterBar}>
                        <Sorting type="Workout" />
                        <ExpandableSearchbar handleSetSearchManual={handleSetSearchedWorkouts} />
                    </HStack>
                </PageContent>
            )}
            <PageContent scrollable={mappedWorkouts.length > 2} background ignoreGap stretch>
                <View style={trainStyles.workoutWrapper}>{mappedWorkouts}</View>
            </PageContent>
            <BottomToast
                reference={toastRef}
                bottom={5}
                onRequestClose={closeToast}
                open={showToast}
                messageKey={"undo_message"}
                titleKey={"workout_deleted_title"}
                onRedo={handleRecoverWorkout}
            />
            <ThemedBottomSheetModal title={title} ref={ref}>
                <PageContent paddingTop={20} stretch ghost>
                    <Text style={trainStyles.button} ghost stretch>
                        {message}
                    </Text>
                    {isOngoingWorkout && (
                        <ThemedPressable round onPress={handleConfirmResume}>
                            <HStack style={trainStyles.confirmOverwriteWrapper} round center>
                                <ThemedMaterialCommunityIcons ghost name="play" size={24} />
                                <Text center ghost style={trainStyles.button}>
                                    {resumeTrainingText}
                                </Text>
                            </HStack>
                        </ThemedPressable>
                    )}
                    <ThemedPressable round onPress={handleConfirmOverwrite}>
                        <HStack style={trainStyles.confirmOverwriteWrapper} round center>
                            <ThemedMaterialCommunityIcons ghost name="restart" size={24} />
                            <Text center ghost style={trainStyles.button}>
                                {newTrainingText}
                            </Text>
                        </HStack>
                    </ThemedPressable>
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
}
