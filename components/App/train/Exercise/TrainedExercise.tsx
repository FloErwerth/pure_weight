import { AppState, useAppSelector } from "../../../../store";
import { getExerciseById } from "../../../../store/reducers/workout/workoutSelectors";
import { WeightBasedExercise } from "./WeightBased/WeightBasedExercise";
import { TimeBasedExercise } from "./TimeBased/TimeBasedExercise";
import { ExerciseId } from "../../../../store/reducers/workout/types";

type TrainedExerciseProps = {
    exerciseId: ExerciseId;
};
export const TrainedExercise = ({ exerciseId }: TrainedExerciseProps) => {
    const exercise = useAppSelector((state: AppState) => getExerciseById(state, exerciseId));

    if (exercise?.type === "WEIGHT_BASED") {
        return <WeightBasedExercise exerciseId={exerciseId} />;
    }

    if (exercise?.type === "TIME_BASED") {
        return <TimeBasedExercise exerciseId={exerciseId} />;
    }

    return null;
};
