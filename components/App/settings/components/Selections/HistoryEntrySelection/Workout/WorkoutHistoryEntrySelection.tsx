import { ProfileContent } from "../../../SettingsSection/SettingsNavigator";
import { useTranslation } from "react-i18next";
import { WorkoutSelection } from "./WorkoutSelection";

export const WorkoutHistoryEntrySelection = () => {
    const { t } = useTranslation();

    return (
        <ProfileContent title={t("workout")}>
            <WorkoutSelection />
        </ProfileContent>
    );
};
