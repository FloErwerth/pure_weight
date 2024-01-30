import { ExerciseType } from "../store/reducers/workout/types";
import { ReactNode } from "react";

export function useTypeSpecificComponent<T>(exerciseType: ExerciseType = "WEIGHT_BASED", WeightBasedComponent: (props: T) => ReactNode, TimeBasedComponent: (props: T) => React.ReactNode) {
    if (exerciseType === "WEIGHT_BASED") {
        return WeightBasedComponent;
    }
    return TimeBasedComponent;
}
