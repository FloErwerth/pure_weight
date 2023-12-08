import { useTranslation } from "react-i18next";
import { useNavigate } from "../../../../hooks/navigate";
import { ThemedView } from "../../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../../components/PageContent/PageContent";
import { WorkoutHistoryEntrySelection } from "../../../../components/App/settings/components/Selections/HistoryEntrySelection/Workout/WorkoutHistoryEntrySelection";
import { MeasurementsHistoryEntrySelection } from "../../../../components/App/settings/components/Selections/HistoryEntrySelection/Measurement/MeasurementsHistoryEntrySelection";

export const Entries = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons titleFontSize={40} handleBack={() => navigate("settings")} title={t("number_entries")} />
            <PageContent>
                <WorkoutHistoryEntrySelection />
                <MeasurementsHistoryEntrySelection />
            </PageContent>
        </ThemedView>
    );
};
