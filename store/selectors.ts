import { createSelector } from "@reduxjs/toolkit";
import { AppState, DoneExerciseData, ErrorFields, ExerciseMetaData, TrainingDay } from "./types";
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

export const getLatestMeasurements = createSelector([getMeasurements], (measurements) =>
  measurements.map(({ data }) => {
    const dates = Object.keys(data ?? []);
    return dates[dates.length - 1] as IsoDate;
  }),
);
export const getMeasurementDataFromIndex = createSelector([getMeasurements, (byIndex, index: number) => index], (measurements, index) => {
  const measurement = measurements[index];
  if (measurement?.data) {
    const labels: string[] = [];
    const data: number[] = [];
    const entries = Object.entries(measurement?.data);
    entries.forEach(([date, value]) => {
      labels.push(getDate(date as IsoDate));
      data.push(parseFloat(value));
    });
    return { labels, datasets: [{ data }] };
  }
  return undefined;
});

export const getMeasurmentProgress = createSelector([getMeasurements, (byIndex, index: number) => index], (measurements, index) => {
  const measurement = measurements[index];
  const data = Object.values(measurement?.data ?? []);

  if (data && data?.length >= 2) {
    const latest = parseFloat(data[data?.length - 1]);
    const secondLatest = parseFloat(data[data?.length - 2]);
    return (latest / secondLatest) * 100;
  }

  return undefined;
});

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
      return Object.keys(measurements[measurementIndex].data ?? []);
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
    const filteredDoneExercises = workout.exercises.filter(({ doneExerciseEntries }) => doneExerciseEntries.length >= 2);

    if (filteredDoneExercises.length === 0) {
      return undefined;
    }

    const getPercent = (data: DoneExerciseData[]) => {
      const first = data[data.length - 2];
      const second = data[data.length - 1];
      const sumFirst = first.sets.reduce((set, current) => {
        return set + parseFloat(current.reps) * parseFloat(current.weight);
      }, 0);
      const sumSecond = second.sets.reduce((set, current) => {
        return set + parseFloat(current.reps) * parseFloat(current.weight);
      }, 0);

      return (100 * sumSecond) / sumFirst;
    };

    return filteredDoneExercises.reduce(
      (bestEntry, currentEntry) => {
        if (bestEntry === undefined) {
          return { name: currentEntry.name, percent: getPercent(currentEntry.doneExerciseEntries) };
        }
        const nextPercent = getPercent(currentEntry.doneExerciseEntries);
        if (bestEntry.percent < nextPercent) {
          return { name: currentEntry.name, percent: nextPercent };
        }
        return { name: bestEntry.name, percent: bestEntry.percent };
      },
      undefined as { name: string; percent: number } | undefined,
    );
  };
});

export const getPauseTime = createSelector([getExerciseMetaData], (metaData) => metaData.pause);
