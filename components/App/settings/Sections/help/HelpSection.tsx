import { SettingsNavigator } from "../../SettingsNavigator/SettingsNavigator";
import { PageContent } from "../../../../PageContent/PageContent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "../../../../../hooks/navigate";
import { useCallback } from "react";
import { Linking } from "react-native";
import { noop } from "lodash";

export const HelpSection = () => {
    const { t } = useTranslation();
    const helpTitleConfig = { title: t("help_section_title"), size: 30 } as const;
    const navigate = useNavigate();

    const handleNavigateToManual = useCallback(() => {
        navigate("profile/settings/manual");
    }, [navigate]);

    const handleOpenContact = useCallback(() => {
        Linking.openURL("mailto:pureweight.app@gmail.com").catch(noop);
    }, []);

    return (
        <PageContent scrollable={false} ignorePadding titleConfig={helpTitleConfig} background>
            <SettingsNavigator onPress={handleNavigateToManual} title={t("settings_help_content")} />
            <SettingsNavigator onPress={handleOpenContact} title={t("contact")} />
        </PageContent>
    );
};
