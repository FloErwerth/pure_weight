import { UnitSystemSection } from "../../components/Selections/UnitSystemSelection/UnitSystemSection";
import { LanguageSelection } from "../../components/Selections/LanguageSelection/LanguageSelection";
import { SettingsNavigator } from "../../SettingsNavigator/SettingsNavigator";
import { useCallback, useMemo } from "react";
import { Linking } from "react-native";
import { noop } from "lodash";
import { useTranslation } from "react-i18next";

const reviewURL = "https://apps.apple.com/de/app/pure-weight/id6469710434?action=write-review";

export const GeneralSettings = () => {
    const { t } = useTranslation();

    const openReview = useCallback(() => {
        void Linking.openURL(reviewURL).catch(noop);
    }, []);

    const ratingContent = useMemo(
        () => ({
            title: t("settings_rating_title"),
            text: t("settings_rating_text"),
        }),
        [t],
    );

    return (
        <>
            <LanguageSelection />
            <UnitSystemSection />
            <SettingsNavigator title={t("rating")} content={ratingContent} onPress={openReview} />
        </>
    );
};
