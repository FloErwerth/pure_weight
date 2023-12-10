import { IsoDate } from "../types/date";

export const SortingType = ["A_Z", "Z_A", "LONGEST_AGO", "MOST_RECENT"] as const;

export type SortingType = (typeof SortingType)[number];

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
    date: IsoDate;
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
