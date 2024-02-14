import { SettingsNavigator } from "../../SettingsNavigator/SettingsNavigator";
import { PageContent } from "../../../../PageContent/PageContent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "../../../../../hooks/navigate";
import { useCallback } from "react";

export const HelpSection = () => {
    const { t } = useTranslation();
    const helpTitleConfig = { title: t("help_section_title"), size: 30 } as const;
    const navigate = useNavigate();

    const handleNavigateToManual = useCallback(() => {
        navigate("settings/manual");
    }, [navigate]);

    return (
        <PageContent titleConfig={helpTitleConfig} background>
            <SettingsNavigator onPress={handleNavigateToManual} title={t("settings_help_content")} />
        </PageContent>
    );
};
