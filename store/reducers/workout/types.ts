import { SortingType } from "../../types";
import { IsoDate } from "../../../types/date";

export type Workout = {
    name: string;
    calendarColor: string;
    exercises: ExerciseMetaData[];
    doneWorkouts: DoneWorkouts;
    workoutId: number;
};

export type ExerciseType = "WEIGHT_BASED" | "TIME_BASED";

export type ExerciseData = {
    weight?: string;
    reps?: string;
    duration?: TimeInput;
    confirmed?: boolean;
};

export type DoneWorkouts = {
    doneWorkoutId: number;
    isoDate: IsoDate;
    duration: string;
    doneExercises?: DoneExerciseData[];
}[];

export type DoneExerciseData = {
    doneExerciseId: number;
    type: ExerciseType;
    name: string;
    sets: ExerciseSets;
    fallbackSets?: ExerciseSets;
    note?: string;
};

export type TimeInput = {
    seconds?: string;
    minutes?: string;
};

export type ExerciseSets = ExerciseData[];

export type ExerciseMetaData = {
    type: ExerciseType;
    name: string;
    weight: string;
    sets: string;
    reps?: string;
    pause?: TimeInput;
    duration?: TimeInput;
    preparation?: TimeInput;
};

export type EditedWorkout = {
    workout: Workout;
    isNew: boolean;
};

export type EditedExercise = {
    exercise: ExerciseMetaData;
    isTrained?: boolean;
    index?: number;
};

export type TrainedWorkout = {
    workout: Workout;
    activeExerciseIndex: number;
    beginTimestamp: number;
    paused: boolean;
    exerciseData: {
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
    sorting: SortingType;
    deletedWorkout?: { workout: Workout; trainedWorkout?: TrainedWorkout };
    deletedExercise?: { exercise: ExerciseMetaData; index: number };
    editedWorkout?: EditedWorkout;
    trainedWorkout?: TrainedWorkout;
    editedExercise?: EditedExercise;
};
