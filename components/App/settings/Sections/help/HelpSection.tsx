import { SettingsNavigator } from "../../SettingsSection/SettingsNavigator";
import { PageContent } from "../../../../PageContent/PageContent";
import { ProfileContent } from "../../components/ProfileContent/ProfileContent";

const helpTitleConfig = { title: "Help", size: 30 } as const;
export const HelpSection = () => {
    return (
        <PageContent titleConfig={helpTitleConfig} background paddingTop={30}>
            <ProfileContent>
                <SettingsNavigator page={"settings/help"} title={"FAQ"} />
            </ProfileContent>
        </PageContent>
    );
};
