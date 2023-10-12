import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { AppState, ExerciseMetaData, ExerciseSets, TrainingDay } from "./types";

export const setState = createAction<AppState>("set_state");
export const addTrainingDay = createAction<TrainingDay>("add_training_day");
export const editTrainingDay = createAction<{ index: number; trainingDay: TrainingDay }>("edit_training_day");
export const setEditedExercise = createAction<number | undefined>("edit_exercise");
export const removeTrainingDay = createAction<number>("remove_training_day");
export const setSelectedDay = createAction<number | undefined>("edit_day");
export const addExerciseDataEntry = createAction<ExerciseSets>("set_training_data");
export const setSetIndex = createAction<number>("set_set_index");
export const setExerciseIndex = createAction<number>("set_exercise_index");
export const editExerciseMetaData = createAction<Partial<ExerciseMetaData>>("edit_exercise_metadata");
export const storeReducer = createReducer<AppState>({ trainingDayIndex: 0, trainingDays: [], exerciseIndex: 0, setIndex: 0 }, (builder) =>
  builder
    .addCase(setState, (state, action) => {
      return action.payload;
    })
    .addCase(addTrainingDay, (state, action) => {
      state.trainingDays.push(action.payload);
    })
    .addCase(editTrainingDay, (state, action) => {
      state.trainingDays.splice(action.payload.index, 1, action.payload.trainingDay);
    })
    .addCase(removeTrainingDay, (state, action) => {
      state.trainingDays.splice(action.payload, 1);
    })
    .addCase(setSelectedDay, (state, action) => {
      state.trainingDayIndex = action.payload;
    })
    .addCase(setEditedExercise, (state, action) => {
      state.editedExerciseIndex = action.payload;
    })
    .addCase(addExerciseDataEntry, (state, action) => {
      if (state.trainingDays && state.trainingDayIndex !== undefined && state.exerciseIndex !== undefined) {
        const data = state.trainingDays[state.trainingDayIndex]?.exercises[state.exerciseIndex]?.doneExerciseEntries;
        const numberOfEntries = Object.keys(data).length;
        data[numberOfEntries] = action.payload;
      }
    })
    .addCase(setSetIndex, (state, action) => {
      state.setIndex = action.payload;
    })
    .addCase(setExerciseIndex, (state, action) => {
      state.exerciseIndex = action.payload;
    })
    .addCase(editExerciseMetaData, (state, action) => {
      if (state.trainingDays && state.trainingDayIndex !== undefined && state.trainingDays[state.trainingDayIndex].exercises !== undefined && state.exerciseIndex !== undefined) {
        state.trainingDays[state.trainingDayIndex].exercises[state.exerciseIndex] = { ...state.trainingDays[state.trainingDayIndex].exercises[state.exerciseIndex], ...action.payload };
      }
    }),
);
