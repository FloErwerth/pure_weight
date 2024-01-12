import { AppState, useAppSelector } from "../../../../store";
import { getExerciseByIndex } from "../../../../store/reducers/workout/workoutSelectors";
import { WeightBasedExercise } from "./WeightBased/WeightBasedExercise";
import { TimeBasedExercise } from "./TimeBased/TimeBasedExercise";

type TrainedExerciseProps = {
    exerciseIndex: number;
};
export const TrainedExercise = ({ exerciseIndex }: TrainedExerciseProps) => {
    const exercise = useAppSelector((state: AppState) => getExerciseByIndex(state, exerciseIndex));

    if (exercise?.type === "WEIGHT_BASED") {
        return <WeightBasedExercise exerciseIndex={exerciseIndex} />;
    }

    if (exercise?.type === "TIME_BASED") {
        return <TimeBasedExercise exerciseIndex={exerciseIndex} />;
    }

    return null;
};
