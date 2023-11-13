import { createContext } from "react";
import { noop } from "lodash";
import type { DoneExercises } from "../../../app/workouts/train";

export const workoutContext = createContext<{ doneSetsThisExercise: DoneExercises; handleSaveNote: (index: number, note?: string) => void }>({ doneSetsThisExercise: new Map(), handleSaveNote: noop });
