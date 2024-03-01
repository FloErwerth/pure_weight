import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { SortingType } from "../../types";
import { Temporal } from "@js-temporal/polyfill";
import { sortWorkouts } from "./sortWorkouts";
import {
    DoneExerciseData,
    ExerciseData,
    ExerciseId,
    ExerciseMetaData,
    TrainedWorkout,
    Workout,
    WorkoutId,
    WorkoutState,
} from "./types";
import { getDateTodayIso } from "../../../utils/date";
import { getMillisecondsFromTimeInput, getMinutesSecondsFromMilliseconds } from "../../../utils/timeDisplay";
import { generateId } from "../../../utils/generateId";

const combineData = (existingData?: ExerciseData, newData?: ExerciseData): ExerciseData => {
    if (!existingData) {
        return {};
    }

    return {
        ...existingData,
        ...newData,
    };
};
export const setWorkoutState = createAction<WorkoutState, "workout_set_state">("workout_set_state");
export const setWorkouts = createAction<Workout[], "workout_set_workouts">("workout_set_workouts");
export const setShowPostWorkoutScreen = createAction<WorkoutId | undefined, "workout_show_post_workout_screen">(
    "workout_show_post_workout_screen",
);
export const mutateEditedExercise = createAction<
    {
        key: keyof ExerciseMetaData;
        value: string | undefined;
    },
    "exercise_edit_mutate"
>("exercise_edit_mutate");

export const mutateActiveExerciseInTrainedWorkout = createAction<
    {
        key: keyof TrainedWorkout["exerciseData"][number];
        value: TrainedWorkout["exerciseData"][number][keyof TrainedWorkout["exerciseData"][number]];
    },
    "exercise_edit_mutate_active_exercise"
>("exercise_edit_mutate_active_exercise");

export const setEditedWorkout = createAction<
    {
        workoutId: WorkoutId;
    },
    "workout_set_edited_workout"
>("workout_set_edited_workout");
export const setEditedExercise = createAction<
    | {
          exerciseId: ExerciseId;
      }
    | undefined,
    "workout_set_edited_exercise"
>("workout_set_edited_exercise");
export const deleteExerciseFromEditedWorkout = createAction<number, "workout_delete_exercise_from_edited_workout">(
    "workout_delete_exercise_from_edited_workout",
);
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
export const saveEditedWorkout = createAction<boolean | undefined, "workout_save_edited_workout">(
    "workout_save_edited_workout",
);
export const setEditedWorkoutName = createAction<string | undefined, "workout_set_edited_workout_name">(
    "workout_set_edited_workout_name",
);
export const handleMutateSet = createAction<
    {
        setIndex: number;
        key: keyof ExerciseData;
        value?: string;
        updatePrefilledValues?: boolean;
    },
    "handle_mutate_set"
>("handle_mutate_set");
export const setSearchedWorkout = createAction<string | undefined, "set_searched_workout">("set_searched_workout");

export const markSetAsDone = createAction<{ setIndex: number }, "mark_set_as_done">("mark_set_as_done");
export const setIsActiveSet = createAction<{ setIndex: number }, "set_is_active_set">("set_is_active_set");
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

export const discardChangesToDoneExercises = createAction<{
    doneWorkoutId: WorkoutId;
}>("discardChangesToDoneExercises");
export const deleteFallbackSets = createAction<{ doneWorkoutId: WorkoutId }>("deleteFallbackSets");

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
    | typeof markSetAsDone.type;

export const generateNewExercise = (): ExerciseMetaData => ({
    exerciseId: generateId("exercise"),
    name: "",
    type: "WEIGHT_BASED",
    sets: "",
    reps: "",
    weight: "",
    durationMinutes: "",
    durationSeconds: "",
    pauseMinutes: "",
    pauseSeconds: "",
});

export const workoutReducer = createReducer<WorkoutState>(
    {
        workouts: [],
        workoutSorting: "LONGEST_AGO",
        templateSorting: "MOST_RECENT",
    },
    (builder) => {
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
                    state.trainedWorkout.pauseTimestamps = [
                        ...(state.trainedWorkout.pauseTimestamps ?? []),
                        {
                            begin: Date.now(),
                            end: 0,
                        },
                    ];
                }
            })
            .addCase(resumeTrainedWorkout, (state) => {
                if (state.trainedWorkout && state.trainedWorkout.pauseTimestamps) {
                    state.trainedWorkout.pauseTimestamps[state.trainedWorkout.pauseTimestamps.length - 1].end =
                        Date.now();
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
                    const workoutId =
                        state.trainedWorkout?.workout.workoutId ?? state.editedWorkout?.workout?.workoutId;
                    const workout = state.workouts.find((workout) => workout.workoutId === workoutId);
                    const exercise = workout?.exercises?.find(
                        (exercise) => exercise.exerciseId === action.payload?.exerciseId,
                    );
                    if (exercise) {
                        state.editedExercise = {
                            exercise,
                            stringifiedExercise: JSON.stringify(exercise),
                        };
                    }
                }
            })
            .addCase(handleMutateSet, (state, action) => {
                const trainedWorkout = state.trainedWorkout;
                if (trainedWorkout) {
                    const exercise = trainedWorkout.exerciseData[trainedWorkout.activeExerciseIndex];

                    if (
                        action.payload.updatePrefilledValues &&
                        (action.payload.key === "weight" ||
                            action.payload.key === "reps" ||
                            action.payload.key === "durationMinutes" ||
                            action.payload.key === "durationSeconds")
                    ) {
                        trainedWorkout.workout.exercises[trainedWorkout.activeExerciseIndex][action.payload.key] =
                            action.payload.value as string;
                    }

                    exercise.doneSets[action.payload.setIndex] = {
                        ...exercise.doneSets[action.payload.setIndex],
                        [action.payload.key]: action.payload.value,
                    };

                    trainedWorkout.exerciseData[trainedWorkout.activeExerciseIndex] = exercise;
                }
            })
            .addCase(markSetAsDone, (state, action) => {
                const trainedWorkout = state.trainedWorkout;
                if (trainedWorkout) {
                    const exerciseIndex = trainedWorkout.activeExerciseIndex;
                    const exerciseData = trainedWorkout.exerciseData[exerciseIndex];
                    const exercise = trainedWorkout.workout.exercises.find(
                        (exercise) => exercise.exerciseId === exerciseData.exerciseId,
                    );

                    const doneSet = combineData(
                        exercise,
                        trainedWorkout.exerciseData[exerciseIndex].doneSets[action.payload.setIndex],
                    );

                    if (doneSet.durationMinutes === "") {
                        doneSet.durationMinutes = undefined;
                    }
                    if (doneSet.durationSeconds === "") {
                        doneSet.durationSeconds = undefined;
                    }

                    if (
                        action.payload.setIndex === exerciseData.latestSetIndex ||
                        action.payload.setIndex === exerciseData.activeSetIndex
                    ) {
                        exerciseData.doneSets[action.payload.setIndex] = {
                            ...doneSet,
                            confirmed: true,
                        };
                        exerciseData.setIndex += 1;
                        if (exerciseData.activeSetIndex !== exerciseData.latestSetIndex) {
                            exerciseData.activeSetIndex = exerciseData.latestSetIndex;
                        } else {
                            exerciseData.activeSetIndex += 1;
                            exerciseData.latestSetIndex += 1;
                        }
                        trainedWorkout.exerciseData[exerciseIndex] = exerciseData;
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
                    state.editedWorkout = {
                        ...state.editedWorkout,
                        isNew: state.editedWorkout?.isNew ?? false,
                        workout: { ...workout, name: action.payload ?? "" },
                    };
                }
            })
            .addCase(createNewWorkout, (state) => {
                const workout = { workoutId: generateId("workout"), name: "", exercises: [], doneWorkouts: [] };
                state.editedWorkout = {
                    isNew: true,
                    stringifiedWorkout: JSON.stringify(workout),
                    workout,
                };
            })
            .addCase(setWorkouts, (state, action) => {
                state.workouts = action.payload;
            })
            .addCase(createNewExercise, (state) => {
                const newExercise = generateNewExercise();
                state.editedExercise = {
                    stringifiedExercise: JSON.stringify(newExercise),
                    exercise: newExercise,
                    isNewExercise: true,
                };
            })
            .addCase(setEditedWorkout, (state, action) => {
                const storedWorkout = state.workouts.find((workout) => workout.workoutId === action.payload?.workoutId);
                if (storedWorkout) {
                    state.editedWorkout = {
                        isNew: false,
                        stringifiedWorkout: JSON.stringify(storedWorkout),
                        workout: storedWorkout,
                    };
                }
            })
            .addCase(saveEditedExercise, (state) => {
                if (state.editedExercise) {
                    if (state.trainedWorkout) {
                        const trainedWorkoutExerciseIndex = state.trainedWorkout.exerciseData.findIndex(
                            (data) => data.exerciseId === state.editedExercise?.exercise.exerciseId,
                        );
                        if (trainedWorkoutExerciseIndex !== -1) {
                            state.trainedWorkout.workout.exercises.splice(
                                trainedWorkoutExerciseIndex,
                                1,
                                state.editedExercise.exercise,
                            );
                            state.trainedWorkout.exerciseData[trainedWorkoutExerciseIndex].doneSets.map((data) => {
                                if (!data.confirmed) {
                                    return {
                                        filled: false,
                                        reps: state.editedExercise?.exercise.reps,
                                        weight: state.editedExercise?.exercise.weight,
                                    };
                                }
                                return data;
                            });
                        }
                    }
                    if (state.editedWorkout) {
                        const exerciseIndex = state.editedWorkout.workout.exercises.findIndex(
                            (exercise) => exercise.exerciseId === state.editedExercise?.exercise.exerciseId,
                        );
                        if (exerciseIndex !== -1) {
                            state.editedWorkout.workout.exercises.splice(
                                exerciseIndex,
                                1,
                                state.editedExercise.exercise,
                            );
                        } else {
                            state.editedWorkout.workout.exercises.push(state.editedExercise.exercise);
                        }
                    }

                    //save in general workouts
                    const id = state.trainedWorkout?.workout.workoutId ?? state.editedWorkout?.workout.workoutId;
                    const workoutIndex = state.workouts.findIndex((workout) => workout.workoutId === id);
                    if (workoutIndex !== -1) {
                        const workoutExerciseIndex =
                            state.workouts[workoutIndex].exercises.findIndex(
                                (exercise) => exercise.exerciseId === state.editedExercise?.exercise.exerciseId,
                            ) ?? -1;
                        state.workouts[workoutIndex]?.exercises.splice(
                            workoutExerciseIndex,
                            1,
                            state.editedExercise.exercise,
                        );
                    }
                }
            })
            .addCase(deleteExerciseFromEditedWorkout, (state, action) => {
                if (state.editedWorkout && state.editedWorkout.workout.exercises) {
                    const exercises = [...state.editedWorkout.workout.exercises];
                    state.deletedExercise = {
                        exercise: exercises.splice(action.payload, 1)[0],
                        index: action.payload,
                    };
                    state.editedWorkout.workout.exercises = exercises;
                }
            })
            .addCase(setWorkoutSorting, (state, { payload }) => {
                state.workoutSorting = payload;
                state.workouts = sortWorkouts(state.workouts, state.workoutSorting);
            })

            .addCase(mutateEditedExercise, (state, action) => {
                if (state.editedExercise) {
                    state.editedExercise = {
                        ...state.editedExercise,
                        exercise: {
                            ...state.editedExercise.exercise,
                            [action.payload.key]: action.payload.value,
                        },
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
                    state.editedWorkout = {
                        ...editedWorkout,
                        workout: { ...editedWorkout.workout, exercises: action.payload },
                    };
                }
            })
            .addCase(removeWorkout, (state, action) => {
                const newWorkouts = [...state.workouts];
                const deletedWorkout = state.workouts.find((workout) => workout.workoutId === action.payload);
                const deletedWorkoutIndex = state.workouts.findIndex((workout) => workout.workoutId === action.payload);
                const deletedTrainingDay = newWorkouts.splice(deletedWorkoutIndex, 1);
                const wasPaused = state.trainedWorkout?.workout.workoutId === deletedWorkout?.workoutId;

                state.deletedWorkout = {
                    workout: deletedTrainingDay[0],
                    trainedWorkout: wasPaused ? state.trainedWorkout : undefined,
                };
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
                    const pausedDuration =
                        workout.pauseTimestamps?.reduce((acc, curr) => acc + (curr.end - curr.begin), 0) ?? 0;
                    const duration = endTimestamp - beginTimestamp - pausedDuration;

                    const doneExercises: (DoneExerciseData | undefined)[] = workout.exerciseData.map((data) => {
                        if (data.doneSets.length === 0) {
                            return undefined;
                        }

                        return {
                            doneExerciseId: generateId("exercise"),
                            type: data.exerciseType,
                            name: data.name,
                            sets: data.doneSets,
                            note: data.note,
                            originalExerciseId: data.exerciseId,
                        };
                    });

                    state.workouts
                        .find((workout) => workout.workoutId === workoutIndex)
                        ?.doneWorkouts.push({
                            originalWorkoutId: workout.workout.workoutId,
                            doneWorkoutId: generateId("workout"),
                            isoDate: getDateTodayIso(),
                            duration: duration.toString(),
                            doneExercises: doneExercises.filter(
                                (exercise) => exercise !== undefined,
                            ) as DoneExerciseData[],
                        });
                    state.postWorkoutWorkoutId = workout?.workout.workoutId;
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
                            state.workouts.findIndex(
                                (workout) => workout.workoutId === state.editedWorkout?.workout?.workoutId,
                            ),
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
                                    exerciseId: metaData?.exerciseId ?? 0,
                                    exerciseType: metaData?.type ?? "WEIGHT_BASED",
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
                    const doneWorkoutIndex = state.editedWorkout.workout.doneWorkouts.findIndex(
                        (doneWorkout) => doneWorkout.doneWorkoutId === action.payload.doneWorkoutId,
                    );
                    const doneWorkout = state.editedWorkout.workout.doneWorkouts[doneWorkoutIndex];
                    if (doneWorkout && doneWorkout.doneExercises) {
                        const doneExerciseIndex = doneWorkout.doneExercises.findIndex(
                            (doneExercise) => doneExercise.doneExerciseId === action.payload.doneExerciseId,
                        );
                        const doneExercise = doneWorkout.doneExercises[doneExerciseIndex];
                        if (doneExercise) {
                            if (!doneExercise.fallbackSets) {
                                doneExercise.fallbackSets = [...doneExercise.sets];
                            }
                            doneExercise.sets[action.payload.setIndex] = {
                                ...doneExercise.sets[action.payload.setIndex],
                                [action.payload.key]: action.payload.value,
                            };
                        }
                        doneWorkout.doneExercises[doneExerciseIndex] = doneExercise;
                    }
                    state.editedWorkout.workout.doneWorkouts[doneWorkoutIndex] = doneWorkout;
                }
            })
            .addCase(discardChangesToDoneExercises, (state, action) => {
                if (state.editedWorkout && state.editedWorkout.workout.doneWorkouts) {
                    const doneWorkoutIndex = state.editedWorkout.workout.doneWorkouts.findIndex(
                        (doneWorkout) => doneWorkout.doneWorkoutId === action.payload.doneWorkoutId,
                    );
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
                    const doneWorkoutIndex = state.editedWorkout.workout.doneWorkouts.findIndex(
                        (doneWorkout) => doneWorkout.doneWorkoutId === action.payload.doneWorkoutId,
                    );
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
                    state.editedWorkout.workout.doneWorkouts = state.editedWorkout.workout.doneWorkouts.map(
                        (doneWorkout) => {
                            return {
                                ...doneWorkout,
                                doneExercises: doneWorkout.doneExercises?.map((exercise) => {
                                    return {
                                        ...exercise,
                                        sets: exercise.sets.map((set) => {
                                            const validatedDuration = getMinutesSecondsFromMilliseconds(
                                                getMillisecondsFromTimeInput(set.durationMinutes, set.durationSeconds),
                                            );
                                            if (set.durationMinutes === "" && set.durationSeconds === "") {
                                                return {
                                                    ...set,
                                                    durationMinutes: validatedDuration.minutes.toString(),
                                                    durationSeconds: validatedDuration.seconds.toString(),
                                                } satisfies ExerciseData;
                                            }
                                            return set;
                                        }),
                                    };
                                }),
                            };
                        },
                    );
                }
            })
            .addCase(setSearchedWorkout, (state, action) => {
                state.searchedWorkout = action.payload;
            })
            .addCase(setShowPostWorkoutScreen, (state, action) => {
                state.postWorkoutWorkoutId = action.payload;
            });
    },
);
