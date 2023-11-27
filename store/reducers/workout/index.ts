import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { DoneExerciseData, ExerciseMetaData, PlainExerciseData, Workout, WorkoutSortingType } from "../../types";
import { Temporal } from "@js-temporal/polyfill";
import { getDateTodayIso } from "../../../utils/date";

export type WorkoutState = {
    workouts: Workout[];
    workoutIndex: number;
    setIndex?: number;
    exerciseIndex: number;
    sorting: WorkoutSortingType;
    deletedWorkout?: { workout: Workout; index: number };
    workoutStartingTimestamp?: number;
};

export const startWorkout = createAction<number>("start_training");
export const overwriteExercise = createAction<ExerciseMetaData[]>("adjust_exercises");
export const recoverWorkout = createAction("workout_recover");
export const setWorkoutSorting = createAction<WorkoutSortingType>("workout_sort");
export const removeWorkout = createAction<number>("workout_remove");
export const setWorkoutIndex = createAction<number>("workout_index");
export const addWorkout = createAction<{ name: string; exercises: ExerciseMetaData[]; color: string }>("workout_add");
export const addDoneWorkout = createAction<Array<{ exerciseIndex: number; note?: string; sets: Array<PlainExerciseData> }>>("set_training_data");
export const editWorkout = createAction<{ name: string; exercises: ExerciseMetaData[]; color: string }>("workout_edit");
export const setSetIndex = createAction<number>("workout_set_index");
export const setExerciseIndex = createAction<number>("workout_exercise_index");
export const workoutReducer = createReducer<WorkoutState>({ workoutIndex: 0, workouts: [], sorting: "LONGEST_AGO", exerciseIndex: 0 }, (builder) => {
    builder
        .addCase(setWorkoutSorting, (state, { payload }) => {
            state.sorting = payload;
        })
        .addCase(recoverWorkout, (state) => {
            if (state.deletedWorkout?.index !== undefined && state.deletedWorkout?.workout) {
                state.workouts.splice(state.deletedWorkout.index, 0, state.deletedWorkout.workout);
            }
        })
        .addCase(overwriteExercise, (state, action) => {
            state.workouts[state.workoutIndex].exercises = action.payload;
        })
        .addCase(addWorkout, (state, action) => {
            state.workouts = [
                ...state.workouts,
                { name: action.payload.name, exercises: action.payload.exercises, calendarColor: action.payload.color, doneWorkouts: [] },
            ];
        })
        .addCase(removeWorkout, (state, action) => {
            const newTrainingDays = [...state.workouts];
            const deletedTrainingDay = newTrainingDays.splice(action.payload, 1);
            state.workouts = newTrainingDays;
            state.deletedWorkout = { index: action.payload, workout: deletedTrainingDay[0] };
        })
        .addCase(setWorkoutIndex, (state, action) => {
            state.workoutIndex = action.payload;
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
        .addCase(editWorkout, (state, { payload: { name, exercises, color } }) => {
            if (state.workoutIndex !== undefined) {
                const editedDay = state.workouts[state.workoutIndex];
                state.workouts.splice(state.workoutIndex, 1, { ...editedDay, exercises, name, calendarColor: color });
            }
        })
        .addCase(startWorkout, (state, action) => {
            state.workoutIndex = action.payload;
            state.workoutStartingTimestamp = Temporal.Now.instant().epochMilliseconds;
        });
});