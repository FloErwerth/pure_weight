import { createAction, createReducer } from "@reduxjs/toolkit/src";
import type { AppState, ErrorFields, ExerciseMetaData, ExerciseMetaDataWithDoneEntries, PlainExerciseData, TrainingDay } from "./types";
import { getDateTodayIso } from "../utils/date";
import { ThemeKey } from "../theme/types";
import { Measurement } from "../components/App/measurements/types";

export const mockState: AppState = {
  measurements: [
    { name: "Körpergewicht", unit: "kg", data: { ["2023-10-11"]: "85", ["2023-10-12"]: "86" } },
    { name: "Körperfettanteil", unit: "%", data: { ["2023-10-11"]: "15", ["2023-10-12"]: "16" } },
    { name: "Körperfettanteil1", unit: "%", data: { ["2023-10-11"]: "15", ["2023-10-12"]: "16" } },
    { name: "Körperfettanteil2", unit: "%", data: { ["2023-10-11"]: "15", ["2023-10-12"]: "16" } },
    { name: "Körperfettanteil3", unit: "%", data: { ["2023-10-11"]: "15", ["2023-10-12"]: "16" } },
    { name: "Körperfettanteil4", unit: "%", data: { ["2023-10-11"]: "15", ["2023-10-12"]: "16" } },
    { name: "Körperfettanteil5", unit: "%", data: { ["2023-10-11"]: "15", ["2023-10-12"]: "16" } },
    { name: "Körperfettanteil6", unit: "%", data: { ["2023-10-11"]: "15", ["2023-10-12"]: "16" } },
    { name: "Körperfettanteil7", unit: "%", data: { ["2023-10-11"]: "15", ["2023-10-12"]: "16" } },
    { name: "Körperfettanteil8", unit: "%", data: { ["2023-10-11"]: "15", ["2023-10-12"]: "16" } },
    { name: "Körperfettanteil9", unit: "%", data: { ["2023-10-11"]: "15", ["2023-10-12"]: "16" } },
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
      latestDate: "2023-01-01",
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
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
                { reps: "5", weight: "50" },
              ],
            },
            {
              date: "2023-01-02",
              sets: [
                { reps: "5", weight: "51" },
                { reps: "5", weight: "51" },
                { reps: "5", weight: "51" },
                { reps: "5", weight: "51" },
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
                { reps: "5", weight: "50" },
              ],
            },
            {
              date: "2023-01-02",
              sets: [
                { reps: "5", weight: "51" },
                { reps: "5", weight: "51" },
                { reps: "5", weight: "51" },
                { reps: "5", weight: "51" },
                { reps: "5", weight: "52" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Brust 2",
      latestDate: "2023-01-01",
      exercises: [
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
                { reps: "10", weight: "1" },
                { reps: "10", weight: "1" },
                { reps: "10", weight: "1" },
                { reps: "10", weight: "1" },
                { reps: "10", weight: "1" },
              ],
            },
            {
              date: "2023-01-02",
              sets: [
                { reps: "10", weight: "1" },
                { reps: "10", weight: "1" },
                { reps: "10", weight: "1" },
                { reps: "10", weight: "1" },
                { reps: "10", weight: "2" },
              ],
            },
            {
              date: "2023-01-03",
              sets: [
                { reps: "10", weight: "1" },
                { reps: "10", weight: "1" },
                { reps: "10", weight: "1" },
                { reps: "10", weight: "1" },
                { reps: "10", weight: "3" },
              ],
            },
          ],
        },
      ],
    },
  ],
  latestDeletions: {},
};
export const emptyState: AppState = {
  measurements: [],
  latestDeletions: {},
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
export const deleteMeasurement = createAction<number>("measurement_delete");
export const recoverMeasurement = createAction("measurement_recover");
export const recoverWorkout = createAction("workout_recover");
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
    })
    .addCase(deleteMeasurement, (state, action) => {
      const newMeasurements = [...state.measurements];
      const deletedMeasurement = newMeasurements.splice(action.payload, 1);
      state.latestDeletions = { ...state.latestDeletions, measurement: { index: action.payload, data: deletedMeasurement[0] } };
      state.measurements = newMeasurements;
    })
    .addCase(recoverMeasurement, (state) => {
      if (state.latestDeletions.measurement?.index !== undefined && state.latestDeletions.measurement?.data) {
        state.measurements.splice(state.latestDeletions.measurement.index, 0, state.latestDeletions.measurement.data);
      }
    })
    .addCase(recoverWorkout, (state) => {
      if (state.latestDeletions.trainingDay?.index !== undefined && state.latestDeletions.trainingDay?.data) {
        state.trainingDays.splice(state.latestDeletions.trainingDay.index, 0, state.latestDeletions.trainingDay.data);
      }
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
      const newTrainingDays = [...state.trainingDays];
      const deletedTrainingDay = newTrainingDays.splice(action.payload, 1);
      state.trainingDays = newTrainingDays;
      state.latestDeletions = { ...state.latestDeletions, trainingDay: { index: action.payload, data: deletedTrainingDay[0] } };
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
          state.trainingDays[state.trainingDayIndex].latestDate = dateToday;
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
