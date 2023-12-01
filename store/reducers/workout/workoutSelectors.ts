import { createSelector } from "@reduxjs/toolkit";
import { Temporal } from "@js-temporal/polyfill";
import { AppState } from "../../index";
import { ExerciseSets } from "../../types";
import { getLanguage } from "../settings/settingsSelectors";
import { getDate, getDateTodayIso, getMonth } from "../../../utils/date";
import { IsoDate } from "../../../types/date";

export const getWorkoutState = ({ workoutState }: AppState) => workoutState;
export const getTrainedWorkout = createSelector([getWorkoutState], (state) => state.trainedWorkout);
export const getWorkoutSorting = createSelector([getWorkoutState], (state) => state.sorting);
export const getWorkouts = createSelector([getWorkoutState], (state) => state.workouts);
export const getEditedWorkout = createSelector([getWorkoutState], (state) => state.editedWorkout);
export const getEditedExercise = createSelector([getWorkoutState], (state) => state.editedExercise);
export const getIsExistingEditedExercise = createSelector([getEditedExercise], (editedExercise) => editedExercise?.index !== undefined);
export const getNumberSavedWorkouts = createSelector([getWorkouts], (workouts) => workouts.length);
export const getWorkoutDates = createSelector([getEditedWorkout], (editedWorkout) => {
    if (!editedWorkout) {
        return [];
    }

    return editedWorkout.workout.doneWorkouts?.map(({ date }) => date);
});

export const getWorkoutColor = createSelector([getEditedWorkout], (editedWorkout) => editedWorkout?.workout.calendarColor);
export const getLatestWorkoutDate = createSelector([getWorkoutDates], (dates) => {
    return dates.sort(
        (dateA, dateB) => Temporal.Instant.from(dateA.concat("T00:00+00:00") as string).epochMilliseconds - Temporal.Instant.from(dateB.concat("T00:00+00:00") as string).epochMilliseconds,
    )[dates.length - 1];
});
export const getSelectedTrainingDayByIndex = createSelector([getWorkouts], (trainings) => {
    return (index: number) => {
        return trainings[index];
    };
});
export const getEditedWorkoutName = createSelector([getEditedWorkout], (editedWorkout) => editedWorkout?.workout?.name);
export const getWeightBasedExerciseMetaData = createSelector([getEditedWorkout, (workout, index: number) => index], (editedWorkout, exerciseIndex) => {
    const exercise = editedWorkout?.workout?.exercises[exerciseIndex];
    if (!exercise) {
        return undefined;
    }

    return exercise;
});

export const getSpecificNumberOfSets = createSelector([getEditedWorkout, (exerciseIndex: number) => exerciseIndex], (editedWorkout, exerciseIndex) => {
    if (editedWorkout?.workout.exercises[exerciseIndex]) {
        return parseFloat(editedWorkout.workout.exercises[exerciseIndex].sets);
    }
});

export const getWorkoutExercises = createSelector([getEditedWorkout], (editedWorkout) => editedWorkout?.workout?.exercises);
export const getTrainingDayData = createSelector([getEditedWorkout], (editedWorkout) => {
    const workout = editedWorkout?.workout;
    if (workout?.doneWorkouts === undefined || workout.doneWorkouts.length === 0) {
        return undefined;
    }

    const sortedData: { exerciseName: string; data: { sets: ExerciseSets; date: IsoDate }[] }[] = [];
    const slicedDoneWorkouts = workout.doneWorkouts.length > 20 ? workout.doneWorkouts.slice(workout.doneWorkouts.length - 20) : workout.doneWorkouts;
    slicedDoneWorkouts
        .filter(({ doneExercises }) => doneExercises !== undefined)
        .forEach(({ date, doneExercises }) => {
            doneExercises!.forEach(({ name, sets }) => {
                const foundEntry = sortedData.find(({ exerciseName }) => exerciseName === name);
                if (foundEntry) {
                    foundEntry.data.push({ sets, date });
                    return;
                }
                sortedData.push({ exerciseName: name, data: [{ sets, date }] });
            });
        });
    return sortedData;
});
export const getHistoryByMonth = createSelector(
    [getWorkouts, (workouts, month?: string) => month, (workouts, month, workoutIndex: number) => workoutIndex],
    (workouts, searchedMonth, workoutIndex) => {
        const foundTrainings: Map<
            string,
            {
                color: string;
                name: string;
                duration?: string;
                date: IsoDate;
                weight: number;
                numExercisesDone: number;
            }[]
        > = new Map();
        const workout = workouts[workoutIndex];

        workout.doneWorkouts.forEach((doneWorkout) => {
            foundTrainings.set(doneWorkout.date, [
                ...(foundTrainings.get(doneWorkout.date) ?? []),
                {
                    color: workout.calendarColor,
                    name: workout.name,
                    date: doneWorkout.date,
                    duration: doneWorkout.duration,
                    weight:
                        doneWorkout.doneExercises?.reduce(
                            (sum, current) => sum + current.sets.reduce((sumSet, currentSet) => sumSet + parseFloat(currentSet.weight) * parseFloat(currentSet.reps), 0),
                            0,
                        ) ?? 0,
                    numExercisesDone: doneWorkout.doneExercises?.length ?? 0,
                },
            ]);
        });
        return Array.from(foundTrainings)
            .filter((value) => getMonth(value[0] as IsoDate) === getMonth((searchedMonth ?? getDateTodayIso()) as IsoDate))
            .map(([month, data]) => ({ title: month, data }));
    },
);
export const getHasHistory = createSelector([getWorkouts], (workouts) => (index: number) => workouts[index].doneWorkouts.length > 0);
export const getNumberHistories = createSelector([getWorkouts], (workouts) => (index: number) => workouts[index].doneWorkouts.length);
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
                    date: getDate(doneWorkouts[workoutIndex].date, language),
                    sets: exercise.sets,
                    note: exercise.note,
                });
            }
        });
    }
    return foundEntries.get(editedWorkout?.workout.exercises[exerciseIndex].name);
});
export const getOverallTrainingTrend = createSelector([getSelectedTrainingDayByIndex], (trainingDayByIndex) => {
    return (workoutIndex: number) => {
        const workout = trainingDayByIndex(workoutIndex);

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
    };
});
export const getPauseTime = createSelector([getEditedWorkout, (editedWorkout, exerciseIndex: number) => exerciseIndex], (editedWorkout, exerciseIndex) => {
    return editedWorkout?.workout.exercises[exerciseIndex].pause;
});
export const getIsDoneWithTraining = createSelector([getTrainedWorkout], (trainedWorkout) => {
    return Boolean(trainedWorkout?.doneExerciseData.every((doneExercise) => doneExercise.every(({ sets }) => sets.every((set) => set.filled === true))));
});
