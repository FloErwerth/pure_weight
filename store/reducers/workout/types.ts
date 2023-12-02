import { ExerciseMetaData, ExerciseSets, Workout, WorkoutSortingType } from "../../types";

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
    exerciseData: {
        setIndex: number;
        activeSetIndex: number;
        doneSets: ExerciseSets;
        name: string;
        note?: string;
    }[];
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
