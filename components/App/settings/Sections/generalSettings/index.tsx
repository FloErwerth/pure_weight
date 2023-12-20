import { UnitSystemSection } from "../../components/Selections/UnitSystemSelection/UnitSystemSection";
import { DeletionTimeSelection } from "../../components/Selections/DeleteSelection/DeletionTimeSelection";

export const GeneralSettings = () => {
    return (
        <>
            <UnitSystemSection />
            <DeletionTimeSelection />
        </>
    );
};
