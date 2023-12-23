import { SettingsNavigator } from "../../SettingsSection/SettingsNavigator";
import { PageContent } from "../../../../PageContent/PageContent";
import { ProfileContent } from "../../components/ProfileContent/ProfileContent";
import { useTranslation } from "react-i18next";

const helpTitleConfig = { title: "Help", size: 30 } as const;
export const HelpSection = () => {
    const { t } = useTranslation();
    return (
        <PageContent titleConfig={helpTitleConfig} background paddingTop={30}>
            <ProfileContent>
                <SettingsNavigator page={"settings/manual"} title={t("settings_help_content")} />
            </ProfileContent>
        </PageContent>
    );
};
