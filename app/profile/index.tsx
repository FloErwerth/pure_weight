import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../components/PageContent/PageContent";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import React, { useCallback, useMemo } from "react";
import { useNavigate } from "../../hooks/navigate";
import { SettingsNavigator } from "../../components/App/settings/SettingsNavigator/SettingsNavigator";
import { useAppSelector } from "../../store";
import { getIsPro } from "../../store/selectors/purchases";
import { ThemedPressable } from "../../components/Themed/Pressable/Pressable";
import { Text } from "../../components/Themed/ThemedText/Text";
import { HStack } from "../../components/Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { getOverallStats } from "../../store/selectors/workout/workoutSelectors";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";

export function Profile() {
    const { t } = useTypedTranslation();
    const navigate = useNavigate();
    const isPro = useAppSelector(getIsPro);
    const overallStats = useAppSelector(getOverallStats);
    const navigateToPurchase = useCallback(() => {
        if (!isPro) {
            navigate("purchase");
        }
    }, [isPro, navigate]);

    const navigateToSettings = useCallback(() => {
        navigate("profile/settings");
    }, [navigate]);

    const mappedStats = useMemo(
        () =>
            Object.values(overallStats ?? {}).map((stat) => ({
                value: stat.value,
                unit: stat.unit,
                text: t(stat.translationKey),
            })),
        [overallStats, t],
    );

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons titleFontSize={40} title={t(TranslationKeys.PROFILE)} />
            <PageContent stretch scrollable ignorePadding ghost>
                <PageContent scrollable={false} stretch ghost>
                    <ThemedView round padding style={{ padding: 15 }}>
                        <Text>
                            {t(TranslationKeys.PROFILE_STATUS)}:{" "}
                            <Text cta={isPro} ghost>
                                {isPro ? "PRO" : "FREE"}
                            </Text>
                        </Text>
                    </ThemedView>
                    {!isPro && (
                        <ThemedPressable onPress={navigateToPurchase} cta style={{ marginBottom: 10 }} padding round>
                            <HStack ghost style={{ justifyContent: "space-between" }} center>
                                <HStack ghost gap center>
                                    <ThemedMaterialCommunityIcons name="crown" size={24} textCta ghost />
                                    <Text textCta ghost style={{ fontSize: 22 }}>
                                        {t(TranslationKeys.PROFILE_STANDARD)}
                                    </Text>
                                </HStack>
                                <ThemedMaterialCommunityIcons name="chevron-right" size={24} textCta ghost />
                            </HStack>
                        </ThemedPressable>
                    )}
                    <SettingsNavigator stretch={false} title={t(TranslationKeys.SETTINGS)} onPress={navigateToSettings} />

                    <PageContent paddingTop={20} ignorePadding ghost titleConfig={{ title: t(TranslationKeys.STATISTICS), size: 24 }}>
                        <ThemedView round input padding>
                            {mappedStats.map((stat) => {
                                return (
                                    <ThemedView key={`${stat.value} ${stat.text}`} padding round ghost>
                                        <HStack center ghost style={{ justifyContent: "space-evenly" }}>
                                            <Text ghost style={{ fontSize: 30, flex: 0.5 }}>
                                                {stat.value} {stat?.unit}
                                            </Text>
                                            <Text stretch ghost>
                                                {stat.text}
                                            </Text>
                                        </HStack>
                                    </ThemedView>
                                );
                            })}
                        </ThemedView>
                    </PageContent>
                    <ThemedView ghost stretch />
                </PageContent>
            </PageContent>
        </ThemedView>
    );
}
