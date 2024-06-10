import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import * as Haptics from "expo-haptics";
import { ImpactFeedbackStyle } from "expo-haptics";
import { setLanguage } from "../../../../../../store/reducers/settings";
import GermanFlag from "../../../../../../media/icons/GermanFlag.svg";
import AmericanFlag from "../../../../../../media/icons/UsaFlag.svg";
import { getLanguage } from "../../../../../../store/selectors/settings/settingsSelectors";
import { SelectableSetting, SvgType } from "../../../SelectableSetting/SelectableSetting";
import { selectionStyles } from "../../selectionStyles";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../../BottomSheetModal/ThemedBottomSheetModal";
import { SettingsNavigator } from "../../../SettingsNavigator/SettingsNavigator";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { PageContent } from "../../../../../PageContent/PageContent";
import { TranslationKeys } from "../../../../../../locales/translationKeys";

const germanSvg: SvgType = {
    Svg: GermanFlag,
    size: 24,
};

const americanSvg: SvgType = {
    Svg: AmericanFlag,
    size: 24,
};

export const LanguageSelection = () => {
    const { t, i18n } = useTranslation();
    const { ref, openBottomSheet } = useBottomSheetRef();
    const dispatch = useAppDispatch();
    const lang = useAppSelector(getLanguage);
    const isGerman = useMemo(() => lang === "de", [lang]);

    const handleSelectLanguage = useCallback(
        (language: "en" | "de") => {
            void Haptics.impactAsync(ImpactFeedbackStyle.Light);
            void i18n.changeLanguage(language);
            dispatch(setLanguage(language));
        },
        [dispatch, i18n],
    );

    const languageNavigatorTitle = useMemo(() => t("settings_language"), [t]);
    const modalTitle = useMemo(() => t("settings_language"), [t]);
    const handleSelectGerman = useCallback(() => handleSelectLanguage("de"), [handleSelectLanguage]);
    const handleSelectEnglish = useCallback(() => handleSelectLanguage("en"), [handleSelectLanguage]);
    return (
        <>
            <ThemedView round style={selectionStyles.vStack}>
                <SettingsNavigator title={languageNavigatorTitle} onPress={openBottomSheet} />
            </ThemedView>
            <ThemedBottomSheetModal title={modalTitle} ref={ref}>
                <PageContent ghost paddingTop={20}>
                    <SelectableSetting prependedExtraContent={germanSvg} selected={isGerman} onSelect={handleSelectGerman} titleKey={TranslationKeys.SETTINGS_LANGUAGE_GERMAN} />
                    <SelectableSetting prependedExtraContent={americanSvg} selected={!isGerman} onSelect={handleSelectEnglish} titleKey={TranslationKeys.SETTINGS_LANGUAGE_ENGLISH} />
                </PageContent>
            </ThemedBottomSheetModal>
        </>
    );
};
