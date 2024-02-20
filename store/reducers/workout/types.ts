import { SortingType } from "../../types";
import { IsoDate } from "../../../types/date";

export type ExerciseIdType = "exercise";
export type WorkoutIdType = "workout";
export type ExerciseId = `${ExerciseIdType}-${number}`;
export type WorkoutId = `${WorkoutIdType}-${number}`;

export type Workout = {
    name: string;
    exercises: ExerciseMetaData[];
    doneWorkouts: DoneWorkouts;
    workoutId: WorkoutId;
};

export type ExerciseType = "WEIGHT_BASED" | "TIME_BASED";

export type ExerciseData = {
    weight?: string;
    reps?: string;
    durationMinutes?: string;
    durationSeconds?: string;
    confirmed?: boolean;
};

export type DoneWorkouts = {
    doneWorkoutId: WorkoutId;
    isoDate: IsoDate;
    duration: string;
    doneExercises?: DoneExerciseData[];
}[];

export type DoneExerciseData = {
    originalExerciseId: ExerciseId;
    doneExerciseId: ExerciseId;
    type: ExerciseType;
    name: string;
    sets: ExerciseSets;
    fallbackSets?: ExerciseSets;
    note?: string;
};

export type ExerciseSets = ExerciseData[];

export type ExerciseMetaData = {
    exerciseId: ExerciseId;
    type: ExerciseType;
    name: string;
    weight: string;
    sets: string;
    reps?: string;
    pauseMinutes?: string;
    pauseSeconds?: string;
    durationMinutes?: string;
    durationSeconds?: string;
};

export type EditedWorkout = {
    workout: Workout;
    isNew: boolean;
};

export type EditedExercise = {
    exercise: ExerciseMetaData;
    isTrained?: boolean;
    isNewExercise?: boolean;
    index?: number;
};

export type TrainedWorkout = {
    workout: Workout;
    activeExerciseIndex: number;
    beginTimestamp: number;
    pauseTimestamps?: {
        begin: number;
        end: number;
    }[];
    paused: boolean;
    exerciseData: {
        exerciseId: ExerciseId;
        exerciseType: ExerciseType;
        setIndex: number;
        latestSetIndex: number;
        activeSetIndex: number;
        doneSets: ExerciseSets;
        name: string;
        note?: string;
        canSnap: boolean;
    }[];
};

export type WorkoutState = {
    workouts: Workout[];
    workoutSorting: SortingType;
    templateSorting: SortingType;
    deletedWorkout?: { workout: Workout; trainedWorkout?: TrainedWorkout };
    deletedExercise?: { exercise: ExerciseMetaData; index: number };
    editedWorkout?: EditedWorkout;
    trainedWorkout?: TrainedWorkout;
    editedExercise?: EditedExercise;
    searchedWorkout?: string;
};
