import { createSelector } from "@reduxjs/toolkit";
import { AppState, ExerciseMetaData, TrainingDay } from "./types";

export const getState = (state: AppState) => state;
export const getSavedTrainings = createSelector([getState], (state) => Array.from(state.trainingDays.values()).map((day) => day));
export const getSelectedTrainingDayIndex = createSelector([getState], (state) => state.trainingDayIndex);
export const getSelectedTrainingDay = createSelector([getSavedTrainings, getSelectedTrainingDayIndex], (trainings, index) => {
  if (index !== undefined) {
    return trainings[index];
  }
  return undefined;
});
export const getNumberOfExercises = createSelector([getSelectedTrainingDay], (day) => {
  return day?.exercises.length;
});
export const getExerciseNames = createSelector([getSelectedTrainingDay], (day) => {
  return day?.exercises.map((exercise) => exercise.name);
});
export const getIsFirstTimeRendered = createSelector([getState], (state) => state.isFirstTimeRendered);
export const getSelectedTrainingName = createSelector([getSelectedTrainingDay], (day) => day?.name);
export const getSetIndex = createSelector([getState], (state) => state.setIndex ?? 0);
export const getExerciseIndex = createSelector([getState], (state) => state.exerciseIndex);
export const getTrainingIndex = createSelector([getState], (state) => state.trainingDayIndex);
export const getPreviousTraining = createSelector([getSelectedTrainingDay, getExerciseIndex], (traininigDay, exerciseIndex) => {
  const entries = Object.values(traininigDay?.exercises[exerciseIndex]?.doneExerciseEntries ?? {});
  return Object.values(entries[entries.length - 1] ?? []);
});

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
export const getTrainingDayData = createSelector([getState], (state) => {
  return state.trainingDays.reduce((days, day) => {
    const exerciseEntries = day.exercises.filter((exercise) => Object.values(exercise.doneExerciseEntries).length > 1);
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
