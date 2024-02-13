import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { trainStyles } from "../../../components/App/train/trainStyles";
import { BackButtonModal } from "../../../components/AlertModal/BackButtonModal";
import { useNavigate } from "../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { Animated, Dimensions } from "react-native";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { StopwatchPopover } from "../../../components/StopwatchPopover/StopwatchPopover";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel/src/Carousel";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { pauseTrainedWorkout, resetTrainedWorkout, saveCurrentWorkout, setActiveExerciseIndex } from "../../../store/reducers/workout";

import {
    getHasNoTrainingDataSaved,
    getIsDoneWithTraining,
    getTrainedWorkout,
    getTrainedWorkoutExercises,
} from "../../../store/reducers/workout/workoutSelectors";
import { WorkoutSettings } from "../../../components/App/settings/Sections/workout";
import { TrainedExercise } from "../../../components/App/train/Exercise/TrainedExercise";
import { ExerciseId } from "../../../store/reducers/workout/types";
import { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";

export function Train() {
    const { bottom } = useSafeAreaInsets();
    const { t } = useTranslation();
    const workoutExercises = useAppSelector(getTrainedWorkoutExercises);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const confirmButtonOpacity = useRef(new Animated.Value(0.3)).current;
    const { ref: alertRef, openBottomSheet: openAlert, closeBottomSheet: closeAlert } = useBottomSheetRef();
    const isDone = useAppSelector(getIsDoneWithTraining);
    const hasNoTrainingData = useAppSelector(getHasNoTrainingDataSaved);
    const { ref, openBottomSheet: open } = useBottomSheetRef();
    const trainedWorkout = useAppSelector(getTrainedWorkout);

    useEffect(() => {
        if (isDone) {
            Animated.timing(confirmButtonOpacity, {
                duration: 200,
                toValue: 1,
                useNativeDriver: true,
            }).start();
        }
    }, [isDone]);

    const handleNavigateToWorkouts = useCallback(() => {
        navigate("workouts");
    }, [navigate]);

    const handlePauseWorkout = useCallback(() => {
        dispatch(pauseTrainedWorkout());
        handleNavigateToWorkouts();
    }, [dispatch, handleNavigateToWorkouts]);

    const handleReset = useCallback(() => {
        handleNavigateToWorkouts();
        dispatch(resetTrainedWorkout());
    }, [dispatch, handleNavigateToWorkouts]);

    const handleSaveTrainingData = useCallback(() => {
        dispatch(saveCurrentWorkout());
    }, [dispatch]);

    const handleDone = useCallback(() => {
        handleSaveTrainingData();
        handleReset();
    }, [handleReset, handleSaveTrainingData]);

    const handleNotDoneConfirm = useCallback(() => {
        handleSaveTrainingData();
        handleReset();
        closeAlert();
    }, [handleSaveTrainingData, handleReset, closeAlert]);

    const handleCloseButton = useCallback(() => {
        if (!hasNoTrainingData) {
            handleReset();
        } else {
            openAlert();
        }
    }, [hasNoTrainingData, handleReset, openAlert]);

    const buttonsStyle = useMemo(() => [trainStyles.buttons, { marginBottom: bottom }], [bottom]);
    const alertModalConfig = useMemo(() => ({ title: t(isDone ? "workout_quit_title" : "workout_early_quit_title") }), [isDone, t]);

    const mappedExercises: { exerciseId: ExerciseId }[] = useMemo(() => {
        if (!trainedWorkout) {
            handleNavigateToWorkouts();
        }
        return (
            workoutExercises?.map(({ exerciseId }) => ({
                exerciseId,
            })) ?? []
        );
    }, [handleNavigateToWorkouts, trainedWorkout, workoutExercises]);

    const renderItem = useCallback(({ item: { exerciseId } }: CarouselRenderItemInfo<{ exerciseId: ExerciseId }>) => {
        return <TrainedExercise exerciseId={exerciseId} />;
    }, []);

    const handleSetActiveExerciseIndex = useCallback(
        (exerciseIndex: number) => {
            dispatch(setActiveExerciseIndex(exerciseIndex));
        },
        [dispatch],
    );

    const handleCancelWorkout = useCallback(() => {
        handleReset();
        closeAlert();
    }, [handleReset, closeAlert]);

    const quickSettingsTitle = useMemo(() => t("workout_quick_settings_title"), [t]);

    const quickSettingsConfig = useMemo(() => ({ disableStopwatch: true }), []);

    return (
        <ThemedView background style={trainStyles.wrapper} stretch>
            <ThemedView background style={trainStyles.navigationWrapper}>
                <SiteNavigationButtons
                    confirmButtonDisabled={!isDone}
                    handleConfirmOpacity={confirmButtonOpacity}
                    handleBack={handleCloseButton}
                    handleConfirm={handleDone}
                    title={t("train_title")}
                    titleFontSize={40}
                    handleQuicksettings={open}
                />
            </ThemedView>
            <ThemedView background stretch>
                <Carousel
                    onSnapToItem={handleSetActiveExerciseIndex}
                    scrollAnimationDuration={300}
                    width={Dimensions.get("screen").width}
                    loop={false}
                    vertical={false}
                    renderItem={renderItem}
                    data={mappedExercises}
                />
            </ThemedView>
            <HStack background style={buttonsStyle}>
                <StopwatchPopover />
            </HStack>
            <BackButtonModal
                workoutDone={isDone}
                snapPoints={["40%"]}
                reference={alertRef}
                title={alertModalConfig.title}
                onConfirm={handleNotDoneConfirm}
                onPause={handlePauseWorkout}
                onCancel={handleCancelWorkout}
            />
            <ThemedBottomSheetModal title={quickSettingsTitle} snapPoints={["40%"]} ref={ref}>
                <ThemedView style={trainStyles.quickSettingsWrapper} ghost>
                    <WorkoutSettings quickSettings={quickSettingsConfig} />
                </ThemedView>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
}
