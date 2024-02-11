import { SettingsNavigator } from "../../SettingsSection/SettingsNavigator";
import { PageContent } from "../../../../PageContent/PageContent";
import { useTranslation } from "react-i18next";

export const HelpSection = () => {
    const { t } = useTranslation();
    const helpTitleConfig = { title: t("help_section_title"), size: 30 } as const;
    return (
        <PageContent titleConfig={helpTitleConfig} background paddingTop={30}>
            <SettingsNavigator page={"settings/manual"} title={t("settings_help_content")} />
        </PageContent>
    );
};
