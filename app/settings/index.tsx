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
import React, { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoutesParamaters, useNavigate } from "../../hooks/navigate";
import { SettingsNavigator } from "../../components/App/settings/SettingsNavigator/SettingsNavigator";
import { useAppSelector } from "../../store";
import { getIsPro } from "../../store/selectors/purchases";
import { ThemedPressable } from "../../components/Themed/Pressable/Pressable";
import { Text } from "../../components/Themed/ThemedText/Text";

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
    const navigate = useNavigate();
    const getTitleConfig = useCallback((titleKey: string) => ({ title: t(titleKey), size: 24 }) as const, [t]);
    const isPro = useAppSelector(getIsPro);

    const navigateToPurchase = useCallback(() => {
        if (!isPro) {
            navigate("purchase");
        }
    }, [isPro, navigate]);

    const navigateToStatistics = useCallback(() => {
        navigate("settings/statistics");
    }, [navigate]);

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
            <SiteNavigationButtons titleFontSize={40} title={t("profile")} />
            <PageContent scrollable ignorePadding ignoreGap ghost>
                <PageContent scrollable={false} ignoreGap style={{ paddingBottom: 40 }} ghost>
                    <ThemedPressable onPress={navigateToPurchase} cta={!isPro} style={{ padding: 15, marginBottom: 10 }} round>
                        <Text textCta={!isPro} cta={isPro} ghost style={{ fontSize: 22 }}>
                            {isPro ? t("profile_pro") : t("profile_standard")}
                        </Text>
                    </ThemedPressable>
                    <SettingsNavigator title={t("statistics")} onPress={navigateToStatistics} />
                </PageContent>
                <PageContent scrollable={false} ignoreGap ghost titleConfig={{ title: t("settings"), size: 30 }}>
                    <FlatList scrollEnabled={false} ref={ref} data={settingsPages} contentContainerStyle={styles.contentWrapper} renderItem={({ item: Item }) => Item}></FlatList>
                </PageContent>
            </PageContent>
        </ThemedView>
    );
}
