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
import { SectionListItemInfo } from "../../../app/workouts/history";
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

    const sortedData: Map<string, SortedData> = new Map();
    const slicedDoneWorkouts = getLastNEntries(workout?.doneWorkouts, 25);

    slicedDoneWorkouts
        .filter(({ doneExercises }) => doneExercises !== undefined)
        .forEach(({ isoDate, doneExercises }) => {
            doneExercises!.forEach(({ name, sets }) => {
                const foundEntry = sortedData.get(name);
                if (foundEntry) {
                    foundEntry.data.push({ sets, date: isoDate });
                    return;
                }
                sortedData.set(name, { exerciseName: name, data: [{ sets, date: isoDate }] });
            });
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
export const getHistoryByMonth = createSelector([getEditedWorkout, (editedWorkout, month?: string) => month ?? getDateTodayIso()], (editedWorkout, searchedMonth) => {
    const workout = editedWorkout?.workout;
    const foundTrainings: Map<string, SectionListItemInfo> = new Map();

    workout?.doneWorkouts?.forEach((doneWorkout) => {
        const date = doneWorkout.isoDate;
        const doneWorkouts = foundTrainings.get(date)?.doneWorkouts ?? [];
        doneWorkouts.push({
            duration: doneWorkout.duration,
            weight: (
                doneWorkout.doneExercises?.reduce((sum, current) => sum + current.sets.reduce((sumSet, currentSet) => sumSet + parseFloat(currentSet.weight) * parseFloat(currentSet.reps), 0), 0) ?? 0
            ).toFixed(2),
            numExercisesDone: doneWorkout.doneExercises?.length ?? 0,
        });
        foundTrainings.set(date, {
            color: workout?.calendarColor,
            name: workout?.name,
            date,
            doneWorkouts,
        });
    });

    return Array.from(foundTrainings)
        .filter((value) => getMonth(value[0] as IsoDate) === getMonth((searchedMonth ?? getDateTodayIso()) as IsoDate))
        .map(([month, data]) => ({ title: month, data: [data] }));
});
export const getHasHistory = createSelector([getWorkouts, (workouts, workoutId: number) => workoutId], (workouts, workoutId) => {
    const doneWorkouts = workouts?.find((workout) => workout?.workoutId === workoutId)?.doneWorkouts;
    if (doneWorkouts === undefined) {
        return false;
    }
    return doneWorkouts.length >= 0;
});
export const getNumberHistories = createSelector([getWorkouts, (workouts, workoutIndex: number) => workoutIndex], (workouts, workoutIndex) => {
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
export const getOverallTrainingTrend = createSelector([getWorkouts, (workouts, index: number) => index], (workouts, index) => {
    const workout = workouts.find((workout) => workout.workoutId === index);
    if (!workout?.doneWorkouts || workout?.doneWorkouts?.length < 2 || workout?.doneWorkouts.some(({ doneExercises }) => !doneExercises)) {
        return undefined;
    }

    const latestExercisePairs: Map<
        string,
        {
            cleanedPercent: number;
            isPositive?: boolean;
        }
    > = new Map();

    for (let i = 0; i < workout.doneWorkouts.length - 1; i++) {
        const workoutBefore = workout?.doneWorkouts[i];
        const currentWorkout = workout?.doneWorkouts[i + 1];

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
export const getWeightBasedExerciseMetaDataFromTrainedWorkout = createSelector([getTrainedWorkout, (trainedWorkout, exerciseIndex?: number) => exerciseIndex], (trainedWorkout, exerciseIndex) => {
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
        const isEditingLatestSet = exerciseData?.latestSetIndex === exerciseData?.activeSetIndex;
        const isEditable = isConfirmed || hasData || setIndex === exerciseData?.activeSetIndex;
        const isEditedOtherSet = isEditingLatestSet && setIndex === exerciseData?.activeSetIndex;

        return {
            weight: exerciseData?.doneSets[setIndex]?.weight ?? workout?.exercises[exerciseIndex].weight,
            reps: exerciseData?.doneSets[setIndex]?.reps ?? workout?.exercises[exerciseIndex].reps,
            isEditable: isEditable || isEditedOtherSet,
            isConfirmed,
            hasData,
        };
    });
});

export const getIsOngoingWorkout = createSelector([getTrainedWorkout, (trainedWorkout, workoutIndex: number) => workoutIndex], (trainedWorkout, workoutIndex) => {
    return trainedWorkout && trainedWorkout?.workout.workoutId === workoutIndex && trainedWorkout.paused;
});
