import { createAction, createReducer } from "@reduxjs/toolkit/src";
import type {
    AppState,
    DoneExerciseData,
    ErrorFields,
    ExerciseMetaData,
    ExerciseMetaDataWithDoneEntries,
    Measurement,
    PlainExerciseData,
    TrainingDay
} from "./types";
import { getDateTodayIso } from "../utils/date";
import { mockState } from "./index";
export const addMeasurement = createAction<Measurement>("measurement_add")
export const setMockState = createAction("set_mock_state");
export const setFirstTimeRendered = createAction<boolean>("set_greeting");
export const setState = createAction<AppState>("set_state");
export const addTrainingDay = createAction<TrainingDay>("add_training_day");
export const editTrainingDay = createAction<{ index: number; trainingDay: TrainingDay }>("edit_training_day");
export const overwriteTrainingDayExercises = createAction<ExerciseMetaDataWithDoneEntries>("adjust_exercises");
export const removeTrainingDay = createAction<number>("remove_training_day");
export const setTrainingDayIndex = createAction<number | undefined>("edit_day");
export const addSetDataToTrainingDay = createAction<(PlainExerciseData | undefined)[][]>("set_training_data");
export const setSetIndex = createAction<number>("set_set_index");
export const setExerciseIndex = createAction<number>("set_exercise_index");
export const editExerciseMetaData = createAction<Partial<ExerciseMetaData>>("edit_exercise_metadata");
export const setLanguage = createAction<"de" | "en" | undefined>("settings_langauge");
export const setError = createAction<ErrorFields[]>("error_set");
export const cleanError = createAction<ErrorFields[]>("error_clean");
export const cleanErrors = createAction("error_clean_all");
export const storeReducer = createReducer<AppState>(
  { errors: [], measurements: [], settings: { language: undefined }, trainingDayIndex: 0, trainingDays: [], isFirstTimeRendered: true, exerciseIndex: 0, setIndex: 0 },
  (builder) =>
    builder
      .addCase(setState, (state, action) => {
        return action.payload;
      }).addCase(addMeasurement, (state, action) => {
        const possibleIndex = state.measurements.findIndex((measurement) => measurement.name === action.payload.name);
          if(possibleIndex >= 0) {
              const measurements = [...state.measurements];
              const measurement = state.measurements[possibleIndex];
              const newMeasurement = { name: measurement.name, unit: measurement.unit, data: { ...measurement.data, ...action.payload.data}}
              measurements.splice(possibleIndex, 1, newMeasurement);
              state.measurements = measurements;
          } else {
              const measurements = [...state.measurements];
              measurements.push(action.payload);
              state.measurements = measurements;
          }
          //sort here
        })
      .addCase(setMockState, () => mockState)
      .addCase(setError, (state, action) => {
        const notIncludedErrors = action.payload.filter((errorKey) => !state.errors.includes(errorKey));
        state.errors.push(...notIncludedErrors);
      })
      .addCase(cleanError, (state, action) => {
        state.errors = state.errors.filter((key) => !action.payload.includes(key));
      })
      .addCase(cleanErrors, (state) => {
        state.errors = [];
      })
      .addCase(overwriteTrainingDayExercises, (state, action) => {
        if (state.trainingDayIndex) {
          state.trainingDays[state.trainingDayIndex].exercises = action.payload;
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
      .addCase(setTrainingDayIndex, (state, action) => {
        state.trainingDayIndex = action.payload;
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
