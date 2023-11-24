import { IsoDate } from "../types/date";
import { ThemeKey } from "../theme/types";
import { Measurement } from "../components/App/measurements/types";

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

export type ExerciseSets = PlainExerciseData[];

export type ExerciseMetaData = {
    type: ExerciseType;
    timePerSet: string;
    name: string;
    weight: string;
    sets: string;
    reps: string;
    pause?: string;
};

export const ExerciseTypeOptions = ["Time based", "Classical"] as const;
export type ExerciseType = (typeof ExerciseTypeOptions)[number];

export type ErrorFields =
    | "create_name"
    | "create_weight"
    | "create_sets"
    | "create_reps"
    | "workout_name"
    | "create_exercises_empty"
    | "measurement_name"
    | "measurement_unit"
    | "measurement_value"
    | "create_timePerSet";

export type AppState = {
    workouts: Workout[];
    workoutIndex: number;
    workoutStartingTimestamp?: number;
    setIndex: number;
    exerciseIndex: number;
    isFirstTimeRendered: boolean;
    workoutSorting: WorkoutSortingType;
    settings: {
        language?: "en" | "de";
    };
    latestDeletions: {
        measurement?: { index: number; data: Measurement };
        trainingDay?: {
            index: number;
            data: Workout;
            exercise?: { index: number; data: DoneWorkouts };
        };
    };
    measurements: Measurement[];
    errors: ErrorFields[];
    theme: ThemeKey;
    appInstallDate?: IsoDate;
};
