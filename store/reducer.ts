import { createAction, createReducer } from "@reduxjs/toolkit/src";
import type { AppState, ErrorFields, ExerciseMetaData, ExerciseMetaDataWithDoneEntries, Measurement, PlainExerciseData, TrainingDay } from "./types";
import { getDateTodayIso } from "../utils/date";
import { ThemeKey } from "../theme/types";

export const mockState: AppState = {
  measurements: [
    { name: "Körpergewicht", unit: "kg", data: { ["2023-10-11"]: "85" } },
    { name: "Körperfettanteil", unit: "%", data: { ["2023-10-11"]: "15" } },
  ],
  theme: "dark",
  setIndex: 0,
  settings: { language: "en" },
  trainingDayIndex: undefined,
  isFirstTimeRendered: true,
  exerciseIndex: 0,
  errors: [],
  trainingDays: [
    {
      name: "Brust 1",
      exercises: [
        {
          name: "Bankdrücken",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: [
            {
              date: "2023-01-01",
              sets: [
                { reps: "1", weight: "1" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
              ],
            },
            {
              date: "2023-01-02",
              sets: [
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
              ],
            },
            {
              date: "2023-01-03",
              sets: [
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
              ],
            },
            {
              date: "2023-01-04",
              sets: [
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
              ],
            },
            {
              date: "2023-01-05",
              sets: [
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
              ],
            },
            {
              date: "2023-01-06",
              sets: [
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
              ],
            },
            {
              date: "2023-01-07",
              sets: [
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
              ],
            },
            {
              date: "2023-01-08",
              sets: [
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
              ],
            },
            {
              date: "2023-01-09",
              sets: [
                { reps: "1", weight: "1" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
              ],
            },
          ],
        },
        {
          name: "Butterfly",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: [
            {
              date: "2023-01-01",
              sets: [
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Brust 2",
      exercises: [
        {
          name: "Bankdrücken",
          weight: "50",
          sets: "3",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: [],
        },
        {
          name: "Butterfly",
          weight: "40",
          sets: "3",
          reps: "6",
          pause: " 2",
          doneExerciseEntries: [],
        },
      ],
    },
  ],
};
export const emptyState: AppState = {
  measurements: [],
  exerciseIndex: 0,
  errors: [],
  settings: { language: "en" },
  trainingDayIndex: undefined,
  trainingDays: [],
  setIndex: 0,
  isFirstTimeRendered: false,
  theme: "light",
};

export const addMeasurement = createAction<Measurement>("measurement_add");
export const setTheme = createAction<ThemeKey>("theme_set");
export const setMockState = createAction("set_mock_state");
export const setFirstTimeRendered = createAction<boolean>("set_greeting");
export const setState = createAction<AppState>("set_state");
export const addTrainingDay = createAction<TrainingDay>("add_training_day");
export const editTrainingDay = createAction<{ index: number; trainingDay: TrainingDay }>("edit_training_day");
export const overwriteTrainingDayExercises = createAction<ExerciseMetaDataWithDoneEntries>("adjust_exercises");
export const removeTrainingDay = createAction<number>("remove_training_day");
export const setTrainingDayIndex = createAction<number | undefined>("edit_day");
export const addSetDataToTrainingDay = createAction<Array<{ note?: string; sets: Array<PlainExerciseData> }>>("set_training_data");
export const setSetIndex = createAction<number>("set_set_index");
export const setExerciseIndex = createAction<number>("set_exercise_index");
export const editExerciseMetaData = createAction<Partial<ExerciseMetaData>>("edit_exercise_metadata");
export const setLanguage = createAction<"de" | "en" | undefined>("settings_langauge");
export const setError = createAction<ErrorFields[]>("error_set");
export const cleanError = createAction<ErrorFields[]>("error_clean");
export const cleanErrors = createAction("error_clean_all");
export const storeReducer = createReducer<AppState>(emptyState, (builder) =>
  builder
    .addCase(setState, (state, action) => {
      return action.payload;
    })
    .addCase(addMeasurement, (state, action) => {
      const possibleIndex = state.measurements.findIndex((measurement) => measurement.name === action.payload.name);
      if (possibleIndex >= 0) {
        const measurements = [...state.measurements];
        const measurement = state.measurements[possibleIndex];
        const newMeasurement = { name: measurement.name, unit: measurement.unit, data: { ...measurement.data, ...action.payload.data } };
        measurements.splice(possibleIndex, 1, newMeasurement);
        state.measurements = measurements;
      } else {
        const measurements = [...state.measurements];
        measurements.push(action.payload);
        state.measurements = measurements;
      }
      //sort here
    })
    .addCase(setTheme, (state, action) => {
      state.theme = action.payload;
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
          if (action.payload[exerciseIndex] === undefined) {
            return;
          }

          const existingData = state.trainingDays[state.trainingDayIndex]?.exercises[exerciseIndex]?.doneExerciseEntries;
          (existingData ?? []).push({
            date: dateToday,
            sets: action.payload[exerciseIndex].sets,
            note: action.payload[exerciseIndex].note,
          });
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
