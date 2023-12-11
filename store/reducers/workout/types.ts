import { SortingType } from "../../types";

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
    timestamp: number;
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
    timetamp: number;
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
    sorting: SortingType;
    deletedWorkout?: { workout: Workout; index: number };
    deletedExercise?: { exercise: ExerciseMetaData; index: number };
    editedWorkout?: EditedWorkout;
    trainedWorkout?: TrainedWorkout;
    editedExercise?: EditedExercise;
};
