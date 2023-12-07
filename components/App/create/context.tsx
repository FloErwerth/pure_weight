import { ExerciseMetaData } from "../../../store/types";
import { createContext, PropsWithChildren } from "react";
import { noop } from "lodash";

export const emptyWeightbasedExercise: ExerciseMetaData = { reps: "", sets: "", weight: "", name: "", type: "WEIGHT_BASED" } as const;

export type CreateWorkoutContext = { handleEditExercise: (key: keyof ExerciseMetaData, value: string) => void; editedExercise: ExerciseMetaData };
export const createWorkoutContext = createContext<CreateWorkoutContext>({ handleEditExercise: noop, editedExercise: emptyWeightbasedExercise });

interface CreateContextProviderProps extends PropsWithChildren {
    value: CreateWorkoutContext;
}

export const CreateContextProvider = ({ children, value }: CreateContextProviderProps) => {
    return <createWorkoutContext.Provider value={value}>{children}</createWorkoutContext.Provider>;
};
