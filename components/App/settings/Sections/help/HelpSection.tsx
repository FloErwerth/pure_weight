import { SettingsNavigator } from "../../SettingsSection/SettingsNavigator";
import { PageContent } from "../../../../PageContent/PageContent";
import { ProfileContent } from "../../components/ProfileContent/ProfileContent";

export const HelpSection = () => {
    return (
        <PageContent paddingTop={30}>
            <ProfileContent title="Hilfe">
                <SettingsNavigator title={"Workouts"} />
                <SettingsNavigator title={"Measurements"} />
            </ProfileContent>
        </PageContent>
    );
};
