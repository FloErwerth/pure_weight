import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { SortingType } from "../../types";
import { Temporal } from "@js-temporal/polyfill";
import { sortWorkouts } from "./sortWorkouts";
import { DoneExerciseData, ExerciseData, ExerciseMetaData, ExerciseType, TimeInput, TrainedWorkout, Workout, WorkoutState } from "./types";
import { getRandomColorFromPalette } from "../../../utils/colorPalette";
import { getDateTodayIso } from "../../../utils/date";

export const setWorkoutState = createAction<WorkoutState, "workout_set_state">("workout_set_state");
export const setWorkouts = createAction<Workout[], "workout_set_workouts">("workout_set_workouts");
export const mutateEditedExercise = createAction<
    {
        key: keyof ExerciseMetaData;
        value: string | undefined;
    },
    "exercise_edit_mutate"
>("exercise_edit_mutate");
export const mutateActiveExerciseInTrainedWorkout = createAction<
    { key: keyof TrainedWorkout["exerciseData"][number]; value: TrainedWorkout["exerciseData"][number][keyof TrainedWorkout["exerciseData"][number]] },
    "exercise_edit_mutate_active_exercise"
>("exercise_edit_mutate_active_exercise");
export const mutateEditedExerciseTimeValue = createAction<
    {
        key: "pause" | "duration" | "preparation";
        value: TimeInput;
    },
    "exercise_edit_mutate_pause"
>("exercise_edit_mutate_pause");

export const setEditedWorkout = createAction<{ workoutId: number }, "workout_set_edited_workout">("workout_set_edited_workout");
export const setEditedExercise = createAction<{ exercise?: ExerciseMetaData; index: number; isTrained?: boolean } | undefined, "workout_set_edited_exercise">("workout_set_edited_exercise");
export const deleteExerciseFromEditedWorkout = createAction<number, "workout_delete_exercise_from_edited_workout">("workout_delete_exercise_from_edited_workout");
export const storeEditedExercise = createAction("storeEditedExerciseInEditedWorkout");
export const startWorkout = createAction<number, "start_training">("start_training");
export const resetTrainedWorkout = createAction("reset_trained_workout");
export const saveNote = createAction<string | undefined, "save_note">("save_note");
export const setActiveExerciseIndex = createAction<number, "set_active_exercise_index">("set_active_exercise_index");
export const sortExercisesOnDragEnd = createAction<ExerciseMetaData[], "exercise_overwrite">("exercise_overwrite");
export const recoverWorkout = createAction("workout_recover");
export const recoverExercise = createAction("exercise_recover");
export const setWorkoutSorting = createAction<SortingType, "workout_sort">("workout_sort");
export const removeWorkout = createAction<number, "workout_remove">("workout_remove");
export const addDoneWorkout = createAction("set_training_data");
export const createNewExercise = createAction("workout_create_new_exercise");
export const createNewWorkout = createAction("workout_create_new_workout");
export const saveEditedWorkout = createAction<boolean | undefined, "workout_save_edited_workout">("workout_save_edited_workout");
export const setEditedWorkoutName = createAction<string | undefined, "workout_set_edited_workout_name">("workout_set_edited_workout_name");
export const handleMutateSet = createAction<{ setIndex: number; key: keyof ExerciseData; value?: ExerciseData[keyof ExerciseData]; type: ExerciseType }, "handle_mutate_set">("handle_mutate_set");

export const markSetAsDone = createAction<{ setIndex: number }, "mark_set_as_done">("mark_set_as_done");
export const setIsActiveSet = createAction<{ setIndex: number }, "set_is_active_set">("set_is_active_set");
export const setColor = createAction<string, "set_color">("set_color");
export const pauseTrainedWorkout = createAction("pause_trained_workout");
export const mutateDoneExercise = createAction<{
    doneWorkoutId: number;
    doneExerciseId: number;
    setIndex: number;
    key: keyof ExerciseData;
    value: ExerciseData[keyof ExerciseData];
}>("mutate_done_exercise");

export const discardChangesToDoneExercises = createAction<{ doneWorkoutId: number }>("discardChangesToDoneExercises");
export const deleteFallbackSets = createAction<{ doneWorkoutId: number }>("deleteFallbackSets");

export type WorkoutAction =
    | typeof setEditedWorkout.type
    | typeof setWorkoutState.type
    | typeof mutateEditedExercise.type
    | typeof startWorkout.type
    | typeof sortExercisesOnDragEnd.type
    | typeof recoverWorkout.type
    | typeof setWorkoutSorting.type
    | typeof removeWorkout.type
    | typeof addDoneWorkout.type
    | typeof setWorkouts.type
    | typeof saveEditedWorkout.type
    | typeof setEditedWorkoutName.type
    | typeof handleMutateSet.type
    | typeof markSetAsDone.type
    | typeof mutateEditedExerciseTimeValue.type;

export const emptyExercise: ExerciseMetaData = {
    exerciseId: Date.now(),
    name: "",
    type: "WEIGHT_BASED",
    sets: "0",
    reps: "0",
    weight: "0",
    duration: {
        seconds: "0",
        minutes: "0",
    },
    pause: {
        seconds: "0",
        minutes: "0",
    },
    preparation: {
        seconds: "0",
        minutes: "0",
    },
};

export const workoutReducer = createReducer<WorkoutState>({ workouts: [], sorting: "LONGEST_AGO" }, (builder) => {
    builder
        .addCase(setWorkoutState, (_, { payload }) => payload)
        .addCase(resetTrainedWorkout, (state) => (state.trainedWorkout = undefined))
        .addCase(saveNote, (state, action) => {
            if (state.trainedWorkout) {
                state.trainedWorkout.exerciseData[state.trainedWorkout.activeExerciseIndex].note = action.payload;
            }
        })
        .addCase(pauseTrainedWorkout, (state) => {
            if (state.trainedWorkout) {
                state.trainedWorkout.paused = true;
            }
        })
        .addCase(mutateActiveExerciseInTrainedWorkout, (state, action) => {
            if (state.trainedWorkout) {
                const exerciseData = state.trainedWorkout.exerciseData[state.trainedWorkout.activeExerciseIndex];
                state.trainedWorkout.exerciseData[state.trainedWorkout.activeExerciseIndex] = {
                    ...exerciseData,
                    [action.payload.key]: action.payload.value,
                };
            }
        })
        .addCase(setColor, (state, action) => {
            if (state.editedWorkout) {
                state.editedWorkout.workout.calendarColor = action.payload;
            }
        })
        .addCase(recoverExercise, (state) => {
            const workout = state.editedWorkout?.workout;
            if (state.deletedExercise !== undefined && workout) {
                workout.exercises.splice(state.deletedExercise.index, 0, state.deletedExercise.exercise);
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
        .addCase(handleMutateSet, (state, action) => {
            const trainedWorkout = state.trainedWorkout;
            if (trainedWorkout) {
                const doneSet = trainedWorkout.exerciseData[trainedWorkout.activeExerciseIndex].doneSets[action.payload.setIndex];
                const exercise = trainedWorkout.exerciseData[trainedWorkout.activeExerciseIndex];
                exercise.exerciseType = action.payload.type;
                exercise.doneSets[action.payload.setIndex] = { ...doneSet, [action.payload.key]: action.payload.value };
                trainedWorkout.exerciseData[trainedWorkout.activeExerciseIndex] = exercise;
            }
        })
        .addCase(markSetAsDone, (state, action) => {
            const trainedWorkout = state.trainedWorkout;
            if (trainedWorkout) {
                const exerciseIndex = trainedWorkout.activeExerciseIndex;
                const doneSet = trainedWorkout.exerciseData[exerciseIndex].doneSets[action.payload.setIndex];
                const exercise = trainedWorkout.exerciseData[exerciseIndex];
                if (action.payload.setIndex === exercise.latestSetIndex || action.payload.setIndex === exercise.activeSetIndex) {
                    exercise.doneSets[action.payload.setIndex] = { ...doneSet, confirmed: true };
                    exercise.setIndex += 1;
                    if (exercise.activeSetIndex !== exercise.latestSetIndex) {
                        exercise.activeSetIndex = exercise.latestSetIndex;
                    } else {
                        exercise.activeSetIndex += 1;
                        exercise.latestSetIndex += 1;
                    }
                    trainedWorkout.exerciseData[exerciseIndex] = exercise;
                }
            }
        })
        .addCase(setIsActiveSet, (state, action) => {
            const trainedWorkout = state.trainedWorkout;
            if (trainedWorkout) {
                const exerciseIndex = trainedWorkout.activeExerciseIndex;
                const exercise = trainedWorkout.exerciseData[exerciseIndex];
                exercise.activeSetIndex = action.payload.setIndex;
                trainedWorkout.exerciseData[exerciseIndex] = exercise;
            }
        })

        .addCase(setEditedWorkoutName, (state, action) => {
            const workout = state.editedWorkout?.workout;
            if (workout) {
                state.editedWorkout = { ...state.editedWorkout, isNew: state.editedWorkout?.isNew ?? false, workout: { ...workout, name: action.payload ?? "" } };
            }
        })
        .addCase(createNewWorkout, (state) => {
            state.editedWorkout = {
                isNew: true,
                workout: {
                    workoutId: Date.now(),
                    name: "",
                    exercises: [],
                    doneWorkouts: [],
                    calendarColor: getRandomColorFromPalette(),
                },
            };
        })
        .addCase(setWorkouts, (state, action) => {
            state.workouts = action.payload;
        })
        .addCase(createNewExercise, (state) => {
            state.editedExercise = { exercise: emptyExercise };
        })
        .addCase(setEditedWorkout, (state, action) => {
            const storedWorkout = state.workouts.find((workout) => workout.workoutId === action.payload?.workoutId);
            if (storedWorkout) {
                state.editedWorkout = {
                    isNew: false,
                    workout: storedWorkout,
                };
            }
        })
        .addCase(storeEditedExercise, (state) => {
            const isTrained = Boolean(state.editedExercise?.isTrained);
            const storedWorkout = isTrained ? state.trainedWorkout : state.editedWorkout;
            if (storedWorkout && state.editedExercise) {
                const exercises = storedWorkout.workout.exercises;
                if (state.editedExercise.index !== undefined) {
                    exercises.splice(state.editedExercise.index, 1, state.editedExercise.exercise);
                    if (isTrained && state.trainedWorkout?.workout) {
                        storedWorkout.workout.exercises = exercises;
                        state.trainedWorkout.exerciseData[state.editedExercise?.index].doneSets.map((data) => {
                            if (!data.confirmed) {
                                return { filled: false, reps: state.editedExercise?.exercise.reps, weight: state.editedExercise?.exercise.weight };
                            }
                            return data;
                        });
                    }
                    if (!isTrained && state.editedWorkout?.workout) {
                        state.editedWorkout.workout.exercises = exercises;
                    }
                } else {
                    exercises.push(state.editedExercise.exercise);
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
        .addCase(mutateEditedExerciseTimeValue, (state, action) => {
            if (state.editedExercise) {
                state.editedExercise = {
                    index: state.editedExercise.index,
                    exercise: {
                        ...state.editedExercise.exercise,
                        [action.payload.key]: action.payload.value,
                    },
                    isTrained: state.editedExercise.isTrained,
                };
            }
        })
        .addCase(recoverWorkout, (state) => {
            if (state.deletedWorkout?.workout) {
                if (state.deletedWorkout.trainedWorkout) {
                    state.trainedWorkout = state.deletedWorkout.trainedWorkout;
                }
                state.workouts.push(state.deletedWorkout.workout);
            }
        })
        .addCase(sortExercisesOnDragEnd, (state, action) => {
            if (state.editedWorkout?.workout) {
                const editedWorkout = state.editedWorkout;
                state.editedWorkout = { isNew: state.editedWorkout.isNew ?? false, workout: { ...editedWorkout.workout, exercises: action.payload } };
            }
        })
        .addCase(removeWorkout, (state, action) => {
            const newWorkouts = [...state.workouts];
            const deletedWorkoutIndex = state.workouts.findIndex((workout) => workout.workoutId === action.payload);
            const deletedTrainingDay = newWorkouts.splice(deletedWorkoutIndex, 1);
            const wasPaused = state.trainedWorkout?.workout.workoutId === deletedWorkoutIndex;

            state.deletedWorkout = { workout: deletedTrainingDay[0], trainedWorkout: wasPaused ? state.trainedWorkout : undefined };
            if (wasPaused) {
                state.trainedWorkout = undefined;
            }
            state.workouts = newWorkouts;
        })
        .addCase(addDoneWorkout, (state) => {
            const workout = state.trainedWorkout;
            const workoutIndex = state.trainedWorkout?.workout.workoutId;
            if (workout && workoutIndex !== undefined) {
                const beginTimestamp = workout.beginTimestamp;
                const endTimestamp = Temporal.Now.instant().epochMilliseconds;
                const duration = (endTimestamp - beginTimestamp) / 1000;
                const doneExercises: DoneExerciseData[] = workout.exerciseData.map((data) => ({
                    doneExerciseId: Date.now(),
                    name: data.name,
                    sets: data.doneSets,
                    note: data.note,
                    type: data.exerciseType,
                    originalExerciseId: data.originalExerciseId,
                }));
                state.workouts
                    .find((workout) => workout.workoutId === workoutIndex)
                    ?.doneWorkouts.push({
                        doneWorkoutId: Date.now(),
                        isoDate: getDateTodayIso(),
                        duration: duration.toString(),
                        doneExercises,
                    });
            }
            state.trainedWorkout = undefined;
        })
        .addCase(saveEditedWorkout, (state, action) => {
            if (state.editedWorkout !== undefined) {
                if (state.editedWorkout.isNew) {
                    state.workouts = [...state.workouts, state.editedWorkout.workout];
                } else {
                    if (state.trainedWorkout?.workout.workoutId === state.editedWorkout.workout.workoutId) {
                        state.trainedWorkout.workout = state.editedWorkout.workout;
                    }
                    state.workouts.splice(
                        state.workouts.findIndex((workout) => workout.workoutId === state.editedWorkout?.workout?.workoutId),
                        1,
                        state.editedWorkout.workout,
                    );
                }
            }
            if (action.payload) {
                return;
            }
            state.editedWorkout = undefined;
        })
        .addCase(setActiveExerciseIndex, (state, action) => {
            if (state.trainedWorkout?.activeExerciseIndex !== undefined) {
                state.trainedWorkout.activeExerciseIndex = action.payload;
            }
        })
        .addCase(startWorkout, (state, action) => {
            const workout = state.workouts.find((workout) => workout.workoutId === action.payload);
            if (workout) {
                state.trainedWorkout = {
                    paused: false,
                    activeExerciseIndex: 0,
                    workout,
                    beginTimestamp: Temporal.Now.instant().epochMilliseconds,
                    exerciseData: Array(workout.exercises.length)
                        .fill(undefined)
                        .map((_, exerciseIndex) => {
                            const metaData = workout?.exercises[exerciseIndex];
                            const prefilledMetaData: TrainedWorkout["exerciseData"][number] = {
                                exerciseType: "WEIGHT_BASED",
                                originalExerciseId: metaData?.exerciseId ?? 0,
                                name: metaData?.name ?? "",
                                activeSetIndex: 0,
                                latestSetIndex: 0,
                                setIndex: 0,
                                doneSets: [],
                                note: "",
                                canSnap: true,
                            };
                            return prefilledMetaData;
                        }),
                };
            }
        })
        .addCase(mutateDoneExercise, (state, action) => {
            if (state.editedWorkout && state.editedWorkout.workout.doneWorkouts) {
                const doneWorkoutIndex = state.editedWorkout.workout.doneWorkouts.findIndex((doneWorkout) => doneWorkout.doneWorkoutId === action.payload.doneWorkoutId);
                const doneWorkout = state.editedWorkout.workout.doneWorkouts[doneWorkoutIndex];
                if (doneWorkout && doneWorkout.doneExercises) {
                    const doneExerciseIndex = doneWorkout.doneExercises.findIndex((doneExercise) => doneExercise.doneExerciseId === action.payload.doneExerciseId);
                    const doneExercise = doneWorkout.doneExercises[doneExerciseIndex];
                    if (doneExercise) {
                        if (!doneExercise.fallbackSets) {
                            doneExercise.fallbackSets = [...doneExercise.sets];
                        }
                        console.log(doneExercise.sets[action.payload.setIndex]);
                        doneExercise.sets[action.payload.setIndex] = { ...doneExercise.sets[action.payload.setIndex], [action.payload.key]: action.payload.value };
                    }
                    doneWorkout.doneExercises[doneExerciseIndex] = doneExercise;
                }
                state.editedWorkout.workout.doneWorkouts[doneWorkoutIndex] = doneWorkout;
            }
        })
        .addCase(discardChangesToDoneExercises, (state, action) => {
            if (state.editedWorkout && state.editedWorkout.workout.doneWorkouts) {
                const doneWorkoutIndex = state.editedWorkout.workout.doneWorkouts.findIndex((doneWorkout) => doneWorkout.doneWorkoutId === action.payload.doneWorkoutId);
                const doneWorkout = state.editedWorkout.workout.doneWorkouts[doneWorkoutIndex];
                if (doneWorkout && doneWorkout.doneExercises) {
                    doneWorkout.doneExercises = doneWorkout.doneExercises.map((doneExercise) => {
                        if (doneExercise.fallbackSets) {
                            doneExercise.sets = doneExercise.fallbackSets;
                            delete doneExercise.fallbackSets;
                        }
                        return doneExercise;
                    });
                }
                state.editedWorkout.workout.doneWorkouts[doneWorkoutIndex] = doneWorkout;
            }
        })
        .addCase(deleteFallbackSets, (state, action) => {
            if (state.editedWorkout && state.editedWorkout.workout.doneWorkouts) {
                const doneWorkoutIndex = state.editedWorkout.workout.doneWorkouts.findIndex((doneWorkout) => doneWorkout.doneWorkoutId === action.payload.doneWorkoutId);
                const doneWorkout = state.editedWorkout.workout.doneWorkouts[doneWorkoutIndex];
                if (doneWorkout && doneWorkout.doneExercises) {
                    doneWorkout.doneExercises = doneWorkout.doneExercises.map((doneExercise) => {
                        if (doneExercise.fallbackSets) {
                            delete doneExercise.fallbackSets;
                        }
                        return doneExercise;
                    });
                }
                state.editedWorkout.workout.doneWorkouts[doneWorkoutIndex] = doneWorkout;
            }
        });
});
