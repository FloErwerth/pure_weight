import { ExerciseIdType, WorkoutIdType } from "../store/reducers/workout/types";
import { MeasurementIdType } from "../components/App/measurements/types";

export function generateId<Type extends ExerciseIdType | WorkoutIdType | MeasurementIdType>(type: Type) {
    return `${type}-${Date.now()}` as const;
}
