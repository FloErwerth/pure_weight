import { createSelector } from "@reduxjs/toolkit";
import { AppState, DoneExerciseData, ErrorFields, ExerciseMetaData, ExerciseSets } from "./types";
import { getDate } from "../utils/date";
import { IsoDate } from "../types/date";
import { Temporal } from "@js-temporal/polyfill";

export const getSetIndex = (state: AppState) => state.setIndex ?? 0;
export const getExerciseIndex = (state: AppState) => state.exerciseIndex;
export const getSettings = (state: AppState) => state.settings;
export const getThemeKey = (state: AppState) => state.theme;
export const getTrainingIndex = (state: AppState) => state.trainingDayIndex;
export const getErrors = (state: AppState) => state.errors;
export const getIsFirstTimeRendered = (state: AppState) => state.isFirstTimeRendered;
export const getMeasurements = (state: AppState) => state.measurements;
export const getAppInstallDate = (state: AppState) => state.appInstallDate;

export const getLatestMeasurements = createSelector([getMeasurements], (measurements) =>
  measurements.map(({ data }) => {
    const dates = Object.keys(data ?? []);
    return dates[dates.length - 1] as IsoDate;
  }),
);

function crampToNEntries<T extends Array<unknown>>(n: number, entries: T): T {
  if (entries.length > n) {
    return entries.slice(entries.length - n, entries.length) as T;
  }
  return entries;
}

export const getMeasurementDataFromIndex = createSelector([getMeasurements, (byIndex, index?: number) => index], (measurements, index) => {
  if (index === undefined) {
    return undefined;
  }

  const measurement = measurements[index];
  if (measurement?.data) {
    const labels: string[] = [];
    const data: number[] = [];
    const entries = Object.entries(measurement?.data);
    const vals = crampToNEntries(100, entries);
    vals.forEach(([date, value]) => {
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
export const getWorkoutDates = createSelector([getSavedTrainings], (workouts) => {
  const dates: IsoDate[] = [];
  workouts.forEach((workout) => {
    workout.dates?.forEach((date) => {
      if (!dates.includes(date)) {
        dates.push(date);
      }
    });
  });
  return dates;
});
export const getLatestWorkoutDate = createSelector([getWorkoutDates], (dates) => {
  return dates.sort(
    (dateA, dateB) => Temporal.Instant.from(dateA.concat("T00:00+00:00") as string).epochMilliseconds - Temporal.Instant.from(dateB.concat("T00:00+00:00") as string).epochMilliseconds,
  )[dates.length - 1];
});
export const getHistoryByMonth = createSelector([getSavedTrainings, (trainings, month: string) => month], (trainings, date) => {
  return [{ name: "Workout Name" }];
});
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

export const getExerciseMetaDataByIndex = createSelector([getSelectedTrainingDay, (workout, index: number) => index], (traininigDay, exerciseIndex) => {
  const exercise = traininigDay?.exercises[exerciseIndex];
  return { weight: exercise?.weight, reps: exercise?.reps, name: exercise?.name, sets: exercise?.sets, pause: exercise?.pause } as ExerciseMetaData;
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
    .filter((day) => day.doneWorkouts.length > 0)
    .reduce(
      (exerciseNameEntryPairs, workout) => {
        const newData = Array(workout.doneWorkouts.length)
          .fill(undefined)
          .map((_, index) => crampToNEntries(20, workout.doneWorkouts[index].doneExercises))
          .map((doneWorkout, index) => ({
            exerciseName: doneWorkout[index].name,
            exerciseData: doneWorkout.map((exercises) => ({ name: workout.name, sets: exercises.sets, date: workout.doneWorkouts[index].date })),
          }));
        const newEntries = [...exerciseNameEntryPairs];
        newEntries.push(newData);
        return newEntries;
      },
      [] as { exerciseName: string; exerciseData: { date: IsoDate; sets: ExerciseSets }[] }[][],
    );
});

export const getSelectedTrainingDayData = createSelector([getTrainingDayData, getTrainingIndex], (data, index) => {
  if (index === undefined) {
    return undefined;
  }

  return data[index];
});

export const getPreviousTraining = createSelector([getSelectedTrainingDay, getLanguage], (traininigDay, language) => {
  return (exerciseIndex: number) => {
    const entries = traininigDay?.doneWorkouts[exerciseIndex]?.doneExercises;
    if (entries) {
      const latestEntry = entries[entries.length - 1];
      const latestDate = traininigDay?.doneWorkouts[traininigDay?.doneWorkouts.length - 1].date;
      return { date: latestDate ? getDate(latestDate, language) : "", vals: latestEntry?.sets ?? [], note: latestEntry?.note };
    }
  };
});

export const getOverallTrainingTrend = createSelector([getSelectedTrainingDayByIndex], (trainingDayByIndex) => {
  return (workoutIndex: number) => {
    const workout = trainingDayByIndex(workoutIndex);
    const doneWorkouts = workout.doneWorkouts;
    if (!doneWorkouts || doneWorkouts.length === 0) {
      return undefined;
    }
    const filteredDoneExercises = workout.doneWorkouts.filter(({ doneExercises }) => doneExercises.length >= 2).map((doneWorkout) => doneWorkout.doneExercises);
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
      (bestEntry, currentEntry, index) => {
        if (bestEntry === undefined) {
          return { name: currentEntry[index].name, percent: getPercent(currentEntry) };
        }
        const nextPercent = getPercent(currentEntry);
        if (bestEntry.percent < nextPercent) {
          return { name: currentEntry[index].name, percent: nextPercent };
        }
        return { name: bestEntry.name, percent: bestEntry.percent };
      },
      undefined as { name: string; percent: number } | undefined,
    );
  };
});

export const getPauseTime = createSelector([getExerciseMetaData], (metaData) => metaData.pause);
