import { UnitSystemSection } from "../../../components/App/settings/components/Selections/UnitSystemSelection/UnitSystemSection";
import { StopwatchSelection } from "../../../components/App/settings/components/Selections/StopwatchSelection/StopwatchSelection";

export const GeneralSettings = () => {
    return (
        <>
            <UnitSystemSection />
            <StopwatchSelection />
        </>
    );
};
