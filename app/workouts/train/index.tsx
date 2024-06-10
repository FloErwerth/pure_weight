import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { trainStyles } from "../../../components/App/train/trainStyles";
import { BackButtonModal } from "../../../components/AlertModal/BackButtonModal";
import { useNavigate } from "../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { Animated, Dimensions } from "react-native";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { StopwatchPopover } from "../../../components/StopwatchPopover/StopwatchPopover";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel/src/Carousel";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { mutateActiveExerciseInTrainedWorkout, pauseTrainedWorkout, resetTrainedWorkout, saveCurrentWorkout, setActiveExerciseIndex } from "../../../store/reducers/workout";

import {
    getCanSnap,
    getExerciseDone,
    getHasNoTrainingDataSaved,
    getIsDoneWithTraining,
    getTrainedWorkout,
    getTrainedWorkoutExercises,
    getWorkoutByIndex,
} from "../../../store/selectors/workout/workoutSelectors";
import { TrainedExercise } from "../../../components/App/train/Exercise/TrainedExercise";
import { ExerciseId } from "../../../store/reducers/workout/types";
import { CarouselRenderItemInfo, ICarouselInstance } from "react-native-reanimated-carousel/lib/typescript/types";
import { getSwitchToNextExercise } from "../../../store/selectors/settings/settingsSelectors";
import { WorkoutSettings } from "../../../components/App/settings/Sections/workout";
import { useTypedTranslation } from "../../../locales/i18next";
import { TranslationKeys } from "../../../locales/translationKeys";

export const Train = () => {
    const { t } = useTypedTranslation();
    const { bottom } = useSafeAreaInsets();
    const workoutExercises = useAppSelector(getTrainedWorkoutExercises);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const confirmButtonOpacity = useRef(new Animated.Value(0.3)).current;
    const { ref: alertRef, openBottomSheet: openAlert, closeBottomSheet: closeAlert } = useBottomSheetRef();
    const isDone = useAppSelector(getIsDoneWithTraining);
    const hasNoTrainingData = useAppSelector(getHasNoTrainingDataSaved);
    const { ref, openBottomSheet: open } = useBottomSheetRef();
    const trainedWorkout = useAppSelector(getTrainedWorkout);
    const carouselRef = useRef<ICarouselInstance>(null);
    const shouldSwitch = useAppSelector(getSwitchToNextExercise);
    const isExerciseDone = useAppSelector(getExerciseDone);
    const canSnap = useAppSelector(getCanSnap);
    const workoutName = useAppSelector((state: AppState) => getWorkoutByIndex(state, trainedWorkout?.workoutId))?.name;

    useEffect(() => {
        if (isDone) {
            Animated.timing(confirmButtonOpacity, {
                duration: 200,
                toValue: 1,
                useNativeDriver: true,
            }).start();
        }
    }, [isDone]);

    useEffect(() => {
        if (shouldSwitch && isExerciseDone && canSnap) {
            setTimeout(() => {
                carouselRef.current?.next({ animated: true });
            }, 100);
            dispatch(mutateActiveExerciseInTrainedWorkout({ key: "canSnap", value: false }));
        }
    }, [canSnap, dispatch, isExerciseDone, shouldSwitch]);

    const handleNavigateToWorkouts = useCallback(() => {
        navigate("workouts");
    }, [navigate]);

    const handlePauseWorkout = useCallback(() => {
        dispatch(pauseTrainedWorkout());
        handleNavigateToWorkouts();
    }, [dispatch, handleNavigateToWorkouts]);

    const handleReset = useCallback(() => {
        dispatch(resetTrainedWorkout());
    }, [dispatch]);

    const handleSaveTrainingData = useCallback(() => {
        dispatch(saveCurrentWorkout());
    }, [dispatch]);

    const handleDone = useCallback(() => {
        handleSaveTrainingData();
        handleReset();
        handleNavigateToWorkouts();
    }, [handleNavigateToWorkouts, handleReset, handleSaveTrainingData]);

    const handleNotDoneConfirm = useCallback(() => {
        handleSaveTrainingData();
        handleReset();
        handleNavigateToWorkouts();
        closeAlert();
    }, [handleSaveTrainingData, handleReset, handleNavigateToWorkouts, closeAlert]);

    const handleCloseButton = useCallback(() => {
        if (!hasNoTrainingData) {
            handleReset();
            handleNavigateToWorkouts();
        } else {
            openAlert();
        }
    }, [hasNoTrainingData, handleReset, handleNavigateToWorkouts, openAlert]);

    const buttonsStyle = useMemo(() => [trainStyles.buttons, { marginBottom: bottom }], [bottom]);
    const alertModalConfig = useMemo(() => ({ title: t(isDone ? TranslationKeys.WORKOUT_QUIT_TITLE : TranslationKeys.WORKOUT_EARLY_QUIT_TITLE) }), [isDone, t]);

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

    const renderItem = useCallback(
        ({ item: { exerciseId } }: CarouselRenderItemInfo<{ exerciseId: ExerciseId }>) => {
            return <TrainedExercise workoutId={trainedWorkout?.workoutId} exerciseId={exerciseId} />;
        },
        [trainedWorkout?.workoutId],
    );

    const handleSetActiveExerciseIndex = useCallback(
        (exerciseIndex: number) => {
            dispatch(setActiveExerciseIndex(exerciseIndex));
        },
        [dispatch],
    );

    const handleCancelWorkout = useCallback(() => {
        handleReset();
        closeAlert();
        handleNavigateToWorkouts();
    }, [handleReset, closeAlert, handleNavigateToWorkouts]);

    const quickSettingsTitle = useMemo(() => t(TranslationKeys.WORKOUT_QUICK_SETTINGS_TITLE), [t]);

    return (
        <ThemedView background style={trainStyles.wrapper} stretch>
            <ThemedView background style={trainStyles.navigationWrapper}>
                <SiteNavigationButtons
                    confirmButtonDisabled={!isDone}
                    handleConfirmOpacity={confirmButtonOpacity}
                    backButtonAction={handleCloseButton}
                    handleConfirm={handleDone}
                    title={workoutName}
                    handleQuicksettings={open}
                />
            </ThemedView>
            <ThemedView background stretch>
                <Carousel
                    ref={carouselRef}
                    onSnapToItem={handleSetActiveExerciseIndex}
                    scrollAnimationDuration={100}
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
            <BackButtonModal workoutDone={isDone} reference={alertRef} title={alertModalConfig.title} onConfirm={handleNotDoneConfirm} onPause={handlePauseWorkout} onCancel={handleCancelWorkout} />
            <ThemedBottomSheetModal title={quickSettingsTitle} ref={ref}>
                <ThemedView style={trainStyles.quickSettingsWrapper} ghost>
                    <WorkoutSettings />
                </ThemedView>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
