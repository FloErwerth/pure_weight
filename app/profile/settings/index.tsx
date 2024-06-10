import { FlatList, StyleSheet } from "react-native";
import { PageContent } from "../../../components/PageContent/PageContent";
import React, { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useNavigateBack } from "../../../hooks/navigate";
import { GeneralSettings } from "../../../components/App/settings/Sections/generalSettings";
import { WorkoutSettings } from "../../../components/App/settings/Sections/workout";
import { Display } from "../../../components/App/settings/Sections/display";
import { HelpSection } from "../../../components/App/settings/Sections/help/HelpSection";
import { DevelopmentSelection } from "../../../components/App/settings/components/Selections/DevelopmentSelection/DevelopmentSelection";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Footer } from "../../../components/Footer/Footer";
import { RoutesParamaters } from "../../../types/navigation";
import { useTypedTranslation } from "../../../locales/i18next";
import { TranslationKeys } from "../../../locales/translationKeys";

const styles = StyleSheet.create({
    contentWrapper: {
        paddingVertical: 20,
        gap: 20,
    },
});
const isDev = process.env["EXPO_PUBLIC_APP_VARIANT"] === "development";

export const Settings = ({ route: { params } }: NativeStackScreenProps<RoutesParamaters, "profile/settings/index">) => {
    const navigateBack = useNavigateBack();
    const { t } = useTypedTranslation();
    const title = useMemo(() => t(TranslationKeys.SETTINGS), [t]);
    const getTitleConfig = useCallback((titleKey: TranslationKeys) => ({ title: t(titleKey), size: 24 }) as const, [t]);
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
            <PageContent scrollable={false} ignorePadding key="GENERAL SETTINGS" background titleConfig={getTitleConfig(TranslationKeys.GENERAL)}>
                <GeneralSettings />
            </PageContent>,
            <PageContent scrollable={false} ignorePadding key="WORKOUT SETTINGS" background titleConfig={getTitleConfig(TranslationKeys.WORKOUT)}>
                <WorkoutSettings />
            </PageContent>,
            <PageContent scrollable={false} ignorePadding key="DISPLAY SETTINGS" background titleConfig={getTitleConfig(TranslationKeys.DISPLAY)}>
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
                <Footer showRestore={false} />
            </PageContent>
        </ThemedView>
    );
};
