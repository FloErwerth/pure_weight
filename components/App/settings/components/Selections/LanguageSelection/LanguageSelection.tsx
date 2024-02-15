import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import * as Haptics from "expo-haptics";
import { ImpactFeedbackStyle } from "expo-haptics";
import { setLanguage } from "../../../../../../store/reducers/settings";
import GermanFlag from "../../../../../../media/icons/GermanFlag.svg";
import AmericanFlag from "../../../../../../media/icons/UsaFlag.svg";
import { getLanguage } from "../../../../../../store/reducers/settings/settingsSelectors";
import { SelectableSetting, SvgType } from "../../../SelectableSetting/SelectableSetting";
import { selectionStyles } from "../../selectionStyles";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../../BottomSheetModal/ThemedBottomSheetModal";
import { SettingsNavigator } from "../../../SettingsNavigator/SettingsNavigator";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { PageContent } from "../../../../../PageContent/PageContent";

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

    return (
        <>
            <ThemedView round style={selectionStyles.vStack}>
                <SettingsNavigator title={t("settings_language")} onPress={openBottomSheet} />
            </ThemedView>
            <ThemedBottomSheetModal title={t("settings_language")} ref={ref}>
                <PageContent ghost paddingTop={20}>
                    <SelectableSetting
                        prependedExtraContent={germanSvg}
                        selected={isGerman}
                        onSelect={() => handleSelectLanguage("de")}
                        titleKey="settings_language_german"
                    />
                    <SelectableSetting
                        prependedExtraContent={americanSvg}
                        selected={!isGerman}
                        onSelect={() => handleSelectLanguage("en")}
                        titleKey="settings_language_english"
                    />
                </PageContent>
            </ThemedBottomSheetModal>
        </>
    );
};
