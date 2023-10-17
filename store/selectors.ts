import { createSelector } from "@reduxjs/toolkit";
import { AppState, ExerciseMetaData, TrainingDay } from "./types";

export const getState = (state: AppState) => state;
export const getSavedTrainings = createSelector([getState], (state) => Array.from(state.trainingDays.values()).map((day) => day));
export const getEditedTrainingDayIndex = createSelector([getState], (state) => {
  return state.trainingDayIndex;
});
export const getEditedTrainingDay = createSelector([getSavedTrainings, getEditedTrainingDayIndex], (trainings, index) => {
  if (index !== undefined) {
    return trainings[index];
  }
  return undefined;
});
export const getSelectedTrainingDay = createSelector([getState], (state) => {
  if (state.trainingDayIndex !== undefined) {
    return state.trainingDays[state.trainingDayIndex];
  }
  return undefined;
});
export const getEditedExericseIndex = createSelector([getSelectedTrainingDay, getState], (day, state) => {
  if (state.editedExerciseIndex !== undefined) {
    return state.editedExerciseIndex;
  }
  return undefined;
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
  return traininigDay?.exercises[exerciseIndex];
});

export const getExerciseMetaDataRaw = createSelector([getExerciseMetaData], (metaData) => metaData as ExerciseMetaData);
export const getNumberOfSets = createSelector([getExerciseMetaDataRaw], (exerciseMetaDataRaw) => {
  if (exerciseMetaDataRaw?.sets) {
    return parseFloat(exerciseMetaDataRaw.sets);
  }
  return undefined;
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
