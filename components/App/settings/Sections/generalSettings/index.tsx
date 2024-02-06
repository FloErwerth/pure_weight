import { UnitSystemSection } from "../../components/Selections/UnitSystemSelection/UnitSystemSection";
import { LanguageSelection } from "../../components/Selections/LanguageSelection/LanguageSelection";

export const GeneralSettings = () => {
    return (
        <>
            <LanguageSelection />
            <UnitSystemSection />
        </>
    );
};
