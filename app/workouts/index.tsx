import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "../../hooks/navigate";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { getIsOngoingWorkout, getSortedWorkouts, getTrainedWorkout } from "../../store/reducers/workout/workoutSelectors";
import { createNewWorkout, recoverWorkout, removeWorkout, setEditedWorkout, startWorkout } from "../../store/reducers/workout";
import { WorkoutSorting } from "../../components/App/train/WorkoutSorting/WorkoutSorting";
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
    const [showToast, setShowToast] = useState(false);
    const savedWorkouts = useAppSelector(getSortedWorkouts);
    const navigate = useNavigate();
    const trainedWorkout = useAppSelector(getTrainedWorkout);
    const [ref, open, close] = useBottomSheetRef();
    const [newWorkoutIndex, setNewWorkoutIndex] = useState<number | undefined>(undefined);
    const isOngoingWorkout = useAppSelector((state: AppState) => getIsOngoingWorkout(state, newWorkoutIndex ?? -1));

    const { resumeTrainingText, title, message, newTrainingText } = usePauseWarningContent();

    const handleCreateWorkout = useCallback(() => {
        dispatch(createNewWorkout());
        navigate("create");
    }, [dispatch, navigate]);

    const confirmIcon = useMemo((): { name: "plus"; size: number } => ({ name: "plus", size: 40 }), []);

    const onEdit = useCallback(
        (workoutId: number) => {
            dispatch(setEditedWorkout({ workoutId }));
            navigate("create");
        },
        [dispatch, navigate],
    );

    const onDelete = useCallback(
        (workoutId: number) => {
            dispatch(removeWorkout(workoutId));
            setShowToast(true);
        },
        [dispatch],
    );

    const handleStartWorkout = useCallback(
        (workoutId?: number) => {
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
        (workoutId: number) => {
            if (trainedWorkout) {
                open();
                setNewWorkoutIndex(workoutId);
                return;
            }
            handleStartWorkout(workoutId);
        },
        [handleStartWorkout, navigate, open, trainedWorkout],
    );

    const handleConfirmResume = useCallback(() => {
        navigate("train");
        close();
    }, [navigate]);

    const handleConfirmOverwrite = useCallback(() => {
        handleStartWorkout();
        close();
    }, [close, handleStartWorkout]);

    const handleRecoverWorkout = useCallback(() => {
        dispatch(recoverWorkout());
        setShowToast(false);
    }, [dispatch]);

    const mappedWorkouts = useMemo(
        () =>
            savedWorkouts.map(({ name, workoutId }) => (
                <Swipeable key={name.concat(workoutId?.toString())} onClick={() => handleStartWorkoutCases(workoutId)} onDelete={() => onDelete(workoutId)} onEdit={() => onEdit(workoutId)}>
                    <RenderedWorkout workoutId={workoutId} />
                </Swipeable>
            )),
        [savedWorkouts, handleStartWorkoutCases, onDelete, onEdit],
    );
    const closeToast = useCallback(() => {
        setShowToast(false);
    }, []);
    return (
        <ThemedView stretch background>
            <SiteNavigationButtons titleFontSize={40} title={t("workouts")} handleConfirmIcon={confirmIcon} handleConfirm={handleCreateWorkout} />
            <WorkoutSorting />
            <PageContent background ignoreGap stretch paddingTop={20}>
                {mappedWorkouts}
            </PageContent>
            <BottomToast bottom={5} onRequestClose={closeToast} open={showToast} messageKey={"undo_message"} titleKey={"workout_deleted_title"} onRedo={handleRecoverWorkout} />
            <ThemedBottomSheetModal snapPoints={["40%"]} title={title} ref={ref}>
                <PageContent paddingTop={20} stretch ghost>
                    <Text style={trainStyles.button} ghost stretch>
                        {message}
                    </Text>
                    {isOngoingWorkout && (
                        <HStack style={trainStyles.confirmOverwriteWrapper} round center>
                            <ThemedMaterialCommunityIcons ghost name="play" size={24} />
                            <ThemedPressable center onPress={handleConfirmResume}>
                                <Text center ghost style={trainStyles.button}>
                                    {resumeTrainingText}
                                </Text>
                            </ThemedPressable>
                        </HStack>
                    )}
                    <HStack style={trainStyles.confirmOverwriteWrapper} round center>
                        <ThemedMaterialCommunityIcons ghost name="restart" size={24} />
                        <ThemedPressable center onPress={handleConfirmOverwrite}>
                            <Text center ghost style={trainStyles.button}>
                                {newTrainingText}
                            </Text>
                        </ThemedPressable>
                    </HStack>
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
}
