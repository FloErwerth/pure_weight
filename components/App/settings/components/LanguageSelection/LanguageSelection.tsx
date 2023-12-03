import { ProfileContent } from "../SettingsSection/ProfileSection";
import { VStack } from "../../../../Stack/VStack/VStack";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { styles } from "./styles";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import * as Haptics from "expo-haptics";
import { ImpactFeedbackStyle } from "expo-haptics";
import { setLanguage } from "../../../../../store/reducers/settings";
import GermanFlag from "../../../../../media/icons/GermanFlag.svg";
import AmericanFlag from "../../../../../media/icons/UsaFlag.svg";
import { getLanguage } from "../../../../../store/reducers/settings/settingsSelectors";
import { SelectableSetting, SvgType } from "../../SelectableSetting/SelectableSetting";

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

    const dispatch = useAppDispatch();
    const lang = useAppSelector(getLanguage);
    const isGerman = useMemo(() => lang === "de", [lang]);

    const handleSelectLanguage = useCallback(
        (language: "en" | "de") => {
            void Haptics.impactAsync(ImpactFeedbackStyle.Light);
            i18n.changeLanguage(language);
            dispatch(setLanguage(language));
        },
        [dispatch, i18n],
    );

    return (
        <ProfileContent title={t("settings_language")}>
            <VStack style={styles.vStack}>
                <SelectableSetting svg={germanSvg} selected={isGerman} onSelect={() => handleSelectLanguage("de")} titleKey="settings_language_german" />
                <SelectableSetting svg={americanSvg} selected={!isGerman} onSelect={() => handleSelectLanguage("en")} titleKey="settings_language_english" />
            </VStack>
        </ProfileContent>
    );
};
