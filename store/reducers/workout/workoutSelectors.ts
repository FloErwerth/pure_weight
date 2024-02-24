import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "../../index";
import { getLanguage } from "../settings/settingsSelectors";
import { getDateTodayIso, getLocaleDate, getMonth } from "../../../utils/date";
import { IsoDate } from "../../../types/date";
import { getLastNEntries } from "../../../utils/getLastNEntries";
import { ExerciseId, ExerciseSets, ExerciseType, WorkoutId } from "./types";
import { Temporal } from "@js-temporal/polyfill";
import { getSinceDate } from "../../../utils/timeAgo";
import { sortWorkouts } from "./sortWorkouts";
import { getMeasurementSorting } from "../measurements/measurementSelectors";

export const getWorkoutState = ({ workoutState }: AppState) => workoutState;
export const getTrainedWorkout = createSelector([getWorkoutState], (state) => state.trainedWorkout);
export const getWorkoutSorting = createSelector([getWorkoutState], (state) => state.workoutSorting);
export const getWorkouts = createSelector([getWorkoutState], (state) => state.workouts);
export const getSearchedWorkout = createSelector([getWorkoutState], (state) => state.searchedWorkout);
export const getTrainedWorkoutExercises = createSelector([getTrainedWorkout, getWorkouts], (trainedWorkout, workouts) => {
    if (trainedWorkout === undefined) {
        return [];
    }
    return workouts.find((workout) => workout.workoutId === trainedWorkout.workout.workoutId)?.exercises;
});

export const getSortingType = createSelector(
    [(state: AppState) => state, (state, type: "Workout" | "Measurement") => type],
    (state, type) => {
        if (type === "Measurement") {
            return getMeasurementSorting(state);
        }

        if (type === "Workout") {
            return getWorkoutSorting(state);
        }
    },
);

export const getExerciseById = createSelector([getTrainedWorkout, (_, exerciseId: ExerciseId) => exerciseId], (workout, exerciseId) => {
    return workout?.workout.exercises?.find((exercise) => exercise.exerciseId === exerciseId);
});
export const getEditedWorkout = createSelector([getWorkoutState], (state) => state.editedWorkout);
export const getIsEditedWorkout = createSelector([getEditedWorkout], (editedWorkout) => !editedWorkout?.isNew);
export const getEditedExercise = createSelector([getWorkoutState], (state) => state.editedExercise);

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
export const getFirstWorkoutDate = createSelector([getSortedDoneWorkout], (dates) => {
    return dates?.[0] ?? ("1970-01-01" as IsoDate);
});
export const getWorkoutByIndex = createSelector([getWorkouts, (_, workoutId: WorkoutId) => workoutId], (workouts, workoutId) => {
    return workouts.find((workout) => workout.workoutId === workoutId);
});
export const getSortedWorkouts = createSelector([getWorkouts, getWorkoutSorting], (workouts, sorting) => {
    return sortWorkouts(workouts, sorting);
});
export const getEditedWorkoutName = createSelector([getEditedWorkout], (editedWorkout) => editedWorkout?.workout?.name);
export const getExercisesFromIndex = createSelector(
    [getTrainedWorkout, getWorkouts, (_, exerciseId: ExerciseId) => exerciseId],
    (trainedWorkout, workouts, exerciseId) => {
        if (trainedWorkout) {
            return workouts
                .find((workout) => workout.workoutId === trainedWorkout.workout.workoutId)
                ?.exercises.find((exercise) => exercise.exerciseId === exerciseId);
        }
    },
);
export const getSetsArray = createSelector([getExercisesFromIndex], (exercise) => {
    const sets = parseFloat(exercise?.sets ?? "-1");
    if (isNaN(sets)) {
        return [];
    }
    return Array.from({ length: sets }, (_, i) => i);
});

type SortedData = {
    exerciseName: string;
    data: { sets: ExerciseSets; date: IsoDate; type: ExerciseType }[];
};

export const getTrainingDayData = createSelector([getEditedWorkout], (editedWorkout) => {
    const workout = editedWorkout?.workout;

    if (workout?.doneWorkouts === undefined || workout?.doneWorkouts.length === 0) {
        return undefined;
    }

    const sortedData: Map<ExerciseId, SortedData> = new Map();
    const slicedDoneWorkouts = getLastNEntries(workout?.doneWorkouts, 100);

    slicedDoneWorkouts?.forEach(({ isoDate, doneExercises }) => {
        if (doneExercises) {
            doneExercises.forEach(({ name, sets, originalExerciseId, type }) => {
                const foundEntry = sortedData.get(originalExerciseId);
                if (foundEntry) {
                    foundEntry.data.push({ sets, date: isoDate, type });
                } else {
                    sortedData.set(originalExerciseId, {
                        exerciseName: name,
                        data: [{ type, sets, date: isoDate }],
                    });
                }
            });
        }
    });

    return Array.from(sortedData.values()).filter(({ data }) => data.length > 1);
});

export const getWorkoutsByMonth = createSelector(
    [getEditedWorkout, (_, selectedDate?: string) => selectedDate ?? getDateTodayIso()],
    (editedWorkout, searchedDate) => {
        const workout = editedWorkout?.workout;

        return workout?.doneWorkouts?.filter(
            ({ isoDate }) => getMonth(isoDate) === getMonth((searchedDate as IsoDate) ?? getDateTodayIso()),
        );
    },
);
export const getHasHistory = createSelector([getWorkouts, (_, workoutId: WorkoutId) => workoutId], (workouts, workoutId) => {
    const doneWorkouts = workouts?.find((workout) => workout?.workoutId === workoutId)?.doneWorkouts;
    if (doneWorkouts === undefined) {
        return false;
    }
    return doneWorkouts.length > 0;
});
export const getNumberWorkoutHistoryEntries = createSelector(
    [getWorkouts, (_, workoutId: WorkoutId) => workoutId],
    (workouts, workoutId) => {
        const workout = workouts.find((workout) => workout.workoutId === workoutId);
        return workout?.doneWorkouts?.length;
    },
);
export const getPreviousWorkout = createSelector(
    [getTrainedWorkout, getLanguage, (_, __, exerciseId: ExerciseId) => exerciseId],
    (trainedWorkout, language, exerciseId) => {
        const doneWorkouts = trainedWorkout?.workout?.doneWorkouts;
        if (!doneWorkouts || doneWorkouts?.length === 0) {
            return undefined;
        }

        const foundEntries = new Map<ExerciseId, { date: string; sets: ExerciseSets; note?: string; type: ExerciseType; name: string }>();
        for (let workoutIndex = doneWorkouts?.length - 1; workoutIndex >= 0; workoutIndex--) {
            doneWorkouts?.[workoutIndex].doneExercises?.forEach((exercise) => {
                if (!foundEntries.get(exercise.originalExerciseId)) {
                    foundEntries.set(exercise.originalExerciseId, {
                        type: exercise.type,
                        date: getLocaleDate(doneWorkouts?.[workoutIndex].isoDate, language, {
                            dateStyle: "medium",
                        }),
                        sets: exercise.sets,
                        note: exercise.note,
                        name: exercise.name,
                    });
                }
            });
        }
        return foundEntries.get(exerciseId);
    },
);
export const getIsLastSet = createSelector([getTrainedWorkout, (_, exerciseId: ExerciseId) => exerciseId], (trainedWorkout, exerciseId) => {
    return (setIndex: number) => {
        const exercise = trainedWorkout?.workout?.exercises.find((exercise) => exercise.exerciseId === exerciseId);
        if (!exercise) {
            return false;
        }
        const parsedSets = parseFloat(exercise.sets);
        if (isNaN(parsedSets)) {
            return false;
        }
        return parseFloat(exercise.sets) - 1 === setIndex;
    };
});

const getSumOfSets = (type: ExerciseType, sets?: ExerciseSets) => {
    if (type === "TIME_BASED") {
        return sets?.reduce(
            (sum, set) => sum + parseFloat(set?.durationMinutes ?? "0") * 1000 + parseFloat(set?.durationSeconds ?? "0") * 60 * 1000,
            0,
        );
    }
    return sets?.reduce((sum, set) => sum + parseFloat(set?.reps ?? "0") * parseFloat(set?.weight ?? "0"), 0);
};
export const getOverallTrainingTrend = createSelector([getWorkouts, (_, workoutId: WorkoutId) => workoutId], (workouts, workoutId) => {
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

            if (fittingExerciseBefore) {
                const compareable = {
                    current: { name: fittingExerciseBefore.name, sum: getSumOfSets(type, sets) ?? 0 },
                    before: {
                        name: fittingExerciseBefore.name,
                        sum: getSumOfSets(type, fittingExerciseBefore.sets) ?? 0,
                    },
                };
                if (foundCompareables.find((compareable) => compareable.current.name === fittingExerciseBefore.name)) {
                    return;
                }
                foundCompareables.push(compareable);
            }
        });
    }

    return foundCompareables.reduce(
        (bestImprovement, { current, before }) => {
            if (before.sum !== 0) {
                const percent = (current.sum / before.sum) * 100;
                console.log(current, before, percent);
                if (bestImprovement === undefined) {
                    return { name: current.name, percent, isPositive: percent > 100 };
                } else {
                    if (percent > bestImprovement.percent) {
                        return { name: current.name, percent, isPositive: percent > 100 };
                    } else {
                        return bestImprovement;
                    }
                }
            }
        },
        undefined as { name?: string; percent: number; isPositive: boolean } | undefined,
    );
});

export const getExerciseDone = createSelector([getTrainedWorkout], (trainedWorkout) => {
    const exerciseIndex = trainedWorkout?.activeExerciseIndex;
    if (exerciseIndex === undefined || !trainedWorkout || trainedWorkout?.exerciseData.length === 0) {
        return false;
    }
    const sets = parseFloat(trainedWorkout?.workout?.exercises[exerciseIndex].sets ?? "-1");
    return (
        trainedWorkout.exerciseData[exerciseIndex].doneSets.length === sets &&
        trainedWorkout.exerciseData[exerciseIndex].doneSets.every(({ confirmed }) => Boolean(confirmed))
    );
});

export const getCanSnap = createSelector([getTrainedWorkout], (trainedWorkout) => {
    const exerciseIndex = trainedWorkout?.activeExerciseIndex;
    if (exerciseIndex === undefined || !trainedWorkout || trainedWorkout?.exerciseData.length === 0) {
        return false;
    }
    return trainedWorkout.exerciseData[exerciseIndex].canSnap;
});

export const getPauseTime = createSelector([getTrainedWorkout], (trainedWorkout) => {
    const exercise = trainedWorkout?.workout?.exercises[trainedWorkout?.activeExerciseIndex ?? -1];
    if (
        (exercise?.pauseMinutes !== undefined &&
            exercise.pauseMinutes !== "" &&
            exercise.pauseMinutes !== "0" &&
            exercise.pauseMinutes !== "00") ||
        (exercise?.pauseSeconds !== undefined &&
            exercise.pauseSeconds !== "" &&
            exercise.pauseSeconds !== "0" &&
            exercise.pauseSeconds !== "00")
    ) {
        return (parseFloat(exercise.pauseMinutes || "0") * 60 + parseFloat(exercise.pauseSeconds || "0")) * 1000;
    }

    return -404;
});

export const getIsDoneWithTraining = createSelector([getTrainedWorkout], (trainedWorkout) => {
    if (trainedWorkout?.exerciseData.length === 0 || trainedWorkout?.exerciseData.some((data) => data.doneSets.length === 0)) {
        return false;
    }

    return trainedWorkout?.exerciseData.every(
        (doneExercise, exerciseIndex) =>
            doneExercise.doneSets.every(({ confirmed }) => {
                return Boolean(confirmed);
            }) && doneExercise.doneSets.length === parseFloat(trainedWorkout?.workout.exercises[exerciseIndex].sets),
    );
});

export const getHasNoTrainingDataSaved = createSelector([getTrainedWorkout], (trainedWorkout) => {
    return trainedWorkout?.exerciseData.some((data) => data.doneSets.some((set) => set.confirmed));
});
export const getNote = createSelector(
    [getTrainedWorkout],
    (trainedWorkout) => trainedWorkout?.exerciseData?.[trainedWorkout?.activeExerciseIndex]?.note,
);
export const getExerciseMetadataFromWorkoutById = createSelector(
    [getTrainedWorkout, (_, exerciseId?: ExerciseId) => exerciseId],
    (trainedWorkout, exerciseId) => {
        if (exerciseId === undefined) {
            return undefined;
        }
        return trainedWorkout?.workout.exercises.find((exercise) => exercise.exerciseId === exerciseId);
    },
);
export const getActiveSetIndex = createSelector(
    [getTrainedWorkout, (_, exerciseId: ExerciseId) => exerciseId],
    (trainedWorkout, exerciseId) => {
        return trainedWorkout?.exerciseData.find((exercise) => exercise.exerciseId === exerciseId)?.activeSetIndex;
    },
);

export const getIsActiveSet = createSelector(
    [(state: AppState) => state, (_, exerciseId: ExerciseId) => exerciseId, (_, __, setIndex: number) => setIndex],
    (state, exerciseId, setIndex) => {
        return setIndex === getActiveSetIndex(state, exerciseId);
    },
);
export const getSetData = createSelector(
    [getTrainedWorkout, (_, setIndex: number) => setIndex, (_, __, exerciseId: ExerciseId) => exerciseId],
    (trainedWorkout, setIndex, exerciseId) => {
        const exerciseData = trainedWorkout?.exerciseData?.map((exerciseData) => {
            const hasData = Boolean(exerciseData?.doneSets[setIndex]);
            const isConfirmed = Boolean(exerciseData?.doneSets[setIndex]?.confirmed);
            const workout = trainedWorkout?.workout;
            const isLatestSet = setIndex === exerciseData?.latestSetIndex;
            const exerciseIndex = workout?.exercises.findIndex((exercise) => exercise.exerciseId === exerciseId);

            return {
                weight: exerciseData?.doneSets[setIndex]?.weight ?? workout?.exercises[exerciseIndex ?? -1]?.weight,
                reps: exerciseData?.doneSets[setIndex]?.reps ?? workout?.exercises[exerciseIndex ?? -1]?.reps,
                durationMinutes:
                    exerciseData?.doneSets[setIndex]?.durationMinutes ?? workout?.exercises[exerciseIndex ?? -1]?.durationMinutes,
                durationSeconds:
                    exerciseData?.doneSets[setIndex]?.durationSeconds ?? workout?.exercises[exerciseIndex ?? -1]?.durationSeconds,
                isEditable: setIndex === exerciseData?.activeSetIndex,
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

export const getIsOngoingWorkout = createSelector(
    [getTrainedWorkout, (_, workoutId?: WorkoutId) => workoutId],
    (trainedWorkout, workoutId) => {
        return trainedWorkout && trainedWorkout?.workout.workoutId === workoutId;
    },
);

export const getDoneWorkoutById = createSelector(
    [getEditedWorkout, (_, doneWorkoutIndex: WorkoutId) => doneWorkoutIndex],
    (editedWorkout, doneWorkoutIndex) => {
        return editedWorkout?.workout?.doneWorkouts.find((doneWorkout) => doneWorkout.doneWorkoutId === doneWorkoutIndex);
    },
);

export const getDoneExercises = createSelector(
    [getEditedWorkout, (_, doneWorkoutIndex: WorkoutId) => doneWorkoutIndex],
    (editedWorkout, doneWorkoutIndex) => {
        const doneWorkout = editedWorkout?.workout?.doneWorkouts.find((doneWorkout) => doneWorkout.doneWorkoutId === doneWorkoutIndex);
        return doneWorkout?.doneExercises ?? [];
    },
);

export const getDoneExerciseById = createSelector(
    [getEditedWorkout, (_, doneWorkoutId: WorkoutId) => doneWorkoutId, (_, __, doneExerciseId) => doneExerciseId],
    (editedWorkout, doneWorkoutId, doneExerciseId) => {
        const doneWorkout = editedWorkout?.workout?.doneWorkouts.find((doneWorkout) => doneWorkout.doneWorkoutId === doneWorkoutId);
        return doneWorkout?.doneExercises?.find((doneExercise) => doneExercise.doneExerciseId === doneExerciseId);
    },
);

export const getAnyHasFallbackSets = createSelector(
    [getEditedWorkout, (_, doneWorkoutIndex: WorkoutId) => doneWorkoutIndex],
    (editedWorkout, doneWorkoutIndex) => {
        const doneWorkout = editedWorkout?.workout?.doneWorkouts.find((doneWorkout) => doneWorkout.doneWorkoutId === doneWorkoutIndex);
        const hasFallbackSets = Boolean(doneWorkout?.doneExercises?.some((exercise) => exercise.fallbackSets));
        const setsAreEqual = Boolean(
            doneWorkout?.doneExercises?.every((exercise) =>
                exercise.sets.every((set, index) => {
                    if (exercise.type === "TIME_BASED") {
                        return (
                            exercise.fallbackSets?.[index]?.durationSeconds === set?.durationSeconds &&
                            exercise.fallbackSets?.[index]?.durationMinutes === set?.durationMinutes
                        );
                    }
                    return exercise.fallbackSets?.[index].reps === set.reps && exercise.fallbackSets?.[index].weight === set.weight;
                }),
            ),
        );
        return hasFallbackSets && !setsAreEqual;
    },
);
