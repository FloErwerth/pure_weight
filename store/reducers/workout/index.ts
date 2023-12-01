import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { DoneExerciseData, ExerciseMetaData, WeightBasedExerciseData, WeightBasedExerciseMetaData, Workout, WorkoutSortingType } from "../../types";
import { Temporal } from "@js-temporal/polyfill";
import { getDateTodayIso } from "../../../utils/date";
import { sortWorkouts } from "./utils";

export type EditedWorkout = {
    workout: Workout;
    index?: number;
};

export type EditedExercise = {
    exercise: ExerciseMetaData;
    index?: number;
};

export type TrainedWorkout = {
    workoutIndex: number;
    workout: Workout;
    doneExerciseData: DoneExerciseData[][];
};

export type WorkoutState = {
    workouts: Workout[];
    sorting: WorkoutSortingType;
    deletedWorkout?: { workout: Workout; index: number };
    deletedExercise?: { exercise: ExerciseMetaData; index: number };
    workoutStartingTimestamp?: number;
    editedWorkout?: EditedWorkout;
    trainedWorkout?: TrainedWorkout;
    editedExercise?: EditedExercise;
};

export const setWorkoutState = createAction<WorkoutState, "workout_set_state">("workout_set_state");
export const setWorkouts = createAction<Workout[], "workout_set_workouts">("workout_set_workouts");
export const mutateEditedExercise = createAction<
    {
        key: keyof WeightBasedExerciseMetaData;
        value: string | undefined;
    },
    "exercise_edit_mutate"
>("exercise_edit_mutate");

export const setEditedWorkout = createAction<WorkoutState["editedWorkout"], "workout_set_edited_workout">("workout_set_edited_workout");
export const setEditedExercise = createAction<WorkoutState["editedExercise"], "workout_set_edited_exercise">("workout_set_edited_exercise");
export const deleteExerciseFromEditedWorkout = createAction<number, "workout_delete_exercise_from_edited_workout">("workout_delete_exercise_from_edited_workout");
export const storeEditedExerciseInEditedWorkout = createAction("storeEditedExerciseInEditedWorkout");
export const startWorkout = createAction<number, "start_training">("start_training");
export const sortExercisesOnDragEnd = createAction<ExerciseMetaData[], "exercise_overwrite">("exercise_overwrite");
export const recoverWorkout = createAction("workout_recover");
export const setWorkoutSorting = createAction<WorkoutSortingType, "workout_sort">("workout_sort");
export const removeWorkout = createAction<number, "workout_remove">("workout_remove");
export const setWorkoutIndex = createAction<number, "workout_index">("workout_index");
export const addWorkout = createAction<{ name: string; exercises: ExerciseMetaData[]; color: string }, "workout_add">("workout_add");
export const addDoneWorkout = createAction<Array<{ exerciseIndex: number; note?: string; sets: Array<WeightBasedExerciseData> }>, "set_training_data">("set_training_data");
export const createNewExercise = createAction("workout_create_new_exercise");
export const createNewWorkout = createAction("workout_create_new_workout");
export const saveEditedWorkout = createAction("workout_save_edited_workout");
export const setEditedWorkoutName = createAction<string | undefined, "workout_set_edited_workout_name">("workout_set_edited_workout_name");

export type WorkoutAction =
    | typeof setEditedWorkout.type
    | typeof setWorkoutState.type
    | typeof mutateEditedExercise.type
    | typeof startWorkout.type
    | typeof sortExercisesOnDragEnd.type
    | typeof recoverWorkout.type
    | typeof setWorkoutSorting.type
    | typeof removeWorkout.type
    | typeof setWorkoutIndex.type
    | typeof addWorkout.type
    | typeof addDoneWorkout.type
    | typeof setWorkouts.type
    | typeof saveEditedWorkout.type
    | typeof setEditedWorkoutName.type;

export const emptyExercise: ExerciseMetaData = {
    name: "",
    type: "WEIGHT_BASED",
    sets: "",
    pause: "",
    reps: "",
    weight: "",
};

export const workoutReducer = createReducer<WorkoutState>({ workouts: [], sorting: "LONGEST_AGO" }, (builder) => {
    builder
        .addCase(setWorkoutState, (_, { payload }) => payload)
        .addCase(setEditedExercise, (state, action) => {
            state.editedExercise = action.payload;
        })
        .addCase(setEditedWorkoutName, (state, action) => {
            const workout = state.editedWorkout?.workout;
            if (workout) {
                state.editedWorkout = { workout: { ...workout, name: action.payload ?? "" }, index: state.editedWorkout?.index };
            }
        })
        .addCase(createNewWorkout, (state) => {
            state.editedWorkout = {
                workout: {
                    name: "",
                    exercises: [],
                    doneWorkouts: [],
                    calendarColor: "#333",
                },
            };
        })
        .addCase(setWorkouts, (state, action) => {
            state.workouts = sortWorkouts(action.payload, state.sorting);
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
                if (state.editedExercise.index !== undefined) {
                    exercises.splice(state.editedExercise.index, 1, state.editedExercise.exercise);
                } else {
                    exercises.push(state.editedExercise.exercise);
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
            state.workouts = sortWorkouts(state.workouts, state.sorting);
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
        .addCase(sortExercisesOnDragEnd, (state, action) => {
            if (state.editedWorkout?.workout) {
                const editedWorkout = state.editedWorkout;
                state.editedWorkout = { index: editedWorkout.index, workout: { ...editedWorkout.workout, exercises: action.payload } };
            }
        })
        .addCase(addWorkout, (state, action) => {
            state.workouts = sortWorkouts(
                [...state.workouts, { name: action.payload.name, exercises: action.payload.exercises, calendarColor: action.payload.color, doneWorkouts: [] }],
                state.sorting,
            );
        })
        .addCase(removeWorkout, (state, action) => {
            const newWorkouts = [...state.workouts];
            const deletedTrainingDay = newWorkouts.splice(action.payload, 1);
            state.workouts = sortWorkouts(newWorkouts, state.sorting);
            state.deletedWorkout = { index: action.payload, workout: deletedTrainingDay[0] };
        })
        .addCase(addDoneWorkout, (state, action) => {
            const workoutIndex = state.editedWorkout?.index;
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
        .addCase(saveEditedWorkout, (state) => {
            if (state.editedWorkout !== undefined) {
                const newWorkouts: Workout[] = [...state.workouts];
                if (state.editedWorkout.index !== undefined) {
                    newWorkouts.splice(state.editedWorkout.index, 1, state.editedWorkout.workout);
                } else {
                    newWorkouts.push(state.editedWorkout.workout);
                }
                state.workouts = sortWorkouts(newWorkouts, state.sorting);
            }
        })
        .addCase(startWorkout, (state, action) => {
            const workout = state.workouts[action.payload];
            const prefilledExerciseData = Array(workout.exercises.length)
                .fill(undefined)
                .map((_, index) => {
                    const metaData = workout.exercises[index];
                    const numberOfSets = parseFloat(workout.exercises[index].sets ?? "0");
                    return Array(numberOfSets).fill({ weight: metaData.weight, reps: metaData.reps, filled: false }) as DoneExerciseData[];
                }) as DoneExerciseData[][];

            state.trainedWorkout = {
                workout,
                workoutIndex: action.payload,
                doneExerciseData: prefilledExerciseData,
            };
            state.workoutStartingTimestamp = Temporal.Now.instant().epochMilliseconds;
        });
});
