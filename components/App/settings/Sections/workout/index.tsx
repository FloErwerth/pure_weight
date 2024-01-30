import { ExercisesSelection } from "../../components/Selections/SwitchToNextExerciseSelection/ExercisesSelection";
import { StopwatchSelection } from "../../components/Selections/StopwatchSelection/StopwatchSelection";

type WorkoutSettingsProps = {
    quick?: boolean;
};
export const WorkoutSettings = ({ quick }: WorkoutSettingsProps) => {
    return (
        <>
            <StopwatchSelection quick={quick} />
            <ExercisesSelection quick={quick} />
        </>
    );
};
