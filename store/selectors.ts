import { createSelector } from "@reduxjs/toolkit";
import { AppState, ErrorFields, ExerciseMetaData, TrainingDay } from "./types";
import { getDate } from "../utils/date";
import { IsoDate } from "../types/date";

export const getSetIndex = (state: AppState) => state.setIndex ?? 0;
export const getExerciseIndex = (state: AppState) => state.exerciseIndex;
export const getSettings = (state: AppState) => state.settings;
export const getThemeKey = (state: AppState) => state.theme;
export const getTrainingIndex = (state: AppState) => state.trainingDayIndex;
export const getErrors = (state: AppState) => state.errors;
export const getIsFirstTimeRendered = (state: AppState) => state.isFirstTimeRendered;
export const getMeasurements = (state: AppState) => state.measurements;
export const getSavedTrainings = (state: AppState) => state.trainingDays;
export const getSelectedTrainingDayIndex = (state: AppState) => state.trainingDayIndex;
export const getSelectedTrainingDay = createSelector([getSavedTrainings, getSelectedTrainingDayIndex], (trainings, index) => {
  if (index !== undefined) {
    return trainings[index];
  }
  return undefined;
});

export const getSelectedTrainingDayByIndex = createSelector([getSavedTrainings], (trainings) => {
  return (index: number) => {
    return trainings[index];
  };
});

export const getDatesFromCurrentMeasurement = createSelector([getMeasurements], (measurements) => {
  return (measurementKey?: string) => {
    if (!measurementKey) {
      return undefined;
    }
    const measurementIndex = measurements.findIndex((measurement) => measurement.name === measurementKey);
    if (measurementIndex !== -1) {
      return Object.keys(measurements[measurementIndex].data);
    } else return undefined;
  };
});
export const getNumberOfExercises = createSelector([getSelectedTrainingDay], (day) => {
  return day?.exercises.length;
});
export const getExerciseNames = createSelector([getSelectedTrainingDay], (day) => {
  return day?.exercises.map((exercise) => exercise.name);
});
export const getSelectedTrainingName = createSelector([getSelectedTrainingDay], (day) => day?.name);

export const getErrorByKey = createSelector([getErrors], (state) => (errorField?: ErrorFields | undefined) => Boolean(errorField && state.includes(errorField)));
export const getLanguage = createSelector([getSettings], (settings) => settings.language);
export const getExerciseMetaData = createSelector([getSelectedTrainingDay, getExerciseIndex], (traininigDay, exerciseIndex) => {
  const exercise = traininigDay?.exercises[exerciseIndex];
  return { weight: exercise?.weight, reps: exercise?.reps, name: exercise?.name, sets: exercise?.sets, pause: exercise?.pause } as ExerciseMetaData;
});

export const getSpecificMetaData = createSelector([getSelectedTrainingDay], (traininigDay) => {
  return (exerciseIndex: number) => {
    const exercise = traininigDay?.exercises[exerciseIndex];
    return { weight: exercise?.weight, reps: exercise?.reps, name: exercise?.name, sets: exercise?.sets, pause: exercise?.pause } as ExerciseMetaData;
  };
});

export const getSpecificMetaDataRaw = createSelector([getSelectedTrainingDay], (traininigDay) => {
  return (exerciseIndex: number) => {
    const exercise = traininigDay?.exercises[exerciseIndex];
    return { weight: exercise?.weight, reps: exercise?.reps } as ExerciseMetaData;
  };
});

export const getNumberOfSets = createSelector([getExerciseMetaData], (exerciseMetaDataRaw) => {
  if (exerciseMetaDataRaw?.sets) {
    return parseFloat(exerciseMetaDataRaw.sets);
  }
  return undefined;
});
export const getSpecificNumberOfSets = createSelector([getSelectedTrainingDay], (day) => {
  return (exerciseIndex: number) => {
    if (day && day.exercises) {
      return parseFloat(day.exercises[exerciseIndex].sets);
    }
  };
});
export const getTrainingDayData = createSelector([getSavedTrainings], (trainingDays) => {
  return trainingDays
    .filter((day) => day.exercises.length > 0)
    .reduce((days, day) => {
      const exerciseEntries = day.exercises.filter((exercise) => exercise.doneExerciseEntries && exercise.doneExerciseEntries.length > 1);
      if (exerciseEntries.length > 0) {
        return [...days, { name: day.name, exercises: exerciseEntries }];
      }
      return days;
    }, [] as TrainingDay[]);
});

export const getSelectedTrainingDayData = createSelector([getTrainingDayData, getTrainingIndex], (data, index) => {
  if (index === undefined) {
    return undefined;
  }

  return data[index];
});

export const getPreviousTraining = createSelector([getSelectedTrainingDay, getLanguage], (traininigDay, language) => {
  return (exerciseIndex: number) => {
    const entries = traininigDay?.exercises[exerciseIndex]?.doneExerciseEntries;
    if (entries) {
      const latestEntry = entries[entries.length - 1];
      return { date: latestEntry?.date ? getDate(latestEntry.date, language) : "", vals: latestEntry?.sets ?? [], note: latestEntry?.note };
    }
  };
});
export const getOverallTrainingTrend = createSelector([getSelectedTrainingDayByIndex], (trainingDayByIndex) => {
  return (workoutIndex: number) => {
    const workout = trainingDayByIndex(workoutIndex);

    const sumOfFirstDoneExercises = workout.exercises.reduce((data, exercise, exerciseIndex) => {
      const secondLastEntry = exercise.doneExerciseEntries[exercise.doneExerciseEntries.length - 2];
      if (exerciseIndex === 0) {
        return secondLastEntry?.sets?.reduce((sum, data) => {
          const reps = parseFloat(data.reps);
          const weight = parseFloat(data.weight);
          return sum + reps * weight;
        }, 0);
      } else {
        const lastExercises = workout.exercises[exerciseIndex - 1];
        const latestEntriesLastExercise = lastExercises.doneExerciseEntries[lastExercises.doneExerciseEntries.length - 2];
        const date = latestEntriesLastExercise?.date;
        if (date === secondLastEntry?.date) {
          return secondLastEntry?.sets?.reduce((sum, data) => {
            const reps = parseFloat(data.reps);
            const weight = parseFloat(data.weight);
            return sum + reps * weight;
          }, 0);
        } else {
          return 0;
        }
      }
    }, 0);

    const sumOfLatestDoneExercises = workout.exercises.reduce((data, exercise, exerciseIndex) => {
      const latestExerciseEntry = exercise.doneExerciseEntries[exercise.doneExerciseEntries.length - 1];
      if (exerciseIndex === 0) {
        return latestExerciseEntry?.sets?.reduce((sum, data) => {
          const reps = parseFloat(data.reps);
          const weight = parseFloat(data.weight);
          return sum + reps * weight;
        }, 0);
      } else {
        const lastExercises = workout.exercises[exerciseIndex - 1];
        const latestEntriesLastExercise = lastExercises.doneExerciseEntries[lastExercises.doneExerciseEntries.length - 1];
        const date = latestEntriesLastExercise?.date;
        if (date === latestExerciseEntry?.date) {
          return latestExerciseEntry?.sets?.reduce((sum, data) => {
            const reps = parseFloat(data.reps);
            const weight = parseFloat(data.weight);
            return sum + reps * weight;
          }, 0);
        } else {
          return 0;
        }
      }
    }, 0);

    const diffAbsolute = sumOfFirstDoneExercises > 0 && sumOfLatestDoneExercises > 0 ? sumOfLatestDoneExercises - sumOfFirstDoneExercises : undefined;
    let diffPercent = (100 * sumOfFirstDoneExercises) / sumOfLatestDoneExercises;
    if (diffPercent > 100) {
      diffPercent -= 100;
    } else if (diffPercent < 100) {
      diffPercent = 100 - diffPercent;
    }

    return { date: workout?.latestDate as IsoDate, diff: diffAbsolute ? { absolute: diffAbsolute, percent: diffPercent.toFixed(1) } : undefined };
  };
});

export const getPauseTime = createSelector([getExerciseMetaData], (metaData) => metaData.pause);
