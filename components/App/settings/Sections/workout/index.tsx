import { StopwatchSelection } from "../../components/Selections/StopwatchSelection/StopwatchSelection";

export type WorkoutQuickSettings = {
    disableStopwatch?: boolean;
};

type WorkoutSettingsProps = {
    quickSettings?: WorkoutQuickSettings;
};

export const WorkoutSettings = ({ quickSettings }: WorkoutSettingsProps) => {
    return (
        <>
            <StopwatchSelection quickSettings={quickSettings} />
        </>
    );
};
