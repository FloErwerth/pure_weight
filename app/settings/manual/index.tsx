import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../components/PageContent/PageContent";
import { useNavigate } from "../../../hooks/navigate";
import { useCallback } from "react";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { QuestionsAndAnswers } from "../../../components/App/help/QuestionsAndAnswers";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../store";
import { setSearchManual } from "../../../store/reducers/settings";
import { Searchbar } from "../../../components/Searchbar/Searchbar";

export const Manual = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleNavigateToSettings = useCallback(() => {
        navigate("settings");
    }, [navigate]);
    const { t } = useTranslation();

    const handleSetSearchManual = useCallback(
        (search?: string) => {
            dispatch(setSearchManual(search));
        },
        [dispatch],
    );

    return (
        <ThemedView background stretch>
            <SiteNavigationButtons handleBack={handleNavigateToSettings} titleFontSize={40} title={t("settings_help_content")} />
            <PageContent ghost paddingTop={10}>
                <Searchbar handleSetSearchManual={handleSetSearchManual} />
            </PageContent>
            <PageContent paddingTop={20} stretch ghost>
                <QuestionsAndAnswers />
            </PageContent>
        </ThemedView>
    );
};
