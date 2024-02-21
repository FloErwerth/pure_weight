import { ExerciseType } from "../store/reducers/workout/types";
import { ReactNode, useMemo } from "react";

export function useTypeSpecificComponent<T>(
    exerciseType: ExerciseType = "WEIGHT_BASED",
    WeightBasedComponent: (props: T) => ReactNode,
    TimeBasedComponent: (props: T) => ReactNode,
) {
    return useMemo(() => {
        if (exerciseType === "WEIGHT_BASED") {
            return WeightBasedComponent;
        }
        return TimeBasedComponent;
    }, [TimeBasedComponent, WeightBasedComponent, exerciseType]);
}
