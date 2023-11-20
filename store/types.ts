import { IsoDate } from "../types/date";
import { ThemeKey } from "../theme/types";
import { Measurement } from "../components/App/measurements/types";

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
  name: string;
  weight: string;
  sets: string;
  reps: string;
  pause?: string;
};

export type ErrorFields =
  | "create_name"
  | "create_weight"
  | "create_sets"
  | "create_reps"
  | "workout_name"
  | "create_exercises_empty"
  | "measurement_name"
  | "measurement_unit"
  | "measurement_value";

export type AppState = {
  workouts: Workout[];
  workoutIndex: number | undefined;
  workoutStartingTimestamp?: number;
  setIndex: number;
  exerciseIndex: number;
  isFirstTimeRendered: boolean;
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
