import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { DoneExerciseData, ExerciseMetaData, PlainExerciseData, TimeBasedExerciseMetaData, WeightBasedExerciseMetaData, Workout, WorkoutSortingType } from "../../types";
import { Temporal } from "@js-temporal/polyfill";
import { getDateTodayIso } from "../../../utils/date";

export type WorkoutState = {
    workouts: Workout[];
    workoutIndex: number;
    setIndex?: number;
    exerciseIndex: number;
    sorting: WorkoutSortingType;
    deletedWorkout?: { workout: Workout; index: number };
    deletedExercise?: { exercise: ExerciseMetaData; index: number };
    workoutStartingTimestamp?: number;
    editedWorkout?: {
        workout: Workout;
        index?: number;
    };
    editedExercise?: {
        exercise: ExerciseMetaData;
        index?: number;
    };
};

export const setWorkoutState = createAction<WorkoutState, "workout_set_state">("workout_set_state");
export const mutateEditedExercise = createAction<
    {
        key: keyof WeightBasedExerciseMetaData | keyof TimeBasedExerciseMetaData;
        value: string | undefined;
    },
    "exercise_edit_mutate"
>("exercise_edit_mutate");

export const setEditedWorkout = createAction<WorkoutState["editedWorkout"], "workout_set_edited_workout">("workout_set_edited_workout");
export const setEditedExercise = createAction<WorkoutState["editedExercise"], "workout_set_edited_exercise">("workout_set_edited_exercise");
export const deleteExerciseFromEditedWorkout = createAction<number, "workout_delete_exercise_from_edited_workout">("workout_delete_exercise_from_edited_workout");
export const storeEditedExerciseInEditedWorkout = createAction("storeEditedExerciseInEditedWorkout");
export const startWorkout = createAction<number, "start_training">("start_training");
export const overwriteExercise = createAction<ExerciseMetaData[], "exercise_overwrite">("exercise_overwrite");
export const recoverWorkout = createAction("workout_recover");
export const setWorkoutSorting = createAction<WorkoutSortingType, "workout_sort">("workout_sort");
export const removeWorkout = createAction<number, "workout_remove">("workout_remove");
export const setWorkoutIndex = createAction<number, "workout_index">("workout_index");
export const addWorkout = createAction<{ name: string; exercises: ExerciseMetaData[]; color: string }, "workout_add">("workout_add");
export const addDoneWorkout = createAction<Array<{ exerciseIndex: number; note?: string; sets: Array<PlainExerciseData> }>, "set_training_data">("set_training_data");
export const createNewExercise = createAction("workout_create_new_exercise");

export type WorkoutAction =
    | typeof setEditedWorkout.type
    | typeof setWorkoutState.type
    | typeof mutateEditedExercise.type
    | typeof startWorkout.type
    | typeof overwriteExercise.type
    | typeof recoverWorkout.type
    | typeof setWorkoutSorting.type
    | typeof removeWorkout.type
    | typeof setWorkoutIndex.type
    | typeof addWorkout.type
    | typeof addDoneWorkout.type;

export const emptyExercise: ExerciseMetaData = {
    name: "",
    type: "WEIGHT_BASED",
    sets: "",
    pause: "",
    reps: "",
    weight: "",
};

export const editWorkout = createAction<{ name: string; exercises: ExerciseMetaData[]; color: string }, "workout_edit">("workout_edit");
export const workoutReducer = createReducer<WorkoutState>({ workoutIndex: 0, workouts: [], sorting: "LONGEST_AGO", exerciseIndex: 0 }, (builder) => {
    builder
        .addCase(setWorkoutState, (_, { payload }) => payload)
        .addCase(setEditedExercise, (state, action) => {
            state.editedExercise = action.payload;
        })
        .addCase(createNewExercise, (state) => {
            state.editedExercise = { exercise: emptyExercise };
        })
        .addCase(setEditedWorkout, (state, action) => {
            state.editedWorkout = action.payload;
        })
        .addCase(storeEditedExerciseInEditedWorkout, (state) => {
            if (state.editedWorkout && state.editedExercise) {
                const exercises = state.editedWorkout.workout.exercises;
                if (state.editedExercise.index) {
                    exercises.splice(state.editedExercise.index, 0, state.editedExercise.exercise);
                } else {
                    if (state.editedExercise.exercise) {
                        exercises.push(state.editedExercise.exercise);
                    }
                    state.editedWorkout.workout.exercises = exercises;
                }
            }
        })
        .addCase(deleteExerciseFromEditedWorkout, (state, action) => {
            if (state.editedWorkout && state.editedWorkout.workout.exercises) {
                const exercises = [...state.editedWorkout.workout.exercises];
                state.deletedExercise = { exercise: exercises.splice(action.payload, 1)[0], index: action.payload };
                state.editedWorkout.workout.exercises = exercises;
            }
        })
        .addCase(setWorkoutSorting, (state, { payload }) => {
            state.sorting = payload;
        })
        .addCase(mutateEditedExercise, (state, action) => {
            if (state.editedExercise) {
                state.editedExercise = {
                    index: state.editedExercise.index,
                    exercise: { ...state.editedExercise.exercise, [action.payload.key]: action.payload.value },
                };
            }
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
            state.workouts = [...state.workouts, { name: action.payload.name, exercises: action.payload.exercises, calendarColor: action.payload.color, doneWorkouts: [] }];
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
