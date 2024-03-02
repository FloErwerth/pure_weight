import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { PageContent } from "../../components/PageContent/PageContent";
import { DevelopmentSelection } from "../../components/App/settings/components/Selections/DevelopmentSelection/DevelopmentSelection";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { FlatList, StyleSheet } from "react-native";
import { Display } from "../../components/App/settings/Sections/display";
import { GeneralSettings } from "../../components/App/settings/Sections/generalSettings";
import { HelpSection } from "../../components/App/settings/Sections/help/HelpSection";
import { WorkoutSettings } from "../../components/App/settings/Sections/workout";
import { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoutesParamaters } from "../../hooks/navigate";

const styles = StyleSheet.create({
    contentWrapper: {
        paddingVertical: 20,
        gap: 20,
    },
});

const isDev = process.env["EXPO_PUBLIC_APP_VARIANT"] === "development";
export function Settings({ route: { params } }: NativeStackScreenProps<RoutesParamaters, "tabs/settings">) {
    const { t } = useTranslation();
    const ref = useRef<FlatList>(null);

    const getTitleConfig = useCallback((titleKey: string) => ({ title: t(titleKey), size: 30 }) as const, [t]);

    useEffect(() => {
        setTimeout(() => {
            if (params && params?.scrollIndex !== undefined) {
                ref.current?.scrollToIndex({ index: params.scrollIndex, animated: true });
            }
        }, 250);
    }, [params]);

    const settingsPages = useMemo(
        () => [
            <PageContent key="GENERAL SETTINGS" background titleConfig={getTitleConfig("general")}>
                <GeneralSettings />
            </PageContent>,
            <PageContent key="WORKOUT SETTINGS" background titleConfig={getTitleConfig("workout")}>
                <WorkoutSettings />
            </PageContent>,
            <PageContent key="DISPLAY SETTINGS" background titleConfig={getTitleConfig("display")}>
                <Display />
            </PageContent>,
            <HelpSection key="HELP SETTINGS" />,
            <Fragment key="DEVELOPMENT">
                {isDev && (
                    <PageContent background>
                        <DevelopmentSelection />
                    </PageContent>
                )}
            </Fragment>,
        ],
        [getTitleConfig],
    );

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons titleFontSize={40} title={t("settings")} />
            <FlatList
                ref={ref}
                data={settingsPages}
                contentContainerStyle={styles.contentWrapper}
                renderItem={({ item: Item }) => Item}></FlatList>
        </ThemedView>
    );
}
