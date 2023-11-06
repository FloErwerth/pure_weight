import { IsoDate } from "../types/date";
import { ThemeKey } from "../theme/types";

export type TrainingDay = {
  name: string;
  latestDate?: string;
  exercises: ExerciseMetaDataWithDoneEntries;
};

export type PlainExerciseData = {
  weight: string;
  reps: string;
};

export type ExerciseMetaDataWithDoneEntries = ({ doneExerciseEntries: DoneExerciseData[] } & ExerciseMetaData)[];

export type DoneExerciseData = {
  date: IsoDate;
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

export type Measurement = {
  name: string;
  unit: string;
  data: {
    [date: IsoDate]: string;
  };
};
export type ErrorFields = "create_name" | "create_weight" | "create_sets" | "create_reps" | "workout_name" | "create_exercises_empty" | "measurement_name" | "measurement_unit" | "measurement_value";

export type AppState = {
  trainingDays: TrainingDay[];
  trainingDayIndex: number | undefined;
  setIndex: number;
  exerciseIndex: number;
  isFirstTimeRendered: boolean;
  settings: {
    language?: "en" | "de";
  };
  latestDeletions: {
    measurement?: { index: number; data: Measurement };
    trainingDay?: { index: number; data: TrainingDay; exercise?: { index: number; data: ExerciseMetaDataWithDoneEntries } };
  };
  measurements: Measurement[];
  errors: ErrorFields[];
  theme: ThemeKey;
};
