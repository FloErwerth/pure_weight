import { ExerciseId, ExerciseIdType, TemplateId, TemplateIdType, WorkoutId, WorkoutIdType } from "../store/reducers/workout/types";
import { MeasurementId, MeasurementIdType } from "../components/App/measurements/types";

export function generateId<Type extends TemplateIdType | ExerciseIdType | WorkoutIdType | MeasurementIdType>(type: Type) {
    return `${type}-${Date.now()}` as const;
}
export const extractMillisecondsFromId = (id: ExerciseId | TemplateId | WorkoutId | MeasurementId) => {
    return parseInt(id.split("-")[1]);
};
