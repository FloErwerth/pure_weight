import { IsoDate } from "../types/date";

export type TrainingDay = {
  name: string;
  exercises: ({ doneExerciseEntries: ExercideDataEntry } & ExerciseMetaData)[];
};

export type ExercideDataEntry = {
  [date: IsoDate]: { [entry: string]: DoneExerciseData };
};
export type PlainExerciseData = {
  weight: string;
  reps: string;
  note?: string;
};
export type DoneExerciseData = {
  [set: string]: PlainExerciseData;
};

export type ExerciseMetaData = {
  name: string;
  weight: string;
  sets: string;
  reps: string;
  pause?: string;
};

export type AppState = {
  trainingDays: TrainingDay[];
  trainingDayIndex: number | undefined;
  editedExerciseIndex?: number;
  setIndex: number;
  exerciseIndex: number;
};
