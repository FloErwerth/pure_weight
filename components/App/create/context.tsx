import { ExerciseMetaData } from "../../../store/types";
import { createContext, PropsWithChildren } from "react";
import { noop } from "lodash";

export const emptyExercise = { doneExerciseEntries: [], pause: "", reps: "", sets: "", weight: "", name: "" };

export type CreateWorkoutContext = { handleEditExercise: (key: keyof ExerciseMetaData, value: string) => void; editedExercise: ExerciseMetaData };
export const createWorkoutContext = createContext<CreateWorkoutContext>({ handleEditExercise: noop, editedExercise: emptyExercise });

interface CreateContextProviderProps extends PropsWithChildren {
  value: CreateWorkoutContext;
}

export const CreateContextProvider = ({ children, value }: CreateContextProviderProps) => {
  return <createWorkoutContext.Provider value={value}>{children}</createWorkoutContext.Provider>;
};