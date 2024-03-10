import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "../../index";
import { getLanguage } from "../settings/settingsSelectors";
import { getLocaleDate, getMonthYearLabel } from "../../../utils/date";
import { IsoDate } from "../../../types/date";
import { ExerciseId, ExerciseSets, ExerciseType, SortedData, WorkoutId } from "../../reducers/workout/types";
import { Temporal } from "@js-temporal/polyfill";
import { getSinceDate } from "../../../utils/timeAgo";
import { sortWorkouts } from "../../reducers/workout/sortWorkouts";
import { getMeasurementSorting } from "../measurements/measurementSelectors";
import i18next from "i18next";
import { getDurationInSecondsMinutesOrHours } from "../../../utils/timeDisplay";
import { Trend } from "../../../components/WorkoutCard/components/ProgressDisplay/ProgressDisplay";

export const getWorkoutState = ({ workoutState }: AppState) => workoutState;
export const getTrainedWorkout = createSelector([getWorkoutState], (state) => state.trainedWorkout);
export const getTrainedWorkoutId = createSelector([getTrainedWorkout], (trainedWorkout) => trainedWorkout?.workoutId);
export const getWorkoutSorting = createSelector([getWorkoutState], (state) => state.workoutSorting);
export const getWorkouts = createSelector([getWorkoutState], (state) => state.workouts);
export const getSearchedWorkout = createSelector([getWorkoutState], (state) => state.searchedWorkout);
export const getPostWorkoutWorkoutId = createSelector([getWorkoutState], (state) => state.postWorkoutWorkoutId);

export const getTrainedWorkoutExercises = createSelector([getTrainedWorkout, getWorkouts], (trainedWorkout, workouts) => {
    if (trainedWorkout === undefined) {
        return [];
    }
    return workouts.find((workout) => workout.workoutId === trainedWorkout.workoutId)?.exercises;
});

export const getSortingType = createSelector([(state: AppState) => state, (state, type: "Workout" | "Measurement") => type], (state, type) => {
    if (type === "Measurement") {
        return getMeasurementSorting(state);
    }

    if (type === "Workout") {
        return getWorkoutSorting(state);
    }
});

export const getExerciseById = createSelector([getTrainedWorkout, (_, exerciseId: ExerciseId) => exerciseId, getWorkouts], (trainedWorkout, exerciseId, workouts) => {
    const workout = workouts.find((workout) => workout.workoutId === trainedWorkout?.workoutId);
    return workout?.exercises?.find((exercise) => exercise.exerciseId === exerciseId);
});

export const getHasWeightInTimeBasedExercise = createSelector([getWorkouts, getTrainedWorkout, (_, exerciseId: ExerciseId) => exerciseId], (workouts, trainedWorkout, exerciseId) => {
    const workout = workouts.find((workout) => workout.workoutId === trainedWorkout?.workoutId);
    const trainedExercise = workout?.exercises.find((exercise) => exercise.exerciseId === exerciseId);
    const exercise = workout?.exercises.find((exercise) => exercise.exerciseId === trainedExercise?.exerciseId);

    return exercise?.type === "TIME_BASED" && exercise?.weight !== undefined && exercise?.weight !== "" && exercise?.weight !== "0";
});

export const getEditedWorkout = createSelector([getWorkoutState], (state) => state.editedWorkout);
export const getIsEditedWorkout = createSelector([getEditedWorkout], (editedWorkout) => !editedWorkout?.isNew);
export const getEditedExercise = createSelector([getWorkoutState], (state) => state.editedExercise);
export const getIsUsedInPausedWorkout = createSelector([getWorkouts, getEditedExercise, getTrainedWorkout], (workouts, editedExercise, trainedWorkout) => {
    const workoutExerciseIsUsed = workouts
        .find((workout) => workout.workoutId === trainedWorkout?.workoutId)
        ?.exercises.find((exercise) => exercise.exerciseId === editedExercise?.exercise.exerciseId);
    return Boolean(workoutExerciseIsUsed);
});

export const getSortedDoneWorkout = createSelector([getWorkouts, (_, workoutId?: WorkoutId) => workoutId], (workouts, workoutId) => {
    return workouts
        .find((workout) => workout.workoutId === workoutId)
        ?.doneWorkouts.map(({ isoDate }) => isoDate)
        .sort(Temporal.PlainDate.compare);
});

export const getLatestWorkoutDate = createSelector([getSortedDoneWorkout], (isoDates) => {
    return isoDates?.[isoDates?.length - 1] ?? ("1970-01-01" as IsoDate);
});
export const getLatestWorkoutDateDisplay = createSelector([getSortedDoneWorkout, getLanguage], (dates, language) => {
    return getSinceDate(dates?.[dates?.length - 1], language ?? "de") ?? ("1970-01-01" as IsoDate);
});

export const getWorkoutByIndex = createSelector([getWorkouts, (_, workoutId?: WorkoutId) => workoutId], (workouts, workoutId) => {
    return workouts.find((workout) => workout.workoutId === workoutId);
});
export const getSortedWorkouts = createSelector([getWorkouts, getWorkoutSorting], (workouts, sorting) => {
    return sortWorkouts(workouts, sorting);
});
export const getEditedWorkoutName = createSelector([getEditedWorkout], (editedWorkout) => editedWorkout?.workout?.name);
export const getExercisesFromIndex = createSelector([getTrainedWorkout, getWorkouts, (_, exerciseId: ExerciseId) => exerciseId], (trainedWorkout, workouts, exerciseId) => {
    if (trainedWorkout) {
        return workouts.find((workout) => workout.workoutId === trainedWorkout.workoutId)?.exercises.find((exercise) => exercise.exerciseId === exerciseId);
    }
});
export const getSetsArray = createSelector([getExercisesFromIndex], (exercise) => {
    const sets = parseFloat(exercise?.sets ?? "-1");
    if (isNaN(sets)) {
        return [];
    }
    return Array.from({ length: sets }, (_, i) => i);
});

export const getDoneWorkoutData = createSelector([getEditedWorkout], (editedWorkout) => {
    const workout = editedWorkout?.workout;

    if (workout?.doneWorkouts === undefined || workout?.doneWorkouts.length === 0) {
        return undefined;
    }

    const sortedData: Map<ExerciseId, SortedData> = new Map();
    const slicedDoneWorkouts = workout?.doneWorkouts;

    slicedDoneWorkouts?.forEach(({ isoDate, doneExercises }) => {
        if (doneExercises) {
            doneExercises.forEach(({ sets, originalExerciseId, type }) => {
                const originalName = workout?.exercises.find((exercise) => exercise.exerciseId === originalExerciseId)?.name;
                const foundEntry = sortedData.get(originalExerciseId);
                if (foundEntry) {
                    foundEntry.data.push({ sets, date: isoDate });
                } else {
                    sortedData.set(originalExerciseId, {
                        exerciseName: originalName ?? "",
                        type: type,
                        data: [{ sets, date: isoDate }],
                    });
                }
            });
        }
    });

    return Array.from(sortedData.values()).filter(({ data }) => data.length > 1);
});

export const getWorkoutsByMonth = createSelector([getEditedWorkout, (_, searchedMonth?: string) => searchedMonth], (editedWorkout, searchedMonth) => {
    const workout = editedWorkout?.workout;

    if (!workout) {
        return undefined;
    }

    if (searchedMonth === undefined || searchedMonth === "ALL_WORKOUTS") {
        return workout.doneWorkouts;
    }

    return workout?.doneWorkouts?.filter(({ isoDate }) => getMonthYearLabel(isoDate) === searchedMonth);
});
export const getHasHistory = createSelector([getWorkouts, (_, workoutId: WorkoutId) => workoutId], (workouts, workoutId) => {
    const doneWorkouts = workouts?.find((workout) => workout?.workoutId === workoutId)?.doneWorkouts;
    if (doneWorkouts === undefined) {
        return false;
    }
    return doneWorkouts.length > 0;
});
export const getNumberWorkoutHistoryEntries = createSelector([getWorkouts, (_, workoutId: WorkoutId) => workoutId], (workouts, workoutId) => {
    const workout = workouts.find((workout) => workout.workoutId === workoutId);
    return workout?.doneWorkouts?.length;
});
export const getPreviousWorkout = createSelector([getTrainedWorkoutId, getLanguage, (_, __, exerciseId: ExerciseId) => exerciseId, getWorkouts], (trainedWorkoutId, language, exerciseId, workouts) => {
    const doneWorkouts = workouts.find((workout) => workout.workoutId === trainedWorkoutId)?.doneWorkouts;
    if (!doneWorkouts || doneWorkouts?.length === 0) {
        return undefined;
    }

    const foundEntries = new Map<ExerciseId, { date: string; sets: ExerciseSets; note?: string; type: ExerciseType; name: string }>();
    for (let workoutIndex = doneWorkouts?.length - 1; workoutIndex >= 0; workoutIndex--) {
        doneWorkouts?.[workoutIndex]?.doneExercises?.forEach((exercise) => {
            if (!foundEntries.get(exercise.originalExerciseId)) {
                foundEntries.set(exercise.originalExerciseId, {
                    type: exercise.type,
                    date:
                        getLocaleDate(doneWorkouts?.[workoutIndex].isoDate, language, {
                            dateStyle: "medium",
                        }) ?? "",
                    sets: exercise.sets,
                    note: exercise.note,
                    name: exercise.name,
                });
            }
        });
    }
    return foundEntries.get(exerciseId);
});

const getSumOfSets = (type: ExerciseType, sets?: ExerciseSets) => {
    if (type === "TIME_BASED") {
        return sets?.reduce((sum, set) => sum + parseFloat(set?.durationMinutes ?? "0") * 60 * 1000 + parseFloat(set?.durationSeconds ?? "0") * 1000, 0);
    }
    return sets?.reduce((sum, set) => sum + parseFloat(set?.reps ?? "0") * parseFloat(set?.weight ?? "0"), 0);
};
export const getOverallTrainingTrend = createSelector([getWorkouts, (_, workoutId?: WorkoutId) => workoutId], (workouts, workoutId) => {
    const workout = workouts.find((workout) => workout.workoutId === workoutId);

    if (!workout?.doneWorkouts || workout?.doneWorkouts?.length < 2 || workout?.doneWorkouts.some(({ doneExercises }) => !doneExercises)) {
        return undefined;
    }

    const foundCompareables: {
        current: { name?: string; sum: number };
        before: { name?: string; sum: number };
    }[] = [];

    const latestWorkout = workout?.doneWorkouts[workout?.doneWorkouts.length - 1];

    if (latestWorkout) {
        latestWorkout.doneExercises?.forEach(({ originalExerciseId, sets, type }) => {
            const fittingExercisesBefore = workout.doneWorkouts
                .map(({ doneWorkoutId: searchedWorkoutId, doneExercises }) => {
                    if (latestWorkout.doneWorkoutId === searchedWorkoutId) {
                        return undefined;
                    }
                    return doneExercises?.findLast((exercise) => exercise.originalExerciseId === originalExerciseId);
                })
                .filter((exercise) => exercise !== undefined);

            const fittingExerciseBefore = fittingExercisesBefore?.[fittingExercisesBefore.length - 1];
            const originalExercise = workout.exercises.find((exercise) => exercise.exerciseId === originalExerciseId);

            if (fittingExerciseBefore) {
                const compareable = {
                    current: { name: originalExercise?.name, sum: getSumOfSets(type, sets) ?? 0 },
                    before: {
                        name: fittingExerciseBefore.name,
                        sum: getSumOfSets(type, fittingExerciseBefore.sets) ?? 0,
                    },
                };
                if (foundCompareables.find((compareable) => compareable.current.name === originalExercise?.name)) {
                    return;
                }
                foundCompareables.push(compareable);
            }
        });
    }

    return foundCompareables.reduce(
        (bestImprovement, { current, before }) => {
            if (before.sum !== 0) {
                const percentRaw = (current.sum / before.sum) * 100;
                const isPositive = percentRaw > 100;
                const percent = isPositive ? percentRaw - 100 : 100 - percentRaw;
                if (bestImprovement === undefined) {
                    return { name: current.name, percent, isPositive };
                } else {
                    if (percent > bestImprovement.percent) {
                        return { name: current.name, percent, isPositive };
                    } else {
                        return bestImprovement;
                    }
                }
            }
        },
        undefined as Trend | undefined,
    );
});

export const getExerciseDone = createSelector([getTrainedWorkout, getWorkouts], (trainedWorkout, workouts) => {
    const exerciseIndex = trainedWorkout?.activeExerciseIndex;
    const workout = workouts.find((workout) => workout.workoutId === trainedWorkout?.workoutId);
    if (exerciseIndex === undefined || !trainedWorkout || trainedWorkout?.exerciseData.length === 0) {
        return false;
    }
    const sets = parseFloat(workout?.exercises[exerciseIndex].sets ?? "-1");
    return trainedWorkout.exerciseData[exerciseIndex].sets.length === sets && trainedWorkout.exerciseData[exerciseIndex].sets.every(({ confirmed }) => Boolean(confirmed));
});

export const getCanSnap = createSelector([getTrainedWorkout], (trainedWorkout) => {
    const exerciseIndex = trainedWorkout?.activeExerciseIndex;
    if (exerciseIndex === undefined || !trainedWorkout || trainedWorkout?.exerciseData.length === 0) {
        return false;
    }
    return trainedWorkout.exerciseData[exerciseIndex].canSnap;
});

export const getPauseTime = createSelector([getTrainedWorkout, getWorkouts], (trainedWorkout, workouts) => {
    const exercise = workouts.find((workout) => workout.workoutId === trainedWorkout?.workoutId)?.exercises[trainedWorkout?.activeExerciseIndex ?? -1];
    if (
        (exercise?.pauseMinutes !== undefined && exercise.pauseMinutes !== "" && exercise.pauseMinutes !== "0" && exercise.pauseMinutes !== "00") ||
        (exercise?.pauseSeconds !== undefined && exercise.pauseSeconds !== "" && exercise.pauseSeconds !== "0" && exercise.pauseSeconds !== "00")
    ) {
        return (parseFloat(exercise.pauseMinutes || "0") * 60 + parseFloat(exercise.pauseSeconds || "0")) * 1000;
    }

    return -404;
});

export const getIsDoneWithTraining = createSelector([getTrainedWorkout, getWorkouts], (trainedWorkout, workouts) => {
    const workout = workouts.find((workout) => workout.workoutId === trainedWorkout?.workoutId);
    if (!workout || trainedWorkout?.exerciseData.length === 0 || trainedWorkout?.exerciseData.some((data) => data.sets.length === 0)) {
        return false;
    }
    return trainedWorkout?.exerciseData.every(
        (doneExercise, exerciseIndex) =>
            doneExercise.sets.every(({ confirmed }) => {
                return Boolean(confirmed);
            }) && doneExercise.sets.length === parseFloat(workout.exercises[exerciseIndex].sets),
    );
});

export const getHasNoTrainingDataSaved = createSelector([getTrainedWorkout], (trainedWorkout) => {
    return trainedWorkout?.exerciseData.some((data) => data.sets.some((set) => set.confirmed));
});
export const getNote = createSelector([getTrainedWorkout], (trainedWorkout) => trainedWorkout?.exerciseData?.[trainedWorkout?.activeExerciseIndex]?.note);
export const getExerciseMetadataFromWorkoutById = createSelector([getTrainedWorkout, (_, exerciseId?: ExerciseId) => exerciseId, getWorkouts], (trainedWorkout, exerciseId, workouts) => {
    if (exerciseId === undefined) {
        return undefined;
    }
    const workout = workouts.find((workout) => workout.workoutId === trainedWorkout?.workoutId);
    return workout?.exercises.find((exercise) => exercise.exerciseId === exerciseId);
});
export const getActiveSetIndex = createSelector([getTrainedWorkout, (_, exerciseId: ExerciseId) => exerciseId], (trainedWorkout, exerciseId) => {
    return trainedWorkout?.exerciseData.find((exercise) => exercise.exerciseId === exerciseId)?.activeSetIndex;
});

export const getIsActiveSet = createSelector([(state: AppState) => state, (_, exerciseId: ExerciseId) => exerciseId, (_, __, setIndex: number) => setIndex], (state, exerciseId, setIndex) => {
    return setIndex === getActiveSetIndex(state, exerciseId);
});
export const getSetData = createSelector(
    [getTrainedWorkout, (_, setIndex: number) => setIndex, (_, __, exerciseId: ExerciseId) => exerciseId, getWorkouts],
    (trainedWorkout, setIndex, exerciseId, workouts) => {
        const workout = workouts.find((workout) => workout.workoutId === trainedWorkout?.workoutId);

        const exerciseData = workout?.exercises.map((exerciseData, index) => {
            const currentExerciseData = trainedWorkout?.exerciseData[index];
            const hasData = (currentExerciseData?.sets.length ?? 0) > 0;
            const isConfirmed = Boolean(currentExerciseData?.sets[setIndex]?.confirmed);
            const isLatestSet = setIndex === currentExerciseData?.latestSetIndex;

            return {
                weight: currentExerciseData?.sets[setIndex]?.weight,
                reps: currentExerciseData?.sets[setIndex]?.reps,
                durationMinutes: currentExerciseData?.sets[setIndex]?.durationMinutes,
                durationSeconds: currentExerciseData?.sets[setIndex]?.durationSeconds,
                isEditable: setIndex === currentExerciseData?.activeSetIndex,
                isConfirmed,
                hasData,
                isLatestSet,
                exerciseId: exerciseData?.exerciseId,
            };
        });

        const index = exerciseData?.findIndex((data) => data?.exerciseId === exerciseId);
        return exerciseData?.[index ?? -1];
    },
);

export const getIsOngoingWorkout = createSelector([getTrainedWorkout, (_, workoutId?: WorkoutId) => workoutId], (trainedWorkout, workoutId) => {
    return trainedWorkout && trainedWorkout?.workoutId === workoutId;
});

export const getDoneWorkoutById = createSelector([getEditedWorkout, (_, doneWorkoutIndex: WorkoutId) => doneWorkoutIndex], (editedWorkout, doneWorkoutIndex) => {
    return editedWorkout?.workout?.doneWorkouts.find((doneWorkout) => doneWorkout.doneWorkoutId === doneWorkoutIndex);
});

export const getDoneExercises = createSelector([getEditedWorkout, (_, doneWorkoutIndex: WorkoutId) => doneWorkoutIndex], (editedWorkout, doneWorkoutIndex) => {
    const doneWorkout = editedWorkout?.workout?.doneWorkouts.find((doneWorkout) => doneWorkout.doneWorkoutId === doneWorkoutIndex);
    return doneWorkout?.doneExercises ?? [];
});

export const getDoneExerciseById = createSelector(
    [getEditedWorkout, (_, doneWorkoutId: WorkoutId) => doneWorkoutId, (_, __, doneExerciseId) => doneExerciseId],
    (editedWorkout, doneWorkoutId, doneExerciseId) => {
        const doneWorkout = editedWorkout?.workout?.doneWorkouts.find((doneWorkout) => doneWorkout.doneWorkoutId === doneWorkoutId);
        return doneWorkout?.doneExercises?.find((doneExercise) => doneExercise.doneExerciseId === doneExerciseId);
    },
);

export const getPostWorkoutWorkout = createSelector([getWorkouts, getPostWorkoutWorkoutId], (workouts, postWorkout) => {
    const doneWorkout = workouts.find((workout) => workout.workoutId === postWorkout);

    if (!doneWorkout || postWorkout === undefined) {
        return undefined;
    }
    return doneWorkout;
});

export const getPostWorkoutTrend = createSelector([(state: AppState) => state, getPostWorkoutWorkout], (state, postWorkout) => {
    return getOverallTrainingTrend(state, postWorkout?.workoutId);
});

export const getWorkoutStats = createSelector([getWorkouts], (workouts) => {
    return workouts.reduce(
        (stats, currentWorkout) => {
            if (stats.get(currentWorkout.workoutId) === undefined) {
                stats.set(currentWorkout.workoutId, {
                    totalTimes: {
                        value: 0,
                        unit: "x",
                        text: i18next.t("post_workout_times"),
                    },
                    totalSets: {
                        value: 0,
                        unit: undefined,
                        text: i18next.t("post_workout_sets"),
                    },
                    totalReps: {
                        value: 0,
                        unit: undefined,
                        text: i18next.t("post_workout_reps"),
                    },
                    totalDuration: {
                        value: 0,
                        unit: "h",
                        text: i18next.t("post_workout_total_duration"),
                    },
                });
            }
            stats.get(currentWorkout.workoutId)!.totalTimes.value = currentWorkout.doneWorkouts.length;

            const values = currentWorkout.doneWorkouts.reduce(
                (doneWorkoutStats, doneWorkout) => {
                    doneWorkoutStats.totalDuration += parseFloat(doneWorkout.duration);
                    doneWorkout.doneExercises?.forEach((exercise) => {
                        doneWorkoutStats.totalSets += exercise.sets.length;
                        doneWorkoutStats.totalReps += exercise.sets.reduce((sum, set) => {
                            return sum + parseFloat(set.reps ?? "0");
                        }, 0);
                    });

                    return doneWorkoutStats;
                },
                { totalDuration: 0, totalSets: 0, totalReps: 0 } as { totalDuration: number; totalSets: number; totalReps: number; durationUnit?: string },
            );

            const { value, unit } = getDurationInSecondsMinutesOrHours(values.totalDuration.toString());
            stats.get(currentWorkout.workoutId)!.totalDuration = {
                value,
                unit,
                text: i18next.t("post_workout_total_duration"),
            };
            stats.get(currentWorkout.workoutId)!.totalSets.value = values.totalSets;
            stats.get(currentWorkout.workoutId)!.totalReps.value = values.totalReps;

            return stats;
        },
        new Map() as Map<
            WorkoutId,
            {
                totalDuration: {
                    value: number;
                    unit: string;
                    text: string;
                };
                totalTimes: {
                    value: number;
                    unit: string;
                    text: string;
                };
                totalSets: {
                    value: number;
                    unit: undefined;
                    text: string;
                };
                totalReps: {
                    value: number;
                    unit: undefined;
                    text: string;
                };
            }
        >,
    );
});
export const getWorkoutStatsById = createSelector([getWorkoutStats, (_, workoutId?: WorkoutId) => workoutId], (stats, workoutId) => {
    if (!workoutId) {
        return undefined;
    }

    return stats.get(workoutId);
});
