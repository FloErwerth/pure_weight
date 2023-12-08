import { ProfileContent } from "../../../SettingsSection/SettingsNavigator";
import { useTranslation } from "react-i18next";
import { MeasurementSelection } from "./MeasurementSelection";

export const MeasurementsHistoryEntrySelection = () => {
    const { t } = useTranslation();

    return (
        <ProfileContent title={t("measurement")}>
            <MeasurementSelection />
        </ProfileContent>
    );
};
