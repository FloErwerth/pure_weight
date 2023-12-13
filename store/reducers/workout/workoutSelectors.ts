import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "../../index";
import { getLanguage } from "../settings/settingsSelectors";
import { getDate, getDateTodayIso, getIsoDate, getMonth, getSinceDate } from "../../../utils/date";
import { IsoDate } from "../../../types/date";
import { PALETTE } from "../../../utils/colorPalette";
import { getLastNEntries } from "../../../utils/getLastNEntries";
import { ExerciseSets } from "./types";

export const getWorkoutState = ({ workoutState }: AppState) => workoutState;
export const getTrainedWorkout = createSelector([getWorkoutState], (state) => state.trainedWorkout);
export const getWorkoutSorting = createSelector([getWorkoutState], (state) => state.sorting);
export const getWorkouts = createSelector([getWorkoutState], (state) => state.workouts);
export const getEditedWorkout = createSelector([getWorkoutState], (state) => state.editedWorkout);
export const getEditedExercise = createSelector([getWorkoutState], (state) => state.editedExercise);
export const getIsExistingEditedExercise = createSelector([getEditedExercise], (editedExercise) => editedExercise?.index !== undefined);
export const getNumberSavedWorkouts = createSelector([getWorkouts], (workouts) => workouts.length);
export const getSortedDoneWorkout = createSelector([getWorkouts, (workouts, index: number) => index], (workouts, index) => {
    return workouts[index].doneWorkouts.map(({ timestamp }) => timestamp).sort((a, b) => a - b);
});

export const getWorkoutColor = createSelector([getEditedWorkout], (editedWorkout) => editedWorkout?.workout.calendarColor);

export const getLatestWorkoutDate = createSelector([getSortedDoneWorkout], (timestamps) => {
    return getIsoDate(timestamps[timestamps.length - 1]) as IsoDate;
});
export const getLatestWorkoutDateDisplay = createSelector([getSortedDoneWorkout, getLanguage], (dates, language) => {
    return getSinceDate(dates[dates.length - 1], language ?? "de");
});
export const getFirstWorkoutDate = createSelector([getSortedDoneWorkout], (dates) => {
    return getIsoDate(dates[0]);
});
export const getWorkoutByIndex = createSelector([getWorkouts, (workouts, index: number) => index], (trainings, index) => {
    return trainings[index];
});
export const getEditedWorkoutName = createSelector([getEditedWorkout], (editedWorkout) => editedWorkout?.workout?.name);

export const getWorkoutExercises = createSelector([getEditedWorkout], (editedWorkout) => editedWorkout?.workout?.exercises);

type SortedData = { exerciseName: string; data: { sets: ExerciseSets; date: IsoDate }[] };

export const getTrainingDayData = createSelector([getEditedWorkout], (editedWorkout) => {
    const workout = editedWorkout?.workout;

    if (workout?.doneWorkouts === undefined || workout.doneWorkouts.length === 0) {
        return undefined;
    }

    const sortedData: Map<string, SortedData> = new Map();
    const slicedDoneWorkouts = getLastNEntries(workout.doneWorkouts, 25);

    slicedDoneWorkouts
        .filter(({ doneExercises }) => doneExercises !== undefined)
        .forEach(({ timestamp, doneExercises }) => {
            doneExercises!.forEach(({ name, sets }) => {
                const foundEntry = sortedData.get(name);
                if (foundEntry) {
                    foundEntry.data.push({ sets, date: getIsoDate(timestamp) });
                    return;
                }
                sortedData.set(name, { exerciseName: name, data: [{ sets, date: getIsoDate(timestamp) }] });
            });
        });

    return Array.from(sortedData.values());
});

export const getColor = createSelector([getEditedWorkout], (editedWorkout) => ({
    color: editedWorkout?.workout?.calendarColor ?? PALETTE[Math.floor(PALETTE.length * Math.random())],
    palette: PALETTE,
}));
export const getHistoryByMonth = createSelector([getEditedWorkout, (editedWorkout, month?: string) => month ?? getDateTodayIso()], (editedWorkout, searchedMonth) => {
    const workout = editedWorkout?.workout;
    const foundTrainings: Map<
        string,
        {
            color: string;
            name: string;
            duration?: string;
            date: IsoDate;
            weight: string;
            numExercisesDone: number;
        }[]
    > = new Map();

    workout?.doneWorkouts.forEach((doneWorkout) => {
        const date = getIsoDate(doneWorkout.timestamp);
        foundTrainings.set(date, [
            ...(foundTrainings.get(date) ?? []),
            {
                color: workout?.calendarColor,
                name: workout?.name,
                date: date,
                duration: doneWorkout.duration,
                weight: (
                    doneWorkout.doneExercises?.reduce(
                        (sum, current) => sum + current.sets.reduce((sumSet, currentSet) => sumSet + parseFloat(currentSet.weight) * parseFloat(currentSet.reps), 0),
                        0,
                    ) ?? 0
                ).toFixed(2),
                numExercisesDone: doneWorkout.doneExercises?.length ?? 0,
            },
        ]);
    });

    return Array.from(foundTrainings)
        .filter((value) => getMonth(value[0] as IsoDate) === getMonth((searchedMonth ?? getDateTodayIso()) as IsoDate))
        .map(([month, data]) => ({ title: month, data }));
});
export const getHasHistory = createSelector([getWorkouts, (workouts, index: number) => index], (workouts, index) => workouts[index].doneWorkouts.length > 0);
export const getNumberHistories = createSelector([getWorkouts, (workouts, workoutIndex: number) => workoutIndex], (workouts, workoutIndex) => {
    const workout = workouts[workoutIndex];
    return workout?.doneWorkouts.length;
});
export const getPreviousTraining = createSelector([getEditedWorkout, getLanguage, (editedWorkout, language, exerciseIndex: number) => exerciseIndex], (editedWorkout, language, exerciseIndex) => {
    const doneWorkouts = editedWorkout?.workout?.doneWorkouts;
    if (!doneWorkouts || doneWorkouts.length === 0) {
        return undefined;
    }

    const foundEntries = new Map<string, { date: string; sets: ExerciseSets; note?: string }>();

    for (let workoutIndex = doneWorkouts.length - 1; workoutIndex >= 0; workoutIndex--) {
        doneWorkouts[workoutIndex].doneExercises?.forEach((exercise) => {
            if (!foundEntries.get(exercise.name)) {
                foundEntries.set(exercise.name, {
                    date: getDate(doneWorkouts[workoutIndex].timestamp, language),
                    sets: exercise.sets,
                    note: exercise.note,
                });
            }
        });
    }
    return foundEntries.get(editedWorkout?.workout.exercises[exerciseIndex].name);
});
export const getOverallTrainingTrend = createSelector([getWorkouts, (workouts, index: number) => index], (workouts, index) => {
    const workout = workouts[index];

    if (!workout.doneWorkouts || workout.doneWorkouts?.length < 2 || workout.doneWorkouts.some(({ doneExercises }) => !doneExercises)) {
        return undefined;
    }

    const latestExercisePairs: Map<
        string,
        {
            cleanedPercent: number;
            isPositive?: boolean;
        }
    > = new Map();
    for (let i = 1; i < workout.doneWorkouts.length; i += 2) {
        const workoutBefore = workout.doneWorkouts[i - 1];
        const currentWorkout = workout.doneWorkouts[i];

        for (let j = 0; j < workoutBefore.doneExercises!.length; j++) {
            const beforeExercise = workoutBefore.doneExercises![j];
            const currentExercise = currentWorkout.doneExercises![j];

            if (currentExercise !== undefined && currentExercise.name === beforeExercise.name) {
                const beforeOverall = beforeExercise.sets.reduce((sum, set) => sum + parseFloat(set.reps) * parseFloat(set.weight), 0);
                const currentOverall = currentExercise.sets.reduce((sum, set) => sum + parseFloat(set.reps) * parseFloat(set.weight), 0);
                const result: {
                    cleanedPercent: number;
                    isPositive?: boolean;
                } = {
                    cleanedPercent: 0,
                };
                const fraction = currentOverall / beforeOverall;
                if (fraction === 1) {
                    result.cleanedPercent = 0;
                } else if (fraction > 1) {
                    result.cleanedPercent = fraction * 100 - 100;
                    result.isPositive = true;
                } else {
                    result.cleanedPercent = 100 - fraction * 100;
                    result.isPositive = false;
                }
                latestExercisePairs.set(currentExercise.name, result);
            }
        }
    }
    const foundBestExercise = Array.from(latestExercisePairs).reduce(
        (bestImprovement, [name, { isPositive, cleanedPercent }], index) => {
            if (index === 0) {
                return {
                    name,
                    isPositive,
                    percent: cleanedPercent,
                };
            }
            if (isPositive === bestImprovement.isPositive) {
                if (!isPositive) {
                    if (bestImprovement.percent > cleanedPercent) {
                        return {
                            name,
                            percent: cleanedPercent,
                            isPositive: false,
                        };
                    }
                    return bestImprovement;
                } else {
                    if (bestImprovement.percent > cleanedPercent) {
                        return bestImprovement;
                    }
                    return {
                        name,
                        percent: cleanedPercent,
                        isPositive: true,
                    };
                }
            }
            if (isPositive !== bestImprovement.isPositive) {
                if (isPositive) {
                    return {
                        name,
                        percent: cleanedPercent,
                        isPositive,
                    };
                } else {
                    return bestImprovement;
                }
            }
            return bestImprovement;
        },
        {} as {
            name: string;
            percent: number;
            isPositive?: boolean;
        },
    );
    if (foundBestExercise.name) {
        return foundBestExercise;
    }
    return undefined;
});
export const getPauseTime = createSelector([getTrainedWorkout], (trainedWorkout) => {
    const exerciseIndex = trainedWorkout?.activeExerciseIndex;
    if (exerciseIndex === undefined) {
        return -404;
    }
    const pause = trainedWorkout?.workout.exercises[exerciseIndex].pause;
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

export const getHasAnyTrainedWorkoutData = createSelector([getTrainedWorkout], (trainedWorkout) => {
    return !(trainedWorkout?.exerciseData.length === 0 || trainedWorkout?.exerciseData.every((data) => data.doneSets.length === 0));
});
export const getNote = createSelector([getTrainedWorkout], (trainedWorkout) => trainedWorkout?.exerciseData[trainedWorkout?.activeExerciseIndex].note);
export const getWeightBasedExerciseMetaDataFromTrainedWorkout = createSelector([getTrainedWorkout, (trainedWorkout, exerciseIndex?: number) => exerciseIndex], (trainedWorkout, exerciseIndex) => {
    if (exerciseIndex === undefined) {
        return undefined;
    }
    return trainedWorkout?.workout.exercises[exerciseIndex];
});
export const getActiveSetIndex = createSelector([getTrainedWorkout, (trainedWorkout, exerciseIndex: number) => exerciseIndex], (trainedWorkout, exerciesIndex) => {
    return trainedWorkout?.exerciseData[exerciesIndex].activeSetIndex;
});

export const getTrainedWorkoutWorkout = createSelector([getTrainedWorkout], (trainedWorkout) => trainedWorkout?.workout);
export const getExerciseData = createSelector([getTrainedWorkout], (trainedWorkout) => trainedWorkout?.exerciseData);
export const getSetData = createSelector([getExerciseData, (trainedWorkout, setIndex: number) => setIndex, getTrainedWorkoutWorkout], (exerciseData, setIndex, workout) => {
    return exerciseData?.map((exerciseData, exerciseIndex) => {
        const hasData = Boolean(exerciseData?.doneSets[setIndex]);
        const isConfirmed = Boolean(exerciseData?.doneSets[setIndex]?.confirmed);

        return {
            weight: hasData ? exerciseData?.doneSets[setIndex].weight : workout?.exercises[exerciseIndex].weight,
            reps: hasData ? exerciseData?.doneSets[setIndex].reps : workout?.exercises[exerciseIndex].reps,
            isEditable: isConfirmed || hasData || setIndex === exerciseData?.activeSetIndex,
            isConfirmed,
            hasData,
        };
    });
});
