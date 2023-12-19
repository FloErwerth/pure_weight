import { SettingsNavigator } from "../../SettingsSection/SettingsNavigator";
import { PageContent } from "../../../../PageContent/PageContent";
import { ProfileContent } from "../../components/ProfileContent/ProfileContent";

export const HelpSection = () => {
    return (
        <PageContent paddingTop={30}>
            <ProfileContent title="Hilfe">
                <SettingsNavigator page={"settings/help/faqs"} title={"FAQs"} />
                <SettingsNavigator page={"settings/help/workouts"} title={"Workouts"} />
                <SettingsNavigator page={"settings/help/measurements"} title={"Measurements"} />
            </ProfileContent>
        </PageContent>
    );
};
