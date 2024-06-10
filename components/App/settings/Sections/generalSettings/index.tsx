import { UnitSystemSection } from "../../components/Selections/UnitSystemSelection/UnitSystemSection";
import { LanguageSelection } from "../../components/Selections/LanguageSelection/LanguageSelection";
import { SettingsNavigator } from "../../SettingsNavigator/SettingsNavigator";
import { useCallback, useMemo } from "react";
import { Linking } from "react-native";
import { noop } from "lodash";
import { useTypedTranslation } from "../../../../../locales/i18next";
import { TranslationKeys } from "../../../../../locales/translationKeys";

const reviewURL = "https://apps.apple.com/de/app/pure-weight/id6469710434?action=write-review";

export const GeneralSettings = () => {
    const { t } = useTypedTranslation();

    const openReview = useCallback(() => {
        void Linking.openURL(reviewURL).catch(noop);
    }, []);

    const ratingContent = useMemo(
        () => ({
            title: t(TranslationKeys.SETTINGS_RATING_TITLE),
            text: t(TranslationKeys.SETTINGS_RATING_TEXT),
        }),
        [t],
    );

    const ratingTitle = useMemo(() => t(TranslationKeys.RATING), [t]);

    return (
        <>
            <LanguageSelection />
            <UnitSystemSection />
            <SettingsNavigator title={ratingTitle} content={ratingContent} onPress={openReview} />
        </>
    );
};
