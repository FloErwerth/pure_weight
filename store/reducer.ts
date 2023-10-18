import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { AppState, DoneExerciseData, ErrorFields, ExerciseMetaData, PlainExerciseData, TrainingDay } from "./types";
import { getDateTodayIso } from "../utils/date";
import { ChartType } from "../app/progress/chart/components/ExerciseCharts";
import { mockState } from "./index";

export const setChartType = createAction<ChartType>("set_chart_type");
export const setMockState = createAction("set_mock_state");
export const setFirstTimeRendered = createAction<boolean>("set_greeting");
export const setState = createAction<AppState>("set_state");
export const addTrainingDay = createAction<TrainingDay>("add_training_day");
export const editTrainingDay = createAction<{ index: number; trainingDay: TrainingDay }>("edit_training_day");
export const adjustTrainingDayExercises = createAction<{ from: number; to: number }>("adjust_exercises");
export const setEditedExercise = createAction<number | undefined>("edit_exercise");
export const removeTrainingDay = createAction<number>("remove_training_day");
export const setSelectedDay = createAction<number | undefined>("edit_day");
export const addSetDataToTrainingDay = createAction<(PlainExerciseData | undefined)[][]>("set_training_data");
export const setSetIndex = createAction<number>("set_set_index");
export const setExerciseIndex = createAction<number>("set_exercise_index");
export const editExerciseMetaData = createAction<Partial<ExerciseMetaData>>("edit_exercise_metadata");
export const setLanguage = createAction<"de" | "en" | undefined>("settings_langauge");
export const setError = createAction<ErrorFields | ErrorFields[]>("error_set");
export const cleanError = createAction<ErrorFields | ErrorFields[]>("error_clean");
export const cleanErrors = createAction("error_clean_all");
export const storeReducer = createReducer<AppState>(
  { errors: [], settings: { language: undefined }, chartType: "CUMULATIVE", trainingDayIndex: 0, trainingDays: [], isFirstTimeRendered: true, exerciseIndex: 0, setIndex: 0 },
  (builder) =>
    builder
      .addCase(setState, (state, action) => {
        return action.payload;
      })
      .addCase(setMockState, () => mockState)
      .addCase(setChartType, (state, action) => {
        state.chartType = action.payload;
      })
      .addCase(setError, (state, action) => {
        if (typeof action.payload === "string" && !state.errors.includes(action.payload)) {
          state.errors.push(action.payload);
        }
        if (Array.isArray(action.payload)) {
          const notIncludedErrors = action.payload.filter((errorKey) => !state.errors.includes(errorKey));
          state.errors.push(...notIncludedErrors);
        }
      })
      .addCase(cleanError, (state, action) => {
        if (typeof action.payload === "string" && state.errors.includes(action.payload)) {
          state.errors.splice(
            state.errors.findIndex((key) => key === action.payload),
            1,
          );
        }
        if (Array.isArray(action.payload)) {
          state.errors.filter((key) => !action.payload.includes(key));
        }
      })
      .addCase(cleanErrors, (state) => {
        state.errors = [];
      })
      .addCase(adjustTrainingDayExercises, (state, action) => {
        if (state.trainingDayIndex) {
          const newExercises = [...state.trainingDays[state.trainingDayIndex].exercises];
          const toExercise = newExercises[action.payload.to];
          newExercises.splice(action.payload.to, 1, newExercises[action.payload.from]);
          newExercises.splice(action.payload.from, 1, toExercise);
        }
      })
      .addCase(addTrainingDay, (state, action) => {
        state.trainingDays.push(action.payload);
      })
      .addCase(setFirstTimeRendered, (state, action) => {
        state.isFirstTimeRendered = action.payload;
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
      .addCase(addSetDataToTrainingDay, (state, action) => {
        if (state.trainingDays && state.trainingDayIndex !== undefined && state.exerciseIndex !== undefined) {
          const dateToday = getDateTodayIso();
          for (let exerciseIndex = 0; exerciseIndex < state.trainingDays[state.trainingDayIndex].exercises.length; exerciseIndex++) {
            const currentSetData: DoneExerciseData = state.trainingDays[state.trainingDayIndex]?.exercises[exerciseIndex]?.doneExerciseEntries ?? {};
            if (action.payload[exerciseIndex]) {
              currentSetData[dateToday] = action.payload[exerciseIndex]?.reduce((obj = {}, entry, index) => ({ ...obj, [index]: entry }), {});
            }
          }
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
      })
      .addCase(setLanguage, (state, action) => {
        state.settings.language = action.payload;
      }),
);
