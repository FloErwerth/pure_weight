import { createSelector } from "@reduxjs/toolkit";
import { AppState, ErrorFields, ExerciseMetaData, ExerciseSets } from "./types";
import { getDate } from "../utils/date";
import { IsoDate } from "../types/date";
import { Temporal } from "@js-temporal/polyfill";

export const getSetIndex = (state: AppState) => state.setIndex ?? 0;
export const getExerciseIndex = (state: AppState) => state.exerciseIndex;
export const getSettings = (state: AppState) => state.settings;
export const getThemeKey = (state: AppState) => state.theme;
export const getTrainingIndex = (state: AppState) => state.workoutIndex;
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

export const getSavedTrainings = (state: AppState) => state.workouts;
export const getWorkoutDates = createSelector([getSavedTrainings], (workouts) => {
  const dates: IsoDate[] = [];
  workouts.forEach((workout) => {
    workout.doneWorkouts?.forEach(({ date }) => {
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
  const foundTrainings: { name: string; duration?: string; date: IsoDate }[] = [];
  trainings.forEach((workout) => {
    workout.doneWorkouts
      .filter((workout) => workout.date.split("-")[1] === date.split("-")[1])
      .forEach((doneWorkout) => foundTrainings.push({ name: workout.name, date: doneWorkout.date, duration: doneWorkout.duration }));
  });

  return foundTrainings;
});
export const getSelectedTrainingDayIndex = (state: AppState) => state.workoutIndex;
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

    if (workout.doneWorkouts.length < 2) {
      return undefined;
    }

    const latestExercisePairs: Map<string, { cleanedPercent: number; isPositive?: boolean }> = new Map();
    for (let i = 1; i < workout.doneWorkouts.length; i += 2) {
      const workoutBefore = workout.doneWorkouts[i - 1];
      const currentWorkout = workout.doneWorkouts[i];

      for (let j = 0; j < workoutBefore.doneExercises.length; j++) {
        const beforeExercise = workoutBefore.doneExercises[j];
        const currentExercise = currentWorkout.doneExercises[j];

        if (currentExercise !== undefined && currentExercise.name === beforeExercise.name) {
          const beforeOverall = beforeExercise.sets.reduce((sum, set) => sum + parseFloat(set.reps) * parseFloat(set.weight), 0);
          const currentOverall = currentExercise.sets.reduce((sum, set) => sum + parseFloat(set.reps) * parseFloat(set.weight), 0);
          const result: { cleanedPercent: number; isPositive?: boolean } = { cleanedPercent: 0 };
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

    return Array.from(latestExercisePairs).reduce(
      (bestImprovement, [name, { isPositive, cleanedPercent }], index) => {
        if (index === 0) {
          return { name, isPositive, percent: cleanedPercent };
        }
        if (isPositive === bestImprovement.isPositive) {
          if (!isPositive) {
            if (bestImprovement.percent > cleanedPercent) {
              return { name, percent: cleanedPercent, isPositive: false };
            }
            return bestImprovement;
          } else {
            if (bestImprovement.percent > cleanedPercent) {
              return bestImprovement;
            }
            return { name, percent: cleanedPercent, isPositive: true };
          }
        }
        if (isPositive !== bestImprovement.isPositive) {
          if (isPositive) {
            return { name, percent: cleanedPercent, isPositive };
          } else {
            return bestImprovement;
          }
        }
        return bestImprovement;
      },
      {} as { name: string; percent: number; isPositive?: boolean },
    );
  };
});

export const getPauseTime = createSelector([getExerciseMetaData], (metaData) => metaData.pause);
