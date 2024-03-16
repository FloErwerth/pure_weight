import { useAppSelector } from "../../../store";
import { useNavigateBack } from "../../../hooks/navigate";
import { useTranslation } from "react-i18next";
import React from "react";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../components/PageContent/PageContent";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { getOverallStats } from "../../../store/selectors/workout/workoutSelectors";
import { HStack } from "../../../components/Stack/HStack/HStack";

export const Statistics = () => {
    const navigateBack = useNavigateBack();
    const { t } = useTranslation();
    const overallStats = useAppSelector(getOverallStats);

    return (
        <ThemedView background stretch>
            <SiteNavigationButtons backButtonAction={navigateBack} title={t("statistics")} />
            <PageContent paddingTop={20} stretch ghost>
                {Object.values(overallStats ?? {})?.map((stat) => {
                    return (
                        <ThemedView key={`${stat.value} ${stat.text}`} padding round input>
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
            </PageContent>
        </ThemedView>
    );
};
