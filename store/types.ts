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
    exercises: ExerciseMetaData[];
    doneWorkouts: DoneWorkouts;
};

export type PlainExerciseData = {
    weight: string;
    reps: string;
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

export const exerciseTypeOptions = ["WEIGHT_BASED", "TIME_BASED"] as const;
export type ExerciseType = (typeof exerciseTypeOptions)[number];
export type ExerciseSets = PlainExerciseData[];

export type WeightBasedExerciseMetaData = {
    type: "WEIGHT_BASED";
    name: string;
    weight: string;
    sets: string;
    reps: string;
    pause?: string;
};

export type TimeBasedExerciseMetaData = {
    type: "TIME_BASED";
    timePerSet: string;
    timeBeforeSet?: string;
    name: string;
    sets: string;
    pause?: string;
};

export type ExerciseMetaData = WeightBasedExerciseMetaData | TimeBasedExerciseMetaData;
