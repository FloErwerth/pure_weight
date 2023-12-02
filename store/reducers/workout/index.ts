import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { DoneExerciseData, ExerciseMetaData, WeightBasedExerciseData, WeightBasedExerciseMetaData, Workout, WorkoutSortingType } from "../../types";
import { Temporal } from "@js-temporal/polyfill";
import { getDateTodayIso } from "../../../utils/date";
import { sortWorkouts } from "./utils";
import { TrainedWorkout, WorkoutState } from "./types";

export const setWorkoutState = createAction<WorkoutState, "workout_set_state">("workout_set_state");
export const setWorkouts = createAction<Workout[], "workout_set_workouts">("workout_set_workouts");
export const mutateEditedExercise = createAction<
    {
        key: keyof WeightBasedExerciseMetaData;
        value: string | undefined;
    },
    "exercise_edit_mutate"
>("exercise_edit_mutate");

export const setEditedWorkout = createAction<{ index: number }, "workout_set_edited_workout">("workout_set_edited_workout");
export const setEditedExercise = createAction<{ exercise?: ExerciseMetaData; index: number; isTrained?: boolean } | undefined, "workout_set_edited_exercise">("workout_set_edited_exercise");
export const deleteExerciseFromEditedWorkout = createAction<number, "workout_delete_exercise_from_edited_workout">("workout_delete_exercise_from_edited_workout");
export const storeEditedExercise = createAction("storeEditedExerciseInEditedWorkout");
export const startWorkout = createAction<number, "start_training">("start_training");
export const resetTrainedWorkout = createAction("reset_trained_workout");
export const saveNote = createAction<string | undefined, "save_note">("save_note");
export const setActiveExerciseIndex = createAction<number, "set_active_exercise_index">("set_active_exercise_index");
export const sortExercisesOnDragEnd = createAction<ExerciseMetaData[], "exercise_overwrite">("exercise_overwrite");
export const recoverWorkout = createAction("workout_recover");
export const setWorkoutSorting = createAction<WorkoutSortingType, "workout_sort">("workout_sort");
export const removeWorkout = createAction<number, "workout_remove">("workout_remove");
export const addWorkout = createAction<{ name: string; exercises: ExerciseMetaData[]; color: string }, "workout_add">("workout_add");
export const addDoneWorkout = createAction("set_training_data");
export const createNewExercise = createAction("workout_create_new_exercise");
export const createNewWorkout = createAction("workout_create_new_workout");
export const saveEditedWorkout = createAction("workout_save_edited_workout");
export const setEditedWorkoutName = createAction<string | undefined, "workout_set_edited_workout_name">("workout_set_edited_workout_name");
export const handleMutateSet = createAction<{ setIndex: number; key: keyof WeightBasedExerciseData; value?: string | boolean }, "handle_mutate_set">("handle_mutate_set");
export const markSetAsDone = createAction<{ setIndex: number }, "mark_set_as_done">("mark_set_as_done");
export const setActiveSetIndex = createAction<{ setIndex: number }, "set_active_set_index">("set_active_set_index");
export const setColor = createAction<string, "set_color">("set_color");

export type WorkoutAction =
    | typeof setEditedWorkout.type
    | typeof setWorkoutState.type
    | typeof mutateEditedExercise.type
    | typeof startWorkout.type
    | typeof sortExercisesOnDragEnd.type
    | typeof recoverWorkout.type
    | typeof setWorkoutSorting.type
    | typeof removeWorkout.type
    | typeof addWorkout.type
    | typeof addDoneWorkout.type
    | typeof setWorkouts.type
    | typeof saveEditedWorkout.type
    | typeof setEditedWorkoutName.type
    | typeof handleMutateSet.type
    | typeof markSetAsDone.type;

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
        .addCase(resetTrainedWorkout, (state) => (state.trainedWorkout = undefined))
        .addCase(saveNote, (state, action) => {
            if (state.trainedWorkout) {
                state.trainedWorkout.exerciseData[state.trainedWorkout.workoutIndex].note = action.payload;
            }
        })
        .addCase(setColor, (state, action) => {
            if (state.editedWorkout) {
                state.editedWorkout.workout.calendarColor = action.payload;
            }
        })
        .addCase(setEditedExercise, (state, action) => {
            if (action.payload === undefined) {
                state.editedWorkout = undefined;
            } else {
                if (action.payload.index !== undefined && action.payload.exercise) {
                    state.editedExercise = {
                        index: action.payload.index,
                        exercise: action.payload.exercise,
                        isTrained: action.payload.isTrained,
                    };
                }
                if (action.payload.index !== undefined) {
                    const workout = state.trainedWorkout?.workout ?? state.editedWorkout?.workout;
                    if (workout) {
                        state.editedExercise = { exercise: workout.exercises[action.payload.index], index: action.payload.index, isTrained: action.payload.isTrained };
                    }
                }
            }
        })
        .addCase(setActiveSetIndex, (state, action) => {
            if (state.trainedWorkout) {
                state.trainedWorkout.exerciseData[state.trainedWorkout.activeExerciseIndex].activeSetIndex = action.payload.setIndex;
            }
        })
        .addCase(handleMutateSet, (state, action) => {
            const trainedWorkout = state.trainedWorkout;
            if (trainedWorkout) {
                const doneSet = trainedWorkout.exerciseData[trainedWorkout.activeExerciseIndex].doneSets[action.payload.setIndex];
                trainedWorkout.exerciseData[trainedWorkout.activeExerciseIndex].doneSets[action.payload.setIndex] = { ...doneSet, [action.payload.key]: action.payload.value };
            }
        })
        .addCase(markSetAsDone, (state, action) => {
            const trainedWorkout = state.trainedWorkout;
            if (trainedWorkout) {
                const exerciseIndex = trainedWorkout.activeExerciseIndex;
                const doneSet = trainedWorkout.exerciseData[exerciseIndex].doneSets[action.payload.setIndex];
                const exercise = trainedWorkout.exerciseData[exerciseIndex];
                exercise.doneSets[action.payload.setIndex] = { ...doneSet, confirmed: true };
                exercise.setIndex += 1;
                exercise.activeSetIndex += 1;
                trainedWorkout.exerciseData[exerciseIndex] = exercise;
            }
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
            const storedWorkout = state.workouts[action.payload.index];
            state.editedWorkout = {
                workout: storedWorkout,
                index: action.payload.index,
            };
        })
        .addCase(storeEditedExercise, (state) => {
            const isTrained = state.editedExercise?.isTrained;
            const workout = isTrained ? state.trainedWorkout?.workout : state.editedWorkout?.workout;
            if (workout && state.editedWorkout && state.editedExercise) {
                const exercises = workout.exercises;
                if (state.editedExercise.index !== undefined) {
                    exercises.splice(state.editedExercise.index, 1, state.editedExercise.exercise);
                } else {
                    exercises.push(state.editedExercise.exercise);
                }
                if (isTrained && state.trainedWorkout?.workout) {
                    state.trainedWorkout.workout.exercises = exercises;
                    state.trainedWorkout.exerciseData[state.trainedWorkout.activeExerciseIndex].doneSets.map((data) => {
                        if (!data.confirmed) {
                            return { filled: false, reps: state.editedExercise?.exercise.reps, weight: state.editedExercise?.exercise.weight };
                        }
                        return data;
                    });
                }
                if (!isTrained && state.editedWorkout?.workout) {
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
                    isTrained: state.editedExercise.isTrained,
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
        .addCase(addDoneWorkout, (state) => {
            const workout = state.trainedWorkout;
            const workoutIndex = state.trainedWorkout?.workoutIndex;
            if (workout && workoutIndex !== undefined) {
                const endTimestamp = Temporal.Now.instant().epochMilliseconds;
                const duration = (endTimestamp - (workout?.workoutStartingTimestamp ?? endTimestamp)) / 1000;
                const dateToday = getDateTodayIso();
                const doneExercises: DoneExerciseData[] = workout.exerciseData.map((data) => ({ name: data.name, sets: data.doneSets, note: data.note }));
                state.workouts[workoutIndex].doneWorkouts.push({
                    date: dateToday,
                    duration: duration.toString(),
                    doneExercises,
                });
            }
            state.trainedWorkout = undefined;
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
        .addCase(setActiveExerciseIndex, (state, action) => {
            if (state.trainedWorkout?.activeExerciseIndex !== undefined) {
                state.trainedWorkout.activeExerciseIndex = action.payload;
            }
        })
        .addCase(startWorkout, (state, action) => {
            const workout = state.workouts[action.payload];
            state.trainedWorkout = {
                activeExerciseIndex: 0,
                workout,
                workoutStartingTimestamp: Temporal.Now.instant().epochMilliseconds,
                workoutIndex: action.payload,
                exerciseData: Array(workout.exercises.length)
                    .fill(undefined)
                    .map((_, exerciseIndex) => {
                        const metaData = workout?.exercises[exerciseIndex];
                        const prefilledMetaData: TrainedWorkout["exerciseData"][number] = {
                            name: metaData?.name ?? "",
                            activeSetIndex: 0,
                            setIndex: 0,
                            doneSets: [],
                            note: "",
                        };
                        return prefilledMetaData;
                    }),
            };
        });
});
