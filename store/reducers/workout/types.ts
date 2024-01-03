import { SortingType } from "../../types";
import { IsoDate } from "../../../types/date";

export type Workout = {
    name: string;
    calendarColor: string;
    exercises: WeightBasedExerciseMetaData[];
    doneWorkouts: DoneWorkouts;
};
export type WeightBasedExerciseData = {
    weight: string;
    reps: string;
    confirmed?: boolean;
};

export type DoneWorkouts = {
    isoDate: IsoDate;
    duration: string;
    doneExercises?: DoneExerciseData[];
}[];

export type DoneExerciseData = {
    name: string;
    sets: ExerciseSets;
    note?: string;
};
export type TimeInput = {
    seconds?: string;
    minutes?: string;
};
export type ExerciseSets = WeightBasedExerciseData[];
export type WeightBasedExerciseMetaData = {
    type: "WEIGHT_BASED";
    name: string;
    weight: string;
    sets: string;
    reps: string;
    pause?: TimeInput;
};
export type ExerciseMetaData = WeightBasedExerciseMetaData;

export type EditedWorkout = {
    workout: Workout;
    index?: number;
};

export type EditedExercise = {
    exercise: ExerciseMetaData;
    isTrained?: boolean;
    index?: number;
};
export type TrainedWorkout = {
    workoutIndex: number;
    workout: Workout;
    activeExerciseIndex: number;
    beginTimestamp: number;
    exerciseData: {
        setIndex: number;
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
    deletedWorkout?: { workout: Workout; index: number };
    deletedExercise?: { exercise: ExerciseMetaData; index: number };
    editedWorkout?: EditedWorkout;
    trainedWorkout?: TrainedWorkout;
    editedExercise?: EditedExercise;
};
