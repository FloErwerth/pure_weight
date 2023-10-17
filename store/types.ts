import { IsoDate } from "../types/date";
import { ChartType } from "../app/progress/chart/components/ExerciseCharts";

export type TrainingDay = {
  name: string;
  exercises: ({ doneExerciseEntries: DoneExerciseData } & ExerciseMetaData)[];
};
export type PlainExerciseData = {
  weight: string;
  reps: string;
  note?: string;
};
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

export type AppState = {
  trainingDays: TrainingDay[];
  trainingDayIndex: number | undefined;
  editedExerciseIndex?: number;
  setIndex: number;
  exerciseIndex: number;
  isFirstTimeRendered: boolean;
  chartType: ChartType;
};
