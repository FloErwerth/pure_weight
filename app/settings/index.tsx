import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { PageContent } from "../../components/PageContent/PageContent";
import { DevelopmentSelection } from "../../components/App/settings/components/Selections/DevelopmentSelection/DevelopmentSelection";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { FlatList } from "react-native";
import { Display } from "../../components/App/settings/Sections/display";
import { GeneralSettings } from "../../components/App/settings/Sections/generalSettings";
import { HelpSection } from "../../components/App/settings/Sections/help/HelpSection";
import { WorkoutSettings } from "../../components/App/settings/Sections/workout";
import { Fragment, useEffect, useMemo, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoutesParamaters } from "../../hooks/navigate";

const isProduction = process.env["EXPO_PUBLIC_IS_PRODUCTION"] === "true";

export function Settings({ route: { params } }: NativeStackScreenProps<RoutesParamaters, "tabs/settings">) {
    const { t } = useTranslation();
    const ref = useRef<FlatList>(null);

    useEffect(() => {
        setTimeout(() => {
            if (params && params?.scrollIndex !== undefined) {
                ref.current?.scrollToIndex({ index: params.scrollIndex, animated: true });
            }
        }, 250);
    }, [params]);

    const settingsPages = useMemo(
        () => [
            <PageContent key="GENERAL SETTINGS" background paddingTop={10} titleConfig={{ title: t("general"), size: 30 }}>
                <GeneralSettings />
            </PageContent>,
            <PageContent key="WORKOUT SETTINGS" background paddingTop={10} titleConfig={{ title: t("workout"), size: 30 }}>
                <WorkoutSettings />
            </PageContent>,
            <PageContent key="DISPLAY SETTINGS" background paddingTop={30} titleConfig={{ title: t("display"), size: 30 }}>
                <Display />
            </PageContent>,
            <HelpSection key="HELP SETTINGS" />,
            <Fragment key="DEVELOPMENT">
                {!isProduction && (
                    <PageContent background paddingTop={30}>
                        <DevelopmentSelection />
                    </PageContent>
                )}
            </Fragment>,
        ],
        [t],
    );

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons titleFontSize={40} title={t("settings")} />
            <FlatList ref={ref} data={settingsPages} contentContainerStyle={{ paddingBottom: 20 }} renderItem={({ item: Item }) => Item}></FlatList>
        </ThemedView>
    );
}
