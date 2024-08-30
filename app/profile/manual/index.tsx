import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../components/PageContent/PageContent";
import { useCallback, useEffect } from "react";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { QuestionsAndAnswers } from "../../../components/App/help/QuestionsAndAnswers";
import { useAppDispatch } from "../../../store";
import { setSearchManual } from "../../../store/reducers/settings";
import { Searchbar } from "../../../components/Searchbar/Searchbar";
import { useNavigateBack } from "../../../hooks/navigate";
import { useTypedTranslation } from "../../../locales/i18next";
import { TranslationKeys } from "../../../locales/translationKeys";

export const Manual = () => {
	const dispatch = useAppDispatch();
	const navigateBack = useNavigateBack();
	const { t } = useTypedTranslation();

	const handleSetSearchManual = useCallback(
		(search?: string) => {
			dispatch(setSearchManual(search));
		},
		[dispatch],
	);

	useEffect(() => {
		return () => {
			dispatch(setSearchManual(""));
		};
	}, []);

	return (
		<ThemedView background stretch>
			<SiteNavigationButtons backButtonAction={navigateBack} title={t(TranslationKeys.SETTINGS_HELP_CONTENT)} />
			<PageContent ghost paddingTop={10}>
				<Searchbar handleSetSearchManual={handleSetSearchManual} />
			</PageContent>
			<PageContent paddingTop={20} stretch ghost>
				<QuestionsAndAnswers />
			</PageContent>
		</ThemedView>
	);
};
