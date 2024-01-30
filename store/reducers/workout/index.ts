import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { SortingType } from "../../types";
import { Temporal } from "@js-temporal/polyfill";
import { sortWorkouts } from "./sortWorkouts";
import { DoneExerciseData, ExerciseData, ExerciseId, ExerciseMetaData, ExerciseType, TemplateId, TimeInput, TrainedWorkout, Workout, WorkoutId, WorkoutState } from "./types";
import { getRandomColorFromPalette } from "../../../utils/colorPalette";
import { getDateTodayIso } from "../../../utils/date";
import { getMillisecondsFromTimeInput, getMinutesSecondsFromMilliseconds } from "../../../utils/timeDisplay";
import { generateId } from "../../../utils/generateId";

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

export const setEditedWorkout = createAction<{ workoutId: WorkoutId }, "workout_set_edited_workout">("workout_set_edited_workout");
export const setEditedExercise = createAction<{ exerciseId: ExerciseId } | undefined, "workout_set_edited_exercise">("workout_set_edited_exercise");
export const deleteExerciseFromEditedWorkout = createAction<number, "workout_delete_exercise_from_edited_workout">("workout_delete_exercise_from_edited_workout");
export const saveEditedExercise = createAction("storeEditedExerciseInEditedWorkout");
export const startWorkout = createAction<WorkoutId, "start_training">("start_training");
export const resetTrainedWorkout = createAction("reset_trained_workout");
export const saveNote = createAction<string | undefined, "save_note">("save_note");
export const setActiveExerciseIndex = createAction<number, "set_active_exercise_index">("set_active_exercise_index");
export const sortExercisesOnDragEnd = createAction<ExerciseMetaData[], "exercise_overwrite">("exercise_overwrite");
export const recoverWorkout = createAction("workout_recover");
export const recoverExercise = createAction("exercise_recover");
export const setWorkoutSorting = createAction<SortingType, "workout_sort">("workout_sort");
export const removeWorkout = createAction<WorkoutId, "workout_remove">("workout_remove");
export const saveCurrentWorkout = createAction("set_training_data");
export const createNewExercise = createAction("workout_create_new_exercise");
export const createNewWorkout = createAction("workout_create_new_workout");
export const saveEditedWorkout = createAction<boolean | undefined, "workout_save_edited_workout">("workout_save_edited_workout");
export const setEditedWorkoutName = createAction<string | undefined, "workout_set_edited_workout_name">("workout_set_edited_workout_name");
export const handleMutateSet = createAction<{ setIndex: number; key: keyof ExerciseData; value?: ExerciseData[keyof ExerciseData]; type: ExerciseType }, "handle_mutate_set">("handle_mutate_set");

export const markSetAsDone = createAction<{ setIndex: number }, "mark_set_as_done">("mark_set_as_done");
export const setIsActiveSet = createAction<{ setIndex: number }, "set_is_active_set">("set_is_active_set");
export const setColor = createAction<string, "set_color">("set_color");
export const pauseTrainedWorkout = createAction("pause_trained_workout");
export const resumeTrainedWorkout = createAction("resume_trained_workout");
export const cleanupDurationValues = createAction("cleanup_duration_values");
export const mutateDoneExercise = createAction<{
    doneWorkoutId: WorkoutId;
    doneExerciseId: ExerciseId;
    setIndex: number;
    key: keyof ExerciseData;
    value: ExerciseData[keyof ExerciseData];
}>("mutate_done_exercise");

export const discardChangesToDoneExercises = createAction<{ doneWorkoutId: WorkoutId }>("discardChangesToDoneExercises");
export const deleteFallbackSets = createAction<{ doneWorkoutId: WorkoutId }>("deleteFallbackSets");
export const saveExerciseAsTemplate = createAction<{ overwrite?: boolean }>("save_exercise_as_template");
export const applyTemplateToEditedExercise = createAction<{ templateId: TemplateId }>("applyTemplateToEditedExercise");
export const updateTemplate = createAction("updateTemplate");

export type WorkoutAction =
    | typeof setEditedWorkout.type
    | typeof setWorkoutState.type
    | typeof mutateEditedExercise.type
    | typeof startWorkout.type
    | typeof sortExercisesOnDragEnd.type
    | typeof recoverWorkout.type
    | typeof setWorkoutSorting.type
    | typeof removeWorkout.type
    | typeof saveCurrentWorkout.type
    | typeof setWorkouts.type
    | typeof saveEditedWorkout.type
    | typeof setEditedWorkoutName.type
    | typeof handleMutateSet.type
    | typeof markSetAsDone.type
    | typeof mutateEditedExerciseTimeValue.type;

export const emptyExercise: ExerciseMetaData = {
    exerciseId: generateId("exercise"),
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
                state.trainedWorkout.pauseTimestamps = [...(state.trainedWorkout.pauseTimestamps ?? []), { begin: Date.now(), end: 0 }];
            }
        })
        .addCase(resumeTrainedWorkout, (state) => {
            if (state.trainedWorkout && state.trainedWorkout.pauseTimestamps) {
                state.trainedWorkout.pauseTimestamps[state.trainedWorkout.pauseTimestamps.length - 1].end = Date.now();
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
            } else if (action.payload.exerciseId) {
                const workout = state.trainedWorkout?.workout ?? state.editedWorkout?.workout;
                const exercise = workout?.exercises?.find((exercise) => exercise.exerciseId === action.payload?.exerciseId);
                if (exercise) {
                    state.editedExercise = {
                        exercise,
                    };
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
                    workoutId: generateId("workout"),
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
        .addCase(saveEditedExercise, (state) => {
            if (state.editedExercise) {
                //save in specific workout
                if (state.trainedWorkout) {
                    const trainedWorkoutExerciseIndex = state.trainedWorkout.exerciseData.findIndex((data) => data.originalExerciseId === state.editedExercise?.exercise.exerciseId);
                    state.trainedWorkout.workout.exercises.splice(trainedWorkoutExerciseIndex, 1, state.editedExercise.exercise);
                    state.trainedWorkout.exerciseData[trainedWorkoutExerciseIndex].doneSets.map((data) => {
                        if (!data.confirmed) {
                            return { filled: false, reps: state.editedExercise?.exercise.reps, weight: state.editedExercise?.exercise.weight };
                        }
                        return data;
                    });
                } else if (state.editedWorkout) {
                    const exerciseIndex = state.editedWorkout.workout.exercises.findIndex((exercise) => exercise.exerciseId === state.editedExercise?.exercise.exerciseId);
                    if (exerciseIndex !== -1) {
                        state.editedWorkout.workout.exercises.splice(exerciseIndex, 1, state.editedExercise.exercise);
                    } else {
                        state.editedWorkout.workout.exercises.push(state.editedExercise.exercise);
                    }
                }

                //save in general workouts
                const id = state.trainedWorkout?.workout.workoutId ?? state.editedWorkout?.workout.workoutId;
                const workoutIndex = state.workouts.findIndex((workout) => workout.workoutId === id);
                if (workoutIndex !== -1) {
                    const workoutExerciseIndex = state.workouts[workoutIndex].exercises.findIndex((exercise) => exercise.exerciseId === state.editedExercise?.exercise.exerciseId) ?? -1;
                    state.workouts[workoutIndex]?.exercises.splice(workoutExerciseIndex, 1, state.editedExercise.exercise);
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
            const deletedWorkout = state.workouts.find((workout) => workout.workoutId === action.payload);
            const deletedWorkoutIndex = state.workouts.findIndex((workout) => workout.workoutId === action.payload);
            const deletedTrainingDay = newWorkouts.splice(deletedWorkoutIndex, 1);
            const wasPaused = state.trainedWorkout?.workout.workoutId === deletedWorkout?.workoutId;

            state.deletedWorkout = { workout: deletedTrainingDay[0], trainedWorkout: wasPaused ? state.trainedWorkout : undefined };
            if (wasPaused) {
                state.trainedWorkout = undefined;
            }
            state.workouts = newWorkouts;
        })
        .addCase(saveCurrentWorkout, (state) => {
            const workout = state.trainedWorkout;
            const workoutIndex = state.trainedWorkout?.workout.workoutId;
            if (workout && workoutIndex !== undefined) {
                const beginTimestamp = workout.beginTimestamp;
                const endTimestamp = Temporal.Now.instant().epochMilliseconds;
                const pausedDuration = workout.pauseTimestamps?.reduce((acc, curr) => acc + (curr.end - curr.begin), 0) ?? 0;
                const duration = endTimestamp - beginTimestamp - pausedDuration;
                const doneExercises: DoneExerciseData[] = workout.exerciseData.map((data) => ({
                    doneExerciseId: generateId("exercise"),
                    name: data.name,
                    sets: data.doneSets,
                    note: data.note,
                    type: data.exerciseType,
                    originalExerciseId: data.originalExerciseId,
                }));
                state.workouts
                    .find((workout) => workout.workoutId === workoutIndex)
                    ?.doneWorkouts.push({
                        doneWorkoutId: generateId("workout"),
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
        })
        .addCase(cleanupDurationValues, (state) => {
            if (state.editedWorkout && state.editedWorkout.workout && state.editedWorkout.workout.doneWorkouts) {
                state.editedWorkout.workout.doneWorkouts = state.editedWorkout.workout.doneWorkouts.map((doneWorkout) => {
                    return {
                        ...doneWorkout,
                        doneExercises: doneWorkout.doneExercises?.map((exercise) => {
                            if (exercise.type === "TIME_BASED") {
                                return {
                                    ...exercise,
                                    sets: exercise.sets.map((set) => {
                                        const durationInNumbers = getMinutesSecondsFromMilliseconds(getMillisecondsFromTimeInput(set.duration));
                                        return { ...set, duration: { minutes: durationInNumbers.minutes.toString(), seconds: durationInNumbers.seconds.toString() } };
                                    }),
                                } satisfies DoneExerciseData;
                            }
                            return exercise;
                        }),
                    };
                });
            }
        })
        .addCase(saveExerciseAsTemplate, (state, action) => {
            if (state.editedExercise) {
                if (!state.storedExerciseTemplates) {
                    state.storedExerciseTemplates = [];
                }
                if (action.payload?.overwrite) {
                    const template = state.storedExerciseTemplates.find((template) => template.templateId === state.editedExercise?.exercise.templateId);
                    if (template) {
                        state.storedExerciseTemplates.splice(
                            state.storedExerciseTemplates.findIndex((template) => template.templateId === state.editedExercise?.exercise.templateId),
                            1,
                            { templateId: template.templateId, exerciseMetaData: state.editedExercise.exercise },
                        );
                    } else {
                        state.storedExerciseTemplates!.push({ templateId: generateId("template"), exerciseMetaData: state.editedExercise.exercise });
                    }
                } else {
                    state.storedExerciseTemplates!.push({ templateId: generateId("template"), exerciseMetaData: state.editedExercise.exercise });
                }
            }
        })
        .addCase(applyTemplateToEditedExercise, (state, action) => {
            if (state.editedExercise && state.storedExerciseTemplates) {
                const template = state.storedExerciseTemplates.find((template) => template.templateId === action.payload.templateId);
                if (template) {
                    state.editedExercise.exercise = { ...template.exerciseMetaData, exerciseId: state.editedExercise.exercise.exerciseId, templateId: action.payload.templateId };
                }
            }
        })
        .addCase(updateTemplate, (state) => {
            if (state.storedExerciseTemplates && state.editedExercise && state.editedExercise.exercise.templateId) {
                const exerciseMetaData = state.editedExercise.exercise;
                const templateIndex = state.storedExerciseTemplates.findIndex((template) => template.templateId === exerciseMetaData.templateId);
                if (templateIndex !== -1) {
                    state.storedExerciseTemplates[templateIndex] = { templateId: state.storedExerciseTemplates[templateIndex].templateId, exerciseMetaData };
                }
            }
        });
});
