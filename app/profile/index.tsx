import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { PageContent } from "../../components/PageContent/PageContent";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import React, { useCallback } from "react";
import { useNavigate } from "../../hooks/navigate";
import { SettingsNavigator } from "../../components/App/settings/SettingsNavigator/SettingsNavigator";
import { useAppSelector } from "../../store";
import { getIsPro } from "../../store/selectors/purchases";
import { ThemedPressable } from "../../components/Themed/Pressable/Pressable";
import { Text } from "../../components/Themed/ThemedText/Text";
import { HStack } from "../../components/Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { getOverallStats } from "../../store/selectors/workout/workoutSelectors";

export function Profile() {
    const { t } = useTranslation();
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

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons titleFontSize={40} title={t("profile")} />
            <PageContent scrollable ignorePadding ghost>
                <PageContent scrollable={false} ghost>
                    <ThemedView round padding style={{ padding: 15 }}>
                        <Text>
                            {t("profile_status")}:{" "}
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
                                        {t("profile_standard")}
                                    </Text>
                                </HStack>
                                <ThemedMaterialCommunityIcons name="chevron-right" size={24} textCta ghost />
                            </HStack>
                        </ThemedPressable>
                    )}
                    <SettingsNavigator title={t("settings")} onPress={navigateToSettings} />

                    <PageContent paddingTop={20} ignorePadding ghost titleConfig={{ title: t("statistics"), size: 24 }}>
                        <ThemedView round input padding>
                            {Object.values(overallStats ?? {})?.map((stat) => {
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
                </PageContent>
            </PageContent>
        </ThemedView>
    );
}
