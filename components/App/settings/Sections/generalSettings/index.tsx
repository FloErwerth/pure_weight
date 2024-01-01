import { UnitSystemSection } from "../../components/Selections/UnitSystemSelection/UnitSystemSection";
import { DeletionTimeSelection } from "../../components/Selections/DeleteSelection/DeletionTimeSelection";
import { LanguageSelection } from "../../components/Selections/LanguageSelection/LanguageSelection";

export const GeneralSettings = () => {
    return (
        <>
            <LanguageSelection />
            <UnitSystemSection />
            <DeletionTimeSelection />
        </>
    );
};
