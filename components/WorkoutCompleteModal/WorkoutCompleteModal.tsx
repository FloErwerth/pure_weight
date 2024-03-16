import { ThemedView } from "../Themed/ThemedView/View";
import { Text } from "../Themed/ThemedText/Text";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";
import { PageContent } from "../PageContent/PageContent";
import { WorkoutCompleteStatTile } from "./WorkoutCompleteStatTile";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import { getPostWorkoutTrend, getPostWorkoutWorkout } from "../../store/selectors/workout/workoutSelectors";
import { setShowPostWorkoutScreen } from "../../store/reducers/workout";
import { navigationRef } from "../../hooks/navigate";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/context";
import { PostWorkoutScreen } from "../../store/reducers/workout/types";
import { trunicateToNthSignificantDigit } from "../../utils/number";
import { getDurationInSecondsMinutesOrHours } from "../../utils/timeDisplay";
import { FlatList } from "react-native";
import { useGetConvertedWeight } from "../../hooks/useConvertedWeight";

type Stat = PostWorkoutScreen["stats"][number] | undefined;

const useDebouncedShowPostWorkoutScreen = () => {
    const postWorkoutStats = useAppSelector(getPostWorkoutWorkout);
    const [debouncedShowPostWorkoutScreen, setDebouncedShowPostWorkoutScreen] = useState(false);

    useEffect(() => {
        if (postWorkoutStats !== undefined && navigationRef.getCurrentRoute()?.name === "tabs/workouts") {
            setDebouncedShowPostWorkoutScreen(true);
        } else {
            setDebouncedShowPostWorkoutScreen(false);
        }
    }, [navigationRef, postWorkoutStats]);

    return debouncedShowPostWorkoutScreen;
};

const useHeaderStats = (): Stat[] => {
    const postWorkoutTrend = useAppSelector((state: AppState) => getPostWorkoutTrend(state));
    const { t } = useTranslation();
    const { mainColor, successColor, errorColor } = useTheme();
    const postWorkout = useAppSelector(getPostWorkoutWorkout);
    const getConvertedWeight = useGetConvertedWeight();

    const trendStat = useMemo(() => {
        const isEven = postWorkoutTrend?.percent === 0;

        const trendText = `post_workout_${isEven ? "even" : postWorkoutTrend?.isPositive ? "more" : "less"}_performance`;

        const icon = isEven ? "arrow-right" : postWorkoutTrend?.isPositive ? "arrow-up" : "arrow-down";
        const iconColor = isEven ? successColor : postWorkoutTrend?.isPositive ? successColor : errorColor;

        if (!postWorkoutTrend) {
            return undefined;
        }

        return {
            value: trunicateToNthSignificantDigit(postWorkoutTrend?.percent ?? 0, false, 0),
            unit: "%",
            text: t(trendText),
            icon,
            iconColor,
        } as const;
    }, [errorColor, postWorkoutTrend, successColor, t]);

    const showWeightMoved = postWorkout?.doneWorkouts?.[postWorkout?.doneWorkouts?.length - 1]?.doneExercises?.some((doneExercise) => doneExercise.type === "WEIGHT_BASED");
    const showTimeInExercise = postWorkout?.doneWorkouts?.[postWorkout?.doneWorkouts?.length - 1]?.doneExercises?.some((doneExercise) => doneExercise.type === "TIME_BASED");

    const calculatedTimeInExercise = useMemo(() => {
        return postWorkout?.doneWorkouts?.[postWorkout?.doneWorkouts?.length - 1]?.doneExercises?.reduce(
            (totalTimeInExercise, doneExercise) => {
                if (doneExercise.type === "TIME_BASED") {
                    return (
                        (totalTimeInExercise ?? 0) +
                        doneExercise.sets.reduce((timeInExercise, set) => timeInExercise + (parseFloat(set?.durationMinutes ?? "0") * 60 * 1000 + parseFloat(set?.durationSeconds ?? "0") * 1000), 0)
                    );
                }
                return totalTimeInExercise;
            },
            0 as number | undefined,
        );
    }, [postWorkout?.doneWorkouts]);

    const timeInExerciseValueUnit = useMemo(() => {
        return getDurationInSecondsMinutesOrHours((calculatedTimeInExercise ?? 0).toString());
    }, [calculatedTimeInExercise]);

    const timeInExerciseStat = useMemo(
        (): Stat =>
            ({
                value: timeInExerciseValueUnit.value.toString(),
                unit: timeInExerciseValueUnit.unit,
                text: t("post_workout_time_in_exercise"),
                icon: "timer-outline",
                iconColor: mainColor,
            }) as const,
        [mainColor, t, timeInExerciseValueUnit.unit, timeInExerciseValueUnit.value],
    );

    const overallWeightMoved = useMemo(() => {
        const weightMoved = postWorkout?.doneWorkouts[postWorkout?.doneWorkouts.length - 1].doneExercises?.reduce((sum, doneExercise) => {
            if (doneExercise.type !== "WEIGHT_BASED") {
                return sum;
            }
            return (
                sum +
                doneExercise.sets.reduce((sum, set) => {
                    return sum + parseFloat(set?.weight ?? "0") * parseFloat(set?.reps ?? "0");
                }, 0)
            );
        }, 0);

        if (weightMoved === undefined) {
            return {} as PostWorkoutScreen["stats"][number];
        }

        const { unit, weight } = getConvertedWeight(weightMoved);

        return {
            value: weight,
            unit: unit,
            text: t("post_workout_weight"),
            icon: "weight",
            iconColor: "white",
        } as const;
    }, [getConvertedWeight, postWorkout?.doneWorkouts, t]);

    const durationStat = useMemo(() => {
        const duration = getDurationInSecondsMinutesOrHours(postWorkout?.doneWorkouts?.[postWorkout?.doneWorkouts?.length - 1].duration ?? "0");

        return {
            value: duration.value.toString(),
            icon: "timer-outline",
            iconColor: mainColor,
            text: t("post_workout_duration"),
            unit: duration?.unit ?? "s",
        } as const;
    }, [mainColor, postWorkout?.doneWorkouts, t]);

    const weightMoved = useMemo(() => {
        return showWeightMoved ? overallWeightMoved : undefined;
    }, [overallWeightMoved, showWeightMoved]);

    const timeInExercise = useMemo(() => {
        return showTimeInExercise ? timeInExerciseStat : undefined;
    }, [showTimeInExercise, timeInExerciseStat]);

    return useMemo(() => {
        return [trendStat, weightMoved, timeInExercise, durationStat].filter((stat) => stat !== undefined) as Stat[];
    }, [trendStat, weightMoved, timeInExercise, durationStat]);
};

export const WorkoutCompleteModal = () => {
    const { ref, openBottomSheet } = useBottomSheetRef();
    const isVisible = useDebouncedShowPostWorkoutScreen();
    const postWorkout = useAppSelector(getPostWorkoutWorkout);

    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const headerStats = useHeaderStats();

    const handleHideShowModal = useCallback(() => {
        dispatch(setShowPostWorkoutScreen(undefined));
    }, [dispatch]);

    useEffect(() => {
        if (isVisible) {
            openBottomSheet();
        }
    }, [isVisible]);

    const title = useMemo(() => `${postWorkout?.name ?? t("workout")} ${t("post_workout_title_completed")}!`, [postWorkout?.name, t]);

    const numberColumns = useMemo(() => {
        if (headerStats.length % 2 === 0) {
            return 2;
        }
        return 3;
    }, [headerStats.length]);

    return (
        <ThemedBottomSheetModal onRequestClose={handleHideShowModal} title={title} ref={ref}>
            <PageContent ghost paddingTop={20}>
                <ThemedView round ghost style={{ marginBottom: 10 }}>
                    <Text style={{ marginBottom: 10 }} ghost>
                        {t("post_workout_overview_title")}
                    </Text>
                    <FlatList
                        scrollEnabled={false}
                        numColumns={numberColumns}
                        keyExtractor={(item, index) => `${index} ${item?.text}`}
                        columnWrapperStyle={{ gap: 5 }}
                        contentContainerStyle={{ gap: 5 }}
                        data={headerStats}
                        renderItem={({ item: stat }) => <Fragment key={`${postWorkout?.workoutId} ${stat?.value} ${stat?.text}\`} `}>{stat ? <WorkoutCompleteStatTile {...stat} /> : <></>}</Fragment>}
                    />
                </ThemedView>
            </PageContent>
        </ThemedBottomSheetModal>
    );
};
