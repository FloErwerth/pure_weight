import { IsoDate } from "../types/date";

export type TrainingDay = {
  name: string;
  exercises: ({ doneExerciseEntries: DoneExerciseData } & ExerciseMetaData)[];
};
export type PlainExerciseData = {
  weight: string;
  reps: string;
  note?: string;
};

export type ExerciseMetaDataWithDoneEntries = ({ doneExerciseEntries: DoneExerciseData } & ExerciseMetaData)[];

export type DoneExerciseData = {
  [date: IsoDate]: ExerciseSets;
};

export type ExerciseSets = Partial<{ [set: string]: PlainExerciseData }>;

export type ExerciseMetaData = {
  name: string;
  weight: string;
  sets: string;
  reps: string;
  pause?: string;
};

export type ErrorFields = "create_name" | "create_weight" | "create_sets" | "create_reps" | "workout_name" | "create_exercises_empty";

export type AppState = {
  trainingDays: TrainingDay[];
  trainingDayIndex: number | undefined;
  setIndex: number;
  exerciseIndex: number;
  isFirstTimeRendered: boolean;
  settings: {
    language?: "en" | "de";
  };
  errors: ErrorFields[];
};
