import { ThemedView } from "../Themed/ThemedView/View";
import { Text } from "../Themed/ThemedText/Text";
import { HStack } from "../Stack/HStack/HStack";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";
import { PageContent } from "../PageContent/PageContent";
import { WorkoutCompleteStatTile } from "./WorkoutCompleteStatTile";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import { getPostWorkoutTrend, getPostWorkoutWorkout, getWorkoutStatsById } from "../../store/selectors/workout/workoutSelectors";
import { setShowPostWorkoutScreen } from "../../store/reducers/workout";
import { navigationRef } from "../../hooks/navigate";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/context";
import { PostWorkoutScreen } from "../../store/reducers/workout/types";
import { getUnitSystem } from "../../store/selectors/settings/settingsSelectors";
import { trunicateToNthSignificantDigit } from "../../utils/number";
import { getDurationInSecondsMinutesOrHours } from "../../utils/timeDisplay";

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

const useHeaderStats = () => {
    const postWorkoutTrend = useAppSelector((state: AppState) => getPostWorkoutTrend(state));
    const { t } = useTranslation();
    const { mainColor, successColor, errorColor } = useTheme();
    const postWorkout = useAppSelector(getPostWorkoutWorkout);
    const unitSystem = useAppSelector(getUnitSystem);

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

    const overallWeightMoved = useMemo(() => {
        const weightMoved = postWorkout?.doneWorkouts[postWorkout?.doneWorkouts.length - 1].doneExercises?.reduce((sum, doneExercise) => {
            if (doneExercise.type === "TIME_BASED") {
                return (
                    sum +
                    doneExercise.sets.reduce((sum, set) => {
                        return sum + parseFloat(set?.durationMinutes ?? "0") * 60 * 1000 + parseFloat(set?.durationSeconds ?? "0") * 1000;
                    }, 0)
                );
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

        const isATon = unitSystem === "metric" ? weightMoved > 1000 : weightMoved > 2000;

        const getConvertedUnit = () => {
            if (unitSystem === "metric") {
                if (isATon) {
                    return "t";
                }
                return "kg";
            }

            if (isATon) {
                return "tons";
            }
            return "lbs";
        };

        const getConvertedKg = () => {
            if (isATon) {
                return (weightMoved / 1000).toFixed(2);
            }
            return weightMoved.toString();
        };

        const getConvertedLbs = () => {
            if (isATon) {
                return (weightMoved / 2000).toFixed(2);
            }
            return weightMoved.toString();
        };

        return {
            value: unitSystem === "metric" ? getConvertedKg() : getConvertedLbs(),
            unit: getConvertedUnit(),
            text: t("post_workout_weight"),
            icon: "weight",
            iconColor: "white",
        } as const;
    }, [postWorkout?.doneWorkouts, t, unitSystem]);

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

    return useMemo(() => {
        return [trendStat, overallWeightMoved, durationStat] as const;
    }, [trendStat, overallWeightMoved, durationStat]);
};

export const WorkoutCompleteModal = () => {
    const { ref, openBottomSheet } = useBottomSheetRef();
    const isVisible = useDebouncedShowPostWorkoutScreen();
    const postWorkout = useAppSelector(getPostWorkoutWorkout);
    const workoutStats = useAppSelector((state: AppState) => getWorkoutStatsById(state, postWorkout?.workoutId));

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

    return (
        <ThemedBottomSheetModal onRequestClose={handleHideShowModal} title={title} ref={ref}>
            <PageContent ghost paddingTop={20}>
                <ThemedView padding round background style={{ marginBottom: 10 }}>
                    <Text style={{ marginBottom: 10 }} ghost>
                        {t("post_workout_overview_title")}
                    </Text>
                    <HStack ghost gap>
                        {headerStats?.map((stat) => {
                            return stat && <Fragment key={`${postWorkout?.workoutId} ${stat.value} ${stat.text}\`} `}>{<WorkoutCompleteStatTile {...stat} />}</Fragment>;
                        })}
                    </HStack>
                </ThemedView>
                {Object.values(workoutStats ?? {})?.map((stat) => {
                    return (
                        <ThemedView key={`${postWorkout?.workoutId} ${stat.value} ${stat.text}`} padding round background>
                            <HStack center ghost style={{ justifyContent: "space-evenly" }}>
                                <Text ghost style={{ fontSize: 30, flex: 0.5 }}>
                                    {stat.value} {stat?.unit}
                                </Text>
                                <Text stretch ghost>
                                    {stat.text}
                                </Text>
                            </HStack>
                        </ThemedView>
                    );
                })}
            </PageContent>
        </ThemedBottomSheetModal>
    );
};
