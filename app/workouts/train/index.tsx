import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trainStyles } from "../../../components/App/train/trainStyles";
import { WeightBasedExerciseData } from "../../../store/types";
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
import { useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedButtomSheetModal";
import { workoutContext } from "../../../components/App/train/workoutContext";
import { addDoneWorkout, setActiveExerciseIndex } from "../../../store/reducers/workout";

import { getActiveExerciseIndex, getIsDoneWithTraining, getTrainedWorkout } from "../../../store/reducers/workout/workoutSelectors";

export type DoneExercises = Map<number, { note?: string; sets: Map<number, WeightBasedExerciseData> }>;
function mapOfMapsTo2DArray(map: DoneExercises) {
    const result: Array<{ exerciseIndex: number; note?: string; sets: Array<WeightBasedExerciseData> }> = [];
    map.forEach((innerMap, key) => {
        result[key] = { exerciseIndex: key, note: innerMap.note, sets: [...innerMap.sets.values()] };
    });
    return result;
}

export function Train() {
    const { bottom } = useSafeAreaInsets();
    const { t } = useTranslation();
    const trainedWorkout = useAppSelector(getTrainedWorkout);
    const [doneExercises, setDoneExercises] = useState<DoneExercises>(new Map());
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const confirmButtonOpacity = useRef(new Animated.Value(0)).current;
    const [ref, _, close] = useBottomSheetRef();
    const isDone = useAppSelector(getIsDoneWithTraining);
    const exerciseIndex = useAppSelector(getActiveExerciseIndex);

    useEffect(() => {
        if (isDone) {
            Animated.timing(confirmButtonOpacity, {
                duration: 200,
                toValue: 1,
                useNativeDriver: true,
            }).start();
        }
    }, [isDone]);

    const handleSaveTrainingData = useCallback(() => {
        dispatch(addDoneWorkout(mapOfMapsTo2DArray(doneExercises)));
    }, [dispatch, doneExercises]);

    const handleReset = useCallback(() => {
        setDoneExercises(new Map());
        navigate("workouts");
    }, [navigate, setDoneExercises]);

    const handleDone = useCallback(() => {
        handleSaveTrainingData();
        handleReset();
    }, [handleReset, handleSaveTrainingData]);

    const handleCloseAlert = useCallback(() => close(), [close]);

    const handleNotDoneConfirm = useCallback(() => {
        ref.current?.close();
        handleSaveTrainingData();
        handleReset();
    }, [handleReset, handleSaveTrainingData, ref]);

    const handleCloseButton = useCallback(() => {
        if (!isDone) {
            ref.current?.present();
        } else {
            handleSaveTrainingData();
            handleReset();
        }
    }, [handleReset, handleSaveTrainingData, isDone, ref]);

    const handleSaveNote = useCallback(
        (exerciseIndex: number, note: string | undefined) => {
            const newDoneExercises = new Map(doneExercises.entries());
            const existingSets = newDoneExercises.get(exerciseIndex)?.sets;
            newDoneExercises.set(exerciseIndex, { note, sets: existingSets ?? new Map() });
            setDoneExercises(newDoneExercises);
        },
        [doneExercises],
    );

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

    const contextValue = useMemo(() => ({ doneSetsThisExercise: doneExercises, handleSaveNote }), [doneExercises, handleSaveNote]);

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
                    handleConfirmOpacity={confirmButtonOpacity}
                    handleBack={handleCloseButton}
                    handleConfirm={handleDone}
                    title={t("workout_front").concat(" ", trainedWorkout?.workout?.name ?? "")}
                />
            </ThemedView>
            <ThemedView background stretch>
                <workoutContext.Provider value={contextValue}>
                    <Carousel
                        onSnapToItem={handleSetActiveExerciseIndex}
                        scrollAnimationDuration={200}
                        width={Dimensions.get("screen").width}
                        loop={false}
                        vertical={false}
                        renderItem={renderItem}
                        data={mappedExercises}
                    />
                </workoutContext.Provider>
            </ThemedView>
            {exerciseIndex !== undefined && (
                <HStack background style={buttonsStyle}>
                    <StopwatchPopover />
                </HStack>
            )}
            <AlertModal reference={ref} title={alertModalConfig.title} content={alertModalConfig.content} onConfirm={handleNotDoneConfirm} onCancel={handleCloseAlert} />
        </ThemedView>
    );
}
