import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "../../index";
import { getLanguage } from "../settings/settingsSelectors";
import { getDateTodayIso, getLocaleDate, getMonth } from "../../../utils/date";
import { IsoDate } from "../../../types/date";
import { PALETTE } from "../../../utils/colorPalette";
import { getLastNEntries } from "../../../utils/getLastNEntries";
import { ExerciseSets } from "./types";
import { Temporal } from "@js-temporal/polyfill";
import { getSinceDate } from "../../../utils/timeAgo";
import { sortWorkouts } from "./sortWorkouts";

export const getWorkoutState = ({ workoutState }: AppState) => workoutState;
export const getTrainedWorkout = createSelector([getWorkoutState], (state) => state.trainedWorkout);
export const getWorkoutSorting = createSelector([getWorkoutState], (state) => state.sorting);
export const getWorkouts = createSelector([getWorkoutState], (state) => state.workouts);
export const getTrainedWorkoutExercises = createSelector([getTrainedWorkout, getWorkouts], (trainedWorkout, workouts) => {
    if (trainedWorkout === undefined) {
        return [];
    }
    return workouts.find((workout) => workout.workoutId === trainedWorkout.workout.workoutId)?.exercises;
});
export const getExerciseByIndex = createSelector([getTrainedWorkout, (workout, index: number) => index], (workout, index) => {
    return workout?.workout.exercises?.[index];
});
export const getEditedWorkout = createSelector([getWorkoutState], (state) => state.editedWorkout);
export const getIsEditedWorkout = createSelector([getEditedWorkout], (editedWorkout) => !editedWorkout?.isNew);
export const getEditedExercise = createSelector([getWorkoutState], (state) => state.editedExercise);
export const getIsExistingEditedExercise = createSelector([getEditedExercise], (editedExercise) => editedExercise?.index !== undefined);
export const getNumberSavedWorkouts = createSelector([getWorkouts], (workouts) => workouts.length);
export const getSortedDoneWorkout = createSelector([getWorkouts, (workouts, index: number) => index], (workouts, index) => {
    return workouts
        .find((workout) => workout.workoutId === index)
        ?.doneWorkouts.map(({ isoDate }) => isoDate)
        .sort(Temporal.PlainDate.compare);
});
export const getWorkoutColor = createSelector([getEditedWorkout], (editedWorkout) => editedWorkout?.workout?.calendarColor);

export const getLatestWorkoutDate = createSelector([getSortedDoneWorkout], (isoDates) => {
    return isoDates?.[isoDates?.length - 1] ?? ("1970-01-01" as IsoDate);
});
export const getLatestWorkoutDateDisplay = createSelector([getSortedDoneWorkout, getLanguage], (dates, language) => {
    return getSinceDate(dates?.[dates?.length - 1], language ?? "de") ?? ("1970-01-01" as IsoDate);
});
export const getFirstWorkoutDate = createSelector([getSortedDoneWorkout], (dates) => {
    return dates?.[0] ?? ("1970-01-01" as IsoDate);
});
export const getWorkoutByIndex = createSelector([getWorkouts, (workouts, index: number) => index], (workouts, index) => {
    return workouts.find((workout) => workout.workoutId === index);
});
export const getSortedWorkouts = createSelector([getWorkouts, getWorkoutSorting], (workouts, sorting) => {
    return sortWorkouts(workouts, sorting);
});
export const getEditedWorkoutName = createSelector([getEditedWorkout], (editedWorkout) => editedWorkout?.workout?.name);
export const getExercisesFromIndex = createSelector([getTrainedWorkout, getWorkouts, (workouts, exerciseIndex: number) => exerciseIndex], (trainedWorkout, workouts, exerciseIndex) => {
    if (trainedWorkout) {
        return workouts.find((workout) => workout.workoutId === trainedWorkout.workout.workoutId)?.exercises[exerciseIndex];
    }
});

export const getSetsArray = createSelector([getExercisesFromIndex], (exercise) => {
    const sets = parseFloat(exercise?.sets ?? "-1");
    if (isNaN(sets)) {
        return [];
    }
    return Array.from({ length: sets }, (_, i) => i);
});

type SortedData = { exerciseName: string; data: { sets: ExerciseSets; date: IsoDate }[] };

export const getTrainingDayData = createSelector([getEditedWorkout], (editedWorkout) => {
    const workout = editedWorkout?.workout;

    if (workout?.doneWorkouts === undefined || workout?.doneWorkouts.length === 0) {
        return undefined;
    }

    const sortedData: Map<number, SortedData> = new Map();
    const slicedDoneWorkouts = getLastNEntries(workout?.doneWorkouts, 100);

    slicedDoneWorkouts?.forEach(({ isoDate, doneExercises }) => {
        if (doneExercises) {
            doneExercises.forEach(({ name, sets, originalExerciseId }) => {
                const foundEntry = sortedData.get(originalExerciseId);
                if (foundEntry) {
                    foundEntry.data.push({ sets, date: isoDate });
                    return;
                }
                sortedData.set(originalExerciseId, { exerciseName: name, data: [{ sets, date: isoDate }] });
            });
        }
    });
    return Array.from(sortedData.values()).filter(({ data }) => data.length > 1);
});

export const getColor = createSelector([getEditedWorkout], (editedWorkout) => ({
    color: editedWorkout?.workout?.calendarColor ?? PALETTE[Math.floor(PALETTE.length * Math.random())],
    palette: PALETTE,
}));

export const getExerciseDone = createSelector([getTrainedWorkout], (trainedWorkout) => {
    const exerciseIndex = trainedWorkout?.activeExerciseIndex;
    if (exerciseIndex === undefined || !trainedWorkout || trainedWorkout?.exerciseData.length === 0) {
        return false;
    }
    const sets = parseFloat(trainedWorkout?.workout?.exercises[exerciseIndex].sets ?? "-1");
    return trainedWorkout.exerciseData[exerciseIndex].doneSets.length === sets && trainedWorkout.exerciseData[exerciseIndex].doneSets.every(({ confirmed }) => Boolean(confirmed));
});
export const getCanSnap = createSelector([getTrainedWorkout], (trainedWorkout) => {
    const exerciseIndex = trainedWorkout?.activeExerciseIndex;
    if (exerciseIndex === undefined || !trainedWorkout || trainedWorkout?.exerciseData.length === 0) {
        return false;
    }
    return trainedWorkout.exerciseData[exerciseIndex].canSnap;
});
export const getWorkoutsByMonth = createSelector([getEditedWorkout, (editedWorkout, selectedDate?: string) => selectedDate ?? getDateTodayIso()], (editedWorkout, searchedDate) => {
    const workout = editedWorkout?.workout;

    return workout?.doneWorkouts?.filter(({ isoDate }) => getMonth(isoDate) === getMonth((searchedDate as IsoDate) ?? getDateTodayIso()));
});
export const getHasHistory = createSelector([getWorkouts, (workouts, workoutId: number) => workoutId], (workouts, workoutId) => {
    const doneWorkouts = workouts?.find((workout) => workout?.workoutId === workoutId)?.doneWorkouts;
    if (doneWorkouts === undefined) {
        return false;
    }
    return doneWorkouts.length > 0;
});
export const getNumberWorkoutHistoryEntries = createSelector([getWorkouts, (workouts, workoutIndex: number) => workoutIndex], (workouts, workoutIndex) => {
    const workout = workouts.find((workout) => workout.workoutId === workoutIndex);
    return workout?.doneWorkouts?.length;
});
export const getPreviousTraining = createSelector([getTrainedWorkout, getLanguage, (trainedWorkout, language, exerciseIndex: number) => exerciseIndex], (trainedWorkout, language, exerciseIndex) => {
    const doneWorkouts = trainedWorkout?.workout?.doneWorkouts;
    if (!doneWorkouts || doneWorkouts?.length === 0) {
        return undefined;
    }

    const foundEntries = new Map<string, { date: string; sets: ExerciseSets; note?: string }>();
    for (let workoutIndex = doneWorkouts?.length - 1; workoutIndex >= 0; workoutIndex--) {
        doneWorkouts?.[workoutIndex].doneExercises?.forEach((exercise) => {
            if (!foundEntries.get(exercise.name)) {
                foundEntries.set(exercise.name, {
                    date: getLocaleDate(doneWorkouts?.[workoutIndex].isoDate, language, { dateStyle: "medium" }),
                    sets: exercise.sets,
                    note: exercise.note,
                });
            }
        });
    }
    return foundEntries.get(trainedWorkout?.workout?.exercises[exerciseIndex].name);
});
export const getIsLastSet = createSelector([getTrainedWorkout, (trainedWorkout, exerciseIndex: number) => exerciseIndex], (trainedWorkout, exerciseIndex) => {
    return (setIndex: number) => {
        const exercise = trainedWorkout?.workout?.exercises[exerciseIndex];
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

const getSumOfSets = (sets?: ExerciseSets) => {
    return sets?.reduce((sum, set) => sum + parseFloat(set?.reps ?? "0") * parseFloat(set?.weight ?? "0"), 0);
};
export const getOverallTrainingTrend = createSelector([getWorkouts, (workouts, index: number) => index, getLatestWorkoutDate], (workouts, index, latestWorkoutDate) => {
    const workout = workouts.find((workout) => workout.workoutId === index);
    if (!workout?.doneWorkouts || workout?.doneWorkouts?.length < 2 || workout?.doneWorkouts.some(({ doneExercises }) => !doneExercises)) {
        return undefined;
    }

    const foundCompareables: { current: { name?: string; sum: number }; before: { name?: string; sum: number } }[] = [];

    workout?.doneWorkouts.forEach(({ isoDate, doneExercises }, index) => {
        if (isoDate === latestWorkoutDate && index > 0) {
            const workoutBefore = workout?.doneWorkouts[index - 1];

            doneExercises?.forEach(({ originalExerciseId, sets }) => {
                const exerciseName = workout.exercises.find(({ exerciseId }) => exerciseId === originalExerciseId)?.name;
                const fittingExerciseBefore = workoutBefore?.doneExercises?.findLast(({ originalExerciseId }) => originalExerciseId === originalExerciseId);

                if (fittingExerciseBefore) {
                    const compareable = {
                        current: { name: exerciseName, sum: getSumOfSets(sets) ?? 0 },
                        before: { name: exerciseName, sum: getSumOfSets(fittingExerciseBefore.sets) ?? 0 },
                    };
                    foundCompareables.push(compareable);
                }
            });
        }
    });

    return foundCompareables.reduce(
        (bestImprovement, { current, before }) => {
            const percent = (current.sum / before.sum) * 100;
            if (bestImprovement === undefined) {
                return { name: current.name, percent, isPositive: percent > 100 };
            } else {
                if (percent > bestImprovement.percent) {
                    return { name: current.name, percent, isPositive: percent > 100 };
                } else {
                    return bestImprovement;
                }
            }
        },
        undefined as { name?: string; percent: number; isPositive: boolean } | undefined,
    );
});

export const getPauseTime = createSelector([getTrainedWorkout], (trainedWorkout) => {
    const exerciseIndex = trainedWorkout?.activeExerciseIndex;
    if (exerciseIndex === undefined) {
        return -404;
    }
    const pause = trainedWorkout?.workout?.exercises[exerciseIndex].pause;
    if (pause === undefined) {
        return -404;
    }
    return (parseFloat(pause.minutes ?? "0") * 60 + parseFloat(pause.seconds ?? "0")) * 1000;
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
export const getNote = createSelector([getTrainedWorkout], (trainedWorkout) => trainedWorkout?.exerciseData?.[trainedWorkout?.activeExerciseIndex]?.note);
export const getExerciseMetadataFromWorkoutByIndex = createSelector([getTrainedWorkout, (trainedWorkout, exerciseIndex?: number) => exerciseIndex], (trainedWorkout, exerciseIndex) => {
    if (exerciseIndex === undefined) {
        return undefined;
    }
    return trainedWorkout?.workout.exercises[exerciseIndex];
});
export const getActiveSetIndex = createSelector([getTrainedWorkout, (trainedWorkout, exerciseIndex: number) => exerciseIndex], (trainedWorkout, exerciesIndex) => {
    return trainedWorkout?.exerciseData[exerciesIndex].activeSetIndex;
});

export const getIsActiveSet = createSelector(
    [(state: AppState) => state, (state, exerciseIndex: number) => exerciseIndex, (state, exerciseIndex, setIndex: number) => setIndex],
    (state, activeExerciseIndex, setIndex) => {
        return setIndex === getActiveSetIndex(state, activeExerciseIndex);
    },
);
export const getExerciseData = createSelector([getTrainedWorkout], (trainedWorkout) => trainedWorkout?.exerciseData);
export const getSetData = createSelector([getExerciseData, (exerciseData, setIndex: number) => setIndex, getTrainedWorkout], (exerciseData, setIndex, trainedWorkout) => {
    return exerciseData?.map((exerciseData, exerciseIndex) => {
        const hasData = Boolean(exerciseData?.doneSets[setIndex]);
        const isConfirmed = Boolean(exerciseData?.doneSets[setIndex]?.confirmed);
        const workout = trainedWorkout?.workout;
        const isLatestSet = setIndex === exerciseData?.latestSetIndex;
        const isEditingLatestSet = exerciseData?.latestSetIndex === exerciseData?.activeSetIndex;
        const isEditable = isConfirmed || hasData || setIndex === exerciseData?.activeSetIndex;
        const isEditedOtherSet = isEditingLatestSet && setIndex === exerciseData?.activeSetIndex;
        return {
            weight: exerciseData?.doneSets[setIndex]?.weight ?? workout?.exercises[exerciseIndex].weight,
            reps: exerciseData?.doneSets[setIndex]?.reps ?? workout?.exercises[exerciseIndex].reps,
            duration: workout?.exercises[exerciseIndex].duration,
            preparation: workout?.exercises[exerciseIndex].preparation,
            isEditable: isEditable || isEditedOtherSet || exerciseData.latestSetIndex === setIndex,
            isConfirmed,
            hasData,
            isLatestSet,
        };
    });
});

export const getIsOngoingWorkout = createSelector([getTrainedWorkout, (trainedWorkout, workoutIndex: number) => workoutIndex], (trainedWorkout, workoutIndex) => {
    return trainedWorkout && trainedWorkout?.workout.workoutId === workoutIndex;
});

export const getDoneWorkoutById = createSelector([getEditedWorkout, (editedWorkout, doneWorkoutIndex: number) => doneWorkoutIndex], (editedWorkout, doneWorkoutIndex) => {
    return editedWorkout?.workout?.doneWorkouts.find((doneWorkout) => doneWorkout.doneWorkoutId === doneWorkoutIndex);
});

export const getDoneExercises = createSelector([getEditedWorkout, (workout, doneWorkoutIndex: number) => doneWorkoutIndex], (editedWorkout, doneWorkoutIndex) => {
    const doneWorkout = editedWorkout?.workout?.doneWorkouts.find((doneWorkout) => doneWorkout.doneWorkoutId === doneWorkoutIndex);
    return doneWorkout?.doneExercises ?? [];
});

export const getDoneExerciseById = createSelector(
    [getEditedWorkout, (workout, doneWorkoutId: number) => doneWorkoutId, (workout, doneWorkoutId, doneExerciseIndex) => doneExerciseIndex],
    (editedWorkout, doneWorkoutId, doneExerciseIndex) => {
        const doneWorkout = editedWorkout?.workout?.doneWorkouts.find((doneWorkout) => doneWorkout.doneWorkoutId === doneWorkoutId);
        return doneWorkout?.doneExercises?.[doneExerciseIndex];
    },
);

export const getAnyHasFallbackSets = createSelector([getEditedWorkout, (editedWorkout, doneWorkoutIndex: number) => doneWorkoutIndex], (editedWorkout, doneWorkoutIndex) => {
    const doneWorkout = editedWorkout?.workout?.doneWorkouts.find((doneWorkout) => doneWorkout.doneWorkoutId === doneWorkoutIndex);
    const hasFallbackSets = Boolean(doneWorkout?.doneExercises?.some((exercise) => exercise.fallbackSets));
    const setsAreEqual = Boolean(
        doneWorkout?.doneExercises?.every((exercise) => exercise.sets.every((set, index) => exercise.fallbackSets?.[index].reps === set.reps && exercise.fallbackSets?.[index].weight === set.weight)),
    );
    return hasFallbackSets && !setsAreEqual;
});
