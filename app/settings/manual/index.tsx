import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../components/PageContent/PageContent";
import { useCallback } from "react";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { QuestionsAndAnswers } from "../../../components/App/help/QuestionsAndAnswers";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../store";
import { setSearchManual } from "../../../store/reducers/settings";
import { Searchbar } from "../../../components/Searchbar/Searchbar";
import { useNavigateBack } from "../../../hooks/navigate";

export const Manual = () => {
    const dispatch = useAppDispatch();
    const navigateBack = useNavigateBack();
    const { t } = useTranslation();

    const handleSetSearchManual = useCallback(
        (search?: string) => {
            dispatch(setSearchManual(search));
        },
        [dispatch],
    );

    return (
        <ThemedView background stretch>
            <SiteNavigationButtons backButtonAction={navigateBack} titleFontSize={40} title={t("settings_help_content")} />
            <PageContent ghost paddingTop={10}>
                <Searchbar handleSetSearchManual={handleSetSearchManual} />
            </PageContent>
            <PageContent paddingTop={20} stretch ghost>
                <QuestionsAndAnswers />
            </PageContent>
        </ThemedView>
    );
};
