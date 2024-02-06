import { ExerciseId, ExerciseIdType, WorkoutId, WorkoutIdType } from "../store/reducers/workout/types";

export function generateId<Type extends ExerciseIdType | WorkoutIdType>(type: Type) {
    return `${type}-${Date.now()}` as const;
}
export const extractMillisecondsFromId = (id: ExerciseId | WorkoutId) => {
    return parseInt(id.split("-")[1]);
};
