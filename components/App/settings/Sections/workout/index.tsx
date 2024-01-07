import { SwitchToNextExerciseSelection } from "../../components/Selections/SwitchToNextExerciseSelection/SwitchToNextExerciseSelection";
import { StopwatchSelection } from "../../components/Selections/StopwatchSelection/StopwatchSelection";

type WorkoutSettingsProps = {
    quick?: boolean;
};
export const WorkoutSettings = ({ quick }: WorkoutSettingsProps) => {
    return (
        <>
            <StopwatchSelection quick={quick} />
            <SwitchToNextExerciseSelection quick={quick} />
        </>
    );
};
