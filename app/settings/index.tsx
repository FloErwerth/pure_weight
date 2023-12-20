import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { PageContent } from "../../components/PageContent/PageContent";
import { DevelopmentSelection } from "../../components/App/settings/components/Selections/DevelopmentSelection/DevelopmentSelection";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { ScrollView } from "react-native";
import { Display } from "../../components/App/settings/Sections/display";
import { GeneralSettings } from "../../components/App/settings/Sections/generalSettings";
import { HelpSection } from "../../components/App/settings/Sections/help/HelpSection";
import { WorkoutSettings } from "../../components/App/settings/Sections/workout";

const isProduction = process.env["EXPO_PUBLIC_IS_PRODUCTION"] === "true";

export function Settings() {
    const { t } = useTranslation();

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons titleFontSize={40} title={t("settings")} />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <PageContent background paddingTop={10} titleConfig={{ title: t("general"), size: 30 }}>
                    <GeneralSettings />
                </PageContent>
                <PageContent background paddingTop={10} titleConfig={{ title: t("workout"), size: 30 }}>
                    <WorkoutSettings />
                </PageContent>
                <PageContent background paddingTop={30} titleConfig={{ title: t("display"), size: 30 }}>
                    <Display />
                </PageContent>
                <HelpSection />
                {!isProduction && (
                    <PageContent background paddingTop={30}>
                        <DevelopmentSelection />
                    </PageContent>
                )}
            </ScrollView>
        </ThemedView>
    );
}
