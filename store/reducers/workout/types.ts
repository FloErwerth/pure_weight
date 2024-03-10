import { SortingType } from "../../types";
import { IsoDate } from "../../../types/date";
import { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
    originalWorkoutId: WorkoutId;
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
    previousName?: string;
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
    stringifiedWorkout?: string;
    isNew: boolean;
};

export type EditedExercise = {
    exercise: ExerciseMetaData;
    isTrained?: boolean;
    stringifiedExercise?: string;
    isNewExercise?: boolean;
    index?: number;
    workoutId?: WorkoutId;
};

export type TrainedWorkoutExerciseData = {
    exerciseId: ExerciseId;
    exerciseType: ExerciseType;
    setIndex: number;
    latestSetIndex: number;
    activeSetIndex: number;
    sets: ExerciseSets;
    name: string;
    note?: string;
    canSnap: boolean;
};

export type TrainedWorkout = {
    workoutId: WorkoutId;
    activeExerciseIndex: number;
    beginTimestamp: number;
    pauseTimestamps?: {
        begin: number;
        end: number;
    }[];
    paused: boolean;
    exerciseData: TrainedWorkoutExerciseData[];
};

type PostWorkoutStats = {
    icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
    iconColor: string;
    unit: string;
    value?: string;
    text: string;
}[];

export type PostWorkoutScreen = {
    workoutName: string;
    stats: PostWorkoutStats;
};

export type WorkoutState = {
    postWorkoutWorkoutId?: WorkoutId;
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
