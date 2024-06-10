import { SettingsNavigator } from "../../SettingsNavigator/SettingsNavigator";
import { PageContent } from "../../../../PageContent/PageContent";
import { useNavigate } from "../../../../../hooks/navigate";
import { useCallback, useMemo } from "react";
import { Linking } from "react-native";
import { noop } from "lodash";
import { useTypedTranslation } from "../../../../../locales/i18next";
import { TranslationKeys } from "../../../../../locales/translationKeys";

export const HelpSection = () => {
    const { t } = useTypedTranslation();
    const helpTitleConfig = { title: t(TranslationKeys.HELP_SECTION_TITLE), size: 30 } as const;
    const navigate = useNavigate();

    const handleNavigateToManual = useCallback(() => {
        navigate("profile/settings/manual");
    }, [navigate]);

    const handleOpenContact = useCallback(() => {
        Linking.openURL("mailto:pureweight.app@gmail.com").catch(noop);
    }, []);

    const helpContentTitle = useMemo(() => t(TranslationKeys.SETTINGS_HELP_CONTENT), [t]);
    const contactTitle = useMemo(() => t(TranslationKeys.CONTACT), [t]);

    return (
        <PageContent scrollable={false} ignorePadding titleConfig={helpTitleConfig} background>
            <SettingsNavigator onPress={handleNavigateToManual} title={helpContentTitle} />
            <SettingsNavigator onPress={handleOpenContact} title={contactTitle} />
        </PageContent>
    );
};
