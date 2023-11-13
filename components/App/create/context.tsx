import { ExerciseMetaData, ExerciseMetaDataWithDoneEntries } from "../../../store/types";
import { createContext, PropsWithChildren } from "react";
import { noop } from "lodash";

export const emptyExercise = { doneExerciseEntries: [], pause: "", reps: "", sets: "", weight: "", name: "" };

export type EditedExercise = ExerciseMetaDataWithDoneEntries[number];
export type CreateWorkoutContext = { handleEditExercise: (key: keyof ExerciseMetaData, value: string) => void; editedExercise: EditedExercise };
export const createWorkoutContext = createContext<CreateWorkoutContext>({ handleEditExercise: noop, editedExercise: emptyExercise });

interface CreateContextProviderProps extends PropsWithChildren {
  value: CreateWorkoutContext;
}

export const CreateContextProvider = ({ children, value }: CreateContextProviderProps) => {
  return <createWorkoutContext.Provider value={value}>{children}</createWorkoutContext.Provider>;
};
