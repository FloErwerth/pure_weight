import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { PageContent } from "../../components/PageContent/PageContent";
import { DevelopmentSelection } from "../../components/App/settings/components/Selections/DevelopmentSelection/DevelopmentSelection";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { ScrollView } from "react-native";
import { Display } from "./display";
import { GeneralSettings } from "./workout";

const isProduction = process.env["EXPO_PUBLIC_IS_PRODUCTION"] === "true";

export function Settings() {
    const { t } = useTranslation();

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons titleFontSize={40} title={t("settings")} />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <PageContent paddingTop={10} titleConfig={{ title: t("general"), size: 24 }}>
                    <GeneralSettings />
                </PageContent>
                <PageContent paddingTop={30} titleConfig={{ title: t("display"), size: 24 }}>
                    <Display />
                </PageContent>
                <PageContent paddingTop={30} titleConfig={{ title: "Hilfe", size: 24 }}>
                    {!isProduction && <DevelopmentSelection />}
                </PageContent>
            </ScrollView>
        </ThemedView>
    );
}
