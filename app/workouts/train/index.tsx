import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { trainStyles } from "../../../components/App/train/trainStyles";
import { AlertModal } from "../../../components/AlertModal/AlertModal";
import { useNavigate } from "../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { Animated, Dimensions } from "react-native";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { StopwatchPopover } from "../../../components/StopwatchPopover/StopwatchPopover";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel/src/Carousel";
import { Exercise } from "../../../components/App/train/Exercise/WeightBased/WeightBasedExercise";
import { useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { addDoneWorkout, resetTrainedWorkout, setActiveExerciseIndex } from "../../../store/reducers/workout";

import { getHasAnyTrainedWorkoutData, getIsDoneWithTraining, getTrainedWorkout } from "../../../store/reducers/workout/workoutSelectors";
import { WeightBasedExerciseData } from "../../../store/reducers/workout/types";

export type DoneExercises = Map<number, { note?: string; sets: Map<number, WeightBasedExerciseData> }>;

export function Train() {
    const { bottom } = useSafeAreaInsets();
    const { t } = useTranslation();
    const trainedWorkout = useAppSelector(getTrainedWorkout);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const confirmButtonOpacity = useRef(new Animated.Value(0)).current;
    const [alertRef, openAlert, closeAlert] = useBottomSheetRef();
    const isDone = useAppSelector(getIsDoneWithTraining);
    const hasAnyData = useAppSelector(getHasAnyTrainedWorkoutData);

    useEffect(() => {
        if (isDone) {
            Animated.timing(confirmButtonOpacity, {
                duration: 200,
                toValue: 1,
                useNativeDriver: true,
            }).start();
        }
    }, [isDone]);

    const handleReset = useCallback(() => {
        navigate("workouts");
        dispatch(resetTrainedWorkout());
    }, [dispatch, navigate]);

    const handleSaveTrainingData = useCallback(() => {
        dispatch(addDoneWorkout());
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
        if (!hasAnyData) {
            handleReset();
        } else {
            if (!isDone) {
                openAlert();
            } else {
                handleSaveTrainingData();
                handleReset();
            }
        }
    }, [hasAnyData, handleReset, isDone, openAlert, handleSaveTrainingData]);

    const buttonsStyle = useMemo(() => [trainStyles.buttons, { marginBottom: bottom }], [bottom]);
    const alertModalConfig = useMemo(() => ({ title: t("alert_quit_title"), content: t("alert_quit_message") }), [t]);

    const mappedExercises: { index: number }[] = useMemo(() => {
        if (!trainedWorkout) {
            navigate("workouts");
            return [] as { index: number }[];
        }
        return trainedWorkout.workout.exercises.map((_, index) => ({
            index,
        }));
    }, [navigate, trainedWorkout]);

    const renderItem = useCallback(({ index }: { index: number }) => {
        return <Exercise exerciseIndex={index} />;
    }, []);

    const handleSetActiveExerciseIndex = useCallback(
        (exerciseIndex: number) => {
            dispatch(setActiveExerciseIndex(exerciseIndex));
        },
        [dispatch],
    );

    return (
        <ThemedView background style={trainStyles.wrapper} stretch>
            <ThemedView background style={trainStyles.navigationWrapper}>
                <SiteNavigationButtons
                    confirmButtonDisabled={!isDone}
                    handleConfirmOpacity={confirmButtonOpacity}
                    handleBack={handleCloseButton}
                    handleConfirm={handleDone}
                    title={t("workout_front").concat(" ", trainedWorkout?.workout?.name ?? "")}
                />
            </ThemedView>
            <ThemedView background stretch>
                <Carousel
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
            <AlertModal reference={alertRef} title={alertModalConfig.title} content={alertModalConfig.content} onConfirm={handleNotDoneConfirm} onCancel={closeAlert} />
        </ThemedView>
    );
}
