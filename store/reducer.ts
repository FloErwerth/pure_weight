import { createAction, createReducer } from "@reduxjs/toolkit/src";
import type { AppState, DoneExerciseData, DoneWorkouts, ErrorFields, ExerciseMetaData, PlainExerciseData, WorkoutSortingType } from "./types";
import { getDateTodayIso } from "../utils/date";
import { ThemeKey } from "../theme/types";
import { Measurement } from "../components/App/measurements/types";
import { IsoDate } from "../types/date";
import { convertMeasurements } from "../components/App/measurements/utils";
import { Temporal } from "@js-temporal/polyfill";
import { emptyState, mockState } from "./mock";

const constructedDoneWorkouts: DoneWorkouts = [];
for (let i = 0; i < 100; i++) {
  const currentDate = new Date("2023-09-01");
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
      {
        name: "Butterfly",
        sets: [
          { weight: (Math.random() * 5 + i).toString(), reps: (Math.random() * 5 + i).toString() },
          { weight: (Math.random() * 5 + i).toString(), reps: (Math.random() * 5 + i).toString() },
          { weight: (Math.random() * 5 + i).toString(), reps: (Math.random() * 5 + i).toString() },
          { weight: (Math.random() * 5 + i).toString(), reps: (Math.random() * 5 + i).toString() },
          { weight: (Math.random() * 5 + i).toString(), reps: (Math.random() * 5 + i).toString() },
        ],
      },
    ],
  });
}

export const addMeasurement = createAction<{ measurement: Measurement; index?: number }>("measurement_add");
export const editMeasurement = createAction<{ measurement: Measurement; index: number }>("measurement_edit");
export const deleteMeasurement = createAction<number>("measurement_delete");
export const recoverMeasurement = createAction("measurement_recover");
export const recoverWorkout = createAction("workout_recover");
export const setTheme = createAction<ThemeKey>("theme_set");
export const setMockState = createAction("set_mock_state");
export const setFirstTimeRendered = createAction<boolean>("set_greeting");
export const setState = createAction<AppState>("set_state");
export const addTrainingDay = createAction<{ name: string; exercises: ExerciseMetaData[]; color: string }>("add_training_day");
export const editTrainingDay = createAction<{ name: string; exercises: ExerciseMetaData[]; color: string }>("edit_training_day");
export const overwriteTrainingDayExercises = createAction<ExerciseMetaData[]>("adjust_exercises");
export const removeTrainingDay = createAction<number>("remove_training_day");
export const setTrainingDayIndex = createAction<number>("set_training_index");
export const startTraining = createAction<number>("start_training");
export const addDoneWorkout = createAction<Array<{ exerciseIndex: number; note?: string; sets: Array<PlainExerciseData> }>>("set_training_data");
export const setSetIndex = createAction<number>("set_set_index");
export const setExerciseIndex = createAction<number>("set_exercise_index");
export const setLanguage = createAction<"de" | "en" | undefined>("settings_langauge");
export const setError = createAction<ErrorFields[]>("error_set");
export const cleanError = createAction<ErrorFields[]>("error_clean");
export const cleanErrors = createAction("error_clean_all");
export const setAppInstallDate = createAction<IsoDate>("set_app_install_date");
export const setWorkoutSorting = createAction<WorkoutSortingType>("workout_sort");
export const setHistorySorting = createAction<WorkoutSortingType>("history_sort");
export const storeReducer = createReducer<AppState>(emptyState, (builder) =>
  builder
    .addCase(setState, (state, action) => {
      return action.payload;
    })
    .addCase(setAppInstallDate, (state, action) => {
      state.appInstallDate = action.payload;
    })
    .addCase(setWorkoutSorting, (state, { payload }) => {
      state.workoutSorting = payload;
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
      if (state.workoutIndex !== undefined) {
        state.workouts[state.workoutIndex].exercises = action.payload;
      }
    })
    .addCase(addTrainingDay, (state, action) => {
      state.workouts.push({ name: action.payload.name, exercises: action.payload.exercises, calendarColor: action.payload.color, doneWorkouts: [] });
    })
    .addCase(setFirstTimeRendered, (state, action) => {
      state.isFirstTimeRendered = action.payload;
    })
    .addCase(editTrainingDay, (state, { payload: { name, exercises, color } }) => {
      if (state.workoutIndex !== undefined) {
        const editedDay = state.workouts[state.workoutIndex];
        state.workouts.splice(state.workoutIndex, 1, { ...editedDay, exercises, name, calendarColor: color });
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
    .addCase(addDoneWorkout, (state, action) => {
      const workoutIndex = state.workoutIndex;
      if (workoutIndex !== undefined) {
        const endTimestamp = Temporal.Now.instant().epochMilliseconds;
        const duration = (endTimestamp - (state?.workoutStartingTimestamp ?? endTimestamp)) / 1000;
        const dateToday = getDateTodayIso();
        const doneExercises: DoneExerciseData[] = [];
        action.payload.forEach(({ exerciseIndex, sets, note }) => {
          doneExercises.push({
            name: state.workouts[workoutIndex].exercises[exerciseIndex].name,
            sets,
            note,
          });
        });
        state.workouts[workoutIndex].doneWorkouts.push({
          date: dateToday,
          duration: duration.toString(),
          doneExercises,
        });
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
