import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../components/PageContent/PageContent";
import { useNavigate } from "../../../hooks/navigate";
import { useCallback, useRef } from "react";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { SectionList } from "react-native";
import { getLanguage } from "../../../store/reducers/settings/settingsSelectors";
import { useAppSelector } from "../../../store";
import { QuestionsAndAnswers } from "../../../components/App/help/QuestionsAndAnswers";

export const Help = () => {
    const navigate = useNavigate();
    const handleNavigateToSettings = useCallback(() => {
        navigate("settings");
    }, [navigate]);
    const sectionListRef = useRef<SectionList>(null);
    const language = useAppSelector(getLanguage);

    return (
        <ThemedView background stretch>
            <SiteNavigationButtons handleBack={handleNavigateToSettings} titleFontSize={40} title={"Help"} />
            <PageContent ghost>
                <QuestionsAndAnswers />
            </PageContent>
        </ThemedView>
    );
};
