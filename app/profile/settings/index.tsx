import { FlatList, StyleSheet } from "react-native";
import { PageContent } from "../../../components/PageContent/PageContent";
import React, { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { RoutesParamaters, useNavigateBack } from "../../../hooks/navigate";
import { useTranslation } from "react-i18next";
import { GeneralSettings } from "../../../components/App/settings/Sections/generalSettings";
import { WorkoutSettings } from "../../../components/App/settings/Sections/workout";
import { Display } from "../../../components/App/settings/Sections/display";
import { HelpSection } from "../../../components/App/settings/Sections/help/HelpSection";
import { DevelopmentSelection } from "../../../components/App/settings/components/Selections/DevelopmentSelection/DevelopmentSelection";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const styles = StyleSheet.create({
    contentWrapper: {
        paddingVertical: 20,
        gap: 20,
    },
});
const isDev = process.env["EXPO_PUBLIC_APP_VARIANT"] === "development";

export const Settings = ({ route: { params } }: NativeStackScreenProps<RoutesParamaters, "profile/settings/index">) => {
    const navigateBack = useNavigateBack();
    const { t } = useTranslation();
    const title = useMemo(() => t("settings"), [t]);
    const getTitleConfig = useCallback((titleKey: string) => ({ title: t(titleKey), size: 24 }) as const, [t]);
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
            <PageContent scrollable={false} ignorePadding key="GENERAL SETTINGS" background titleConfig={getTitleConfig("general")}>
                <GeneralSettings />
            </PageContent>,
            <PageContent scrollable={false} ignorePadding key="WORKOUT SETTINGS" background titleConfig={getTitleConfig("workout")}>
                <WorkoutSettings />
            </PageContent>,
            <PageContent scrollable={false} ignorePadding key="DISPLAY SETTINGS" background titleConfig={getTitleConfig("display")}>
                <Display />
            </PageContent>,
            <HelpSection key="HELP SETTINGS" />,
            <Fragment key="DEVELOPMENT">
                {isDev && (
                    <PageContent ignorePadding background>
                        <DevelopmentSelection />
                    </PageContent>
                )}
            </Fragment>,
        ],
        [getTitleConfig],
    );
    return (
        <ThemedView stretch background>
            <SiteNavigationButtons backButtonAction={navigateBack} title={title} />
            <PageContent scrollable safeBottom ignoreGap ghost>
                <FlatList scrollEnabled={false} ref={ref} data={settingsPages} contentContainerStyle={styles.contentWrapper} renderItem={({ item: Item }) => Item}></FlatList>
            </PageContent>
        </ThemedView>
    );
};
