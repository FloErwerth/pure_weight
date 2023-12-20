import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../components/PageContent/PageContent";
import { useNavigate } from "../../../hooks/navigate";
import { useCallback } from "react";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { QuestionsAndAnswers } from "../../../components/App/help/QuestionsAndAnswers";

export const Help = () => {
    const navigate = useNavigate();
    const handleNavigateToSettings = useCallback(() => {
        navigate("settings");
    }, [navigate]);

    return (
        <ThemedView background stretch>
            <SiteNavigationButtons handleBack={handleNavigateToSettings} titleFontSize={40} title={"Help"} />
            <PageContent ghost>
                <QuestionsAndAnswers />
            </PageContent>
        </ThemedView>
    );
};
