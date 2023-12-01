import { IsoDate } from "../types/date";

export const WorkoutSortingType = ["A_Z", "Z_A", "LONGEST_AGO", "MOST_RECENT"] as const;
export const HistorySortingType = [
    "DAY_DESCENDING",
    "DAY_ASCENDING",
    "MOST_WEIGHT_LIFTED",
    "LEAST_WEIGHT_LIFTED",
    "MOST_EXERCISES_DONE",
    "LEAST_EXERCISES_DONE",
    "LONGEST_DURATION",
    "SHORTEST_DURATION",
] as const;

export type WorkoutSortingType = (typeof WorkoutSortingType)[number];

export type Workout = {
    name: string;
    calendarColor: string;
    exercises: WeightBasedExerciseMetaData[];
    doneWorkouts: DoneWorkouts;
};

export type WeightBasedExerciseData = {
    weight: string;
    reps: string;
    filled?: boolean;
};

export type DoneWorkouts = {
    date: IsoDate;
    duration: string;
    doneExercises?: DoneExerciseData[];
}[];

export type DoneExerciseData = {
    name: string;
    sets: ExerciseSets;
    note?: string;
};

export type ExerciseSets = WeightBasedExerciseData[];

export type WeightBasedExerciseMetaData = {
    type: "WEIGHT_BASED";
    name: string;
    weight: string;
    sets: string;
    reps: string;
    pause?: string;
};

export type ExerciseMetaData = WeightBasedExerciseMetaData;
