import { SwitchToNextExerciseSelection } from "../../components/Selections/SwitchToNextExerciseSelection/SwitchToNextExerciseSelection";
import { StopwatchSelection } from "../../components/Selections/StopwatchSelection/StopwatchSelection";

export const WorkoutSettings = () => {
    return (
        <>
            <StopwatchSelection />
            <SwitchToNextExerciseSelection />
        </>
    );
};
