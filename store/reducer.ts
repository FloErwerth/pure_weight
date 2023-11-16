import { createAction, createReducer } from "@reduxjs/toolkit/src";
import type { AppState, DoneWorkouts, ErrorFields, ExerciseMetaData, PlainExerciseData } from "./types";
import { getDateTodayIso } from "../utils/date";
import { ThemeKey } from "../theme/types";
import { Measurement } from "../components/App/measurements/types";
import { IsoDate } from "../types/date";
import { convertMeasurements } from "../components/App/measurements/utils";
import { Temporal } from "@js-temporal/polyfill";

const constructedDoneWorkouts: DoneWorkouts = [];
for (let i = 0; i < 100; i++) {
  const currentDate = new Date(getDateTodayIso());
  currentDate.setDate(currentDate.getDate() + i);
  const dateStr = currentDate.toISOString().split("T")[0];
  constructedDoneWorkouts.push({
    date: dateStr as IsoDate,
    duration: (i * 100).toString(),
    doneExercises: [
      {
        name: "Bankdrücken",
        sets: [
          { weight: (i * 5).toString(), reps: "5" },
          { weight: (i * 5).toString(), reps: "5" },
          { weight: (i * 5).toString(), reps: "5" },
          { weight: (i * 5).toString(), reps: "5" },
          { weight: (i * 5).toString(), reps: "5" },
        ],
      },
    ],
  });
}

export const mockState: AppState = {
  appInstallDate: "2023-09-01",
  measurements: [
    {
      name: "Körpergewicht",
      unit: "kg",
      data: { ["2023-10-11"]: "15", ["2023-10-12"]: "16", ["2023-10-13"]: "17", ["2023-10-14"]: "18", ["2023-10-15"]: "20", ["2023-10-16"]: "19", ["2023-10-17"]: "23" },
      higherIsBetter: true,
    },
    {
      name: "Körperfettanteil",
      unit: "%",
      data: { ["2023-10-11"]: "15", ["2023-10-12"]: "16", ["2023-10-13"]: "17", ["2023-10-14"]: "18", ["2023-10-15"]: "20", ["2023-10-16"]: "19", ["2023-10-17"]: "23" },
    },
  ],
  theme: "dark",
  setIndex: 0,
  settings: { language: "en" },
  workoutIndex: undefined,
  isFirstTimeRendered: true,
  exerciseIndex: 0,
  errors: [],
  workouts: [
    {
      name: "Brust 1",
      exercises: [
        { name: "Bankdrücken", weight: "50", sets: "5", pause: "2", reps: "5" },
        { name: "Butterfly", weight: "42.5", sets: "4", pause: "2", reps: "8" },
      ],
      doneWorkouts: constructedDoneWorkouts,
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
  workoutIndex: undefined,
  workouts: [],
  setIndex: 0,
  isFirstTimeRendered: false,
  theme: "light",
};

export const addMeasurement = createAction<{ measurement: Measurement; index?: number }>("measurement_add");
export const editMeasurement = createAction<{ measurement: Measurement; index: number }>("measurement_edit");
export const deleteMeasurement = createAction<number>("measurement_delete");
export const recoverMeasurement = createAction("measurement_recover");
export const recoverWorkout = createAction("workout_recover");
export const setTheme = createAction<ThemeKey>("theme_set");
export const setMockState = createAction("set_mock_state");
export const setFirstTimeRendered = createAction<boolean>("set_greeting");
export const setState = createAction<AppState>("set_state");
export const addTrainingDay = createAction<{ name: string; exercises: ExerciseMetaData[] }>("add_training_day");
export const editTrainingDay = createAction<{ name: string; exercises: ExerciseMetaData[] }>("edit_training_day");
export const overwriteTrainingDayExercises = createAction<ExerciseMetaData[]>("adjust_exercises");
export const removeTrainingDay = createAction<number>("remove_training_day");
export const setTrainingDayIndex = createAction<number | undefined>("set_training_index");
export const startTraining = createAction<number>("start_training");
export const addSetDataToTrainingDay = createAction<Array<{ note?: string; sets: Array<PlainExerciseData> }>>("set_training_data");
export const setSetIndex = createAction<number>("set_set_index");
export const setExerciseIndex = createAction<number>("set_exercise_index");
export const setLanguage = createAction<"de" | "en" | undefined>("settings_langauge");
export const setError = createAction<ErrorFields[]>("error_set");
export const cleanError = createAction<ErrorFields[]>("error_clean");
export const cleanErrors = createAction("error_clean_all");
export const setAppInstallDate = createAction<IsoDate>("set_app_install_date");
export const storeReducer = createReducer<AppState>(emptyState, (builder) =>
  builder
    .addCase(setState, (state, action) => {
      return action.payload;
    })
    .addCase(setAppInstallDate, (state, action) => {
      state.appInstallDate = action.payload;
    })
    .addCase(editMeasurement, (state, action) => {
      const measurements = [...state.measurements];
      const previouisMeasurement = measurements[action.payload.index];
      const newData = measurements[action.payload.index].data;
      if (previouisMeasurement.unit && newData && action.payload.measurement.unit !== previouisMeasurement.unit) {
        const convertedMeasurements = convertMeasurements(previouisMeasurement.unit, newData);
        measurements.splice(action.payload.index, 1, { ...action.payload.measurement, data: convertedMeasurements });
      } else {
        measurements.splice(action.payload.index, 1, action.payload.measurement);
      }

      state.measurements = measurements;
    })
    .addCase(addMeasurement, (state, action) => {
      if (action.payload.index !== undefined) {
        const measurements = [...state.measurements];
        const measurement = state.measurements[action.payload.index];
        const newMeasurement = { ...action.payload.measurement, data: { ...measurement.data, ...action.payload.measurement.data } };
        measurements.splice(action.payload.index, 1, newMeasurement);
        state.measurements = measurements;
      } else {
        const measurements = [...state.measurements];
        measurements.push(action.payload.measurement);
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
        state.workouts.splice(state.latestDeletions.trainingDay.index, 0, state.latestDeletions.trainingDay.data);
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
      if (state.workoutIndex) {
        state.workouts[state.workoutIndex].exercises = action.payload;
      }
    })
    .addCase(addTrainingDay, (state, action) => {
      state.workouts.push({ name: action.payload.name, exercises: action.payload.exercises, doneWorkouts: [] });
    })
    .addCase(setFirstTimeRendered, (state, action) => {
      state.isFirstTimeRendered = action.payload;
    })
    .addCase(editTrainingDay, (state, { payload: { name, exercises } }) => {
      if (state.workoutIndex) {
        const editedDay = state.workouts[state.workoutIndex];
        state.workouts.splice(state.workoutIndex, 1, { ...editedDay, exercises, name });
      }
    })
    .addCase(removeTrainingDay, (state, action) => {
      const newTrainingDays = [...state.workouts];
      const deletedTrainingDay = newTrainingDays.splice(action.payload, 1);
      state.workouts = newTrainingDays;
      state.latestDeletions = { ...state.latestDeletions, trainingDay: { index: action.payload, data: deletedTrainingDay[0] } };
    })
    .addCase(setTrainingDayIndex, (state, action) => {
      state.workoutIndex = action.payload;
    })
    .addCase(startTraining, (state, action) => {
      state.workoutIndex = action.payload;
      state.workoutStartingTimestamp = Temporal.Now.instant().epochMilliseconds;
    })
    .addCase(addSetDataToTrainingDay, (state, action) => {
      if (state.workouts && state.workoutIndex !== undefined && state.exerciseIndex !== undefined) {
        const dateToday = getDateTodayIso();
        for (let exerciseIndex = 0; exerciseIndex < state.workouts[state.workoutIndex].doneWorkouts?.length; exerciseIndex++) {
          if (action.payload[exerciseIndex] === undefined) {
            return;
          }
          const existingData = state.workouts[state.workoutIndex]?.doneWorkouts[exerciseIndex]?.doneExercises;
          (existingData ?? []).push({
            name: state.workouts[state.workoutIndex]?.exercises[exerciseIndex].name,
            sets: action.payload[exerciseIndex].sets,
            note: action.payload[exerciseIndex].note,
          });
        }
        if (state.workoutStartingTimestamp) {
          const endTimestamp = Temporal.Now.instant().epochMilliseconds;
          const seconds = (endTimestamp - state.workoutStartingTimestamp) / 1000;
          state.workouts[state.workoutIndex].doneWorkouts[state.exerciseIndex].duration = seconds.toString();
        }

        state.workouts[state.workoutIndex].doneWorkouts[state.exerciseIndex].date = dateToday;
      }
    })
    .addCase(setSetIndex, (state, action) => {
      state.setIndex = action.payload;
    })
    .addCase(setExerciseIndex, (state, action) => {
      state.exerciseIndex = action.payload;
    })
    .addCase(setLanguage, (state, action) => {
      state.settings.language = action.payload;
    }),
);
