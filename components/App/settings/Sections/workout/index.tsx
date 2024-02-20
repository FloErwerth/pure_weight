import { StopwatchSelection } from "../../components/Selections/StopwatchSelection/StopwatchSelection";
import { ExercisesSelection } from "../../components/Selections/ExercisesSelection/ExercisesSelection";
import { UpdateWorkoutAutomaticallySelection } from "../../components/Selections/UpdateDataAutomaticallySelection/UpdateWorkoutAutomaticallySelection";

export const WorkoutSettings = () => {
    return (
        <>
            <StopwatchSelection />
            <ExercisesSelection />
            <UpdateWorkoutAutomaticallySelection />
        </>
    );
};
