import { useTranslation } from "react-i18next";
import React, { useCallback, useContext, useMemo } from "react";
import { styles } from "../../styles";
import { HStack } from "../../../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { Text } from "../../../Themed/ThemedText/Text";
import { swipableContext } from "../../Swipeable";
import { useAppSelector } from "../../../../store";
import { trunicateToNthSignificantDigit } from "../../../../utils/number";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { ThemedView } from "../../../Themed/ThemedView/View";

import { getLanguage } from "../../../../store/selectors/settings/settingsSelectors";
import { useTheme } from "../../../../theme/context";
import { getIsPro } from "../../../../store/selectors/purchases";
import { useNavigate } from "../../../../hooks/navigate";

export type Trend = { percent: number; name?: string; isPositive?: boolean };
export interface ProgressDisplayProps {
    onPress: () => void;
    higherIsBetter?: boolean;
    trend: Trend | undefined;
    type: "Workout" | "Measurement";
}

const useText = (type: "Workout" | "Measurement", even: boolean, isPositiveTrend: boolean = true, processedPercent: number, trend?: Trend) => {
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();

    const workoutText = useMemo(() => {
        if (even) {
            if (language === "en") {
                return `Your performance at ${trend?.name} has not changed`;
            }
            return `Deine Leistung bei ${trend?.name} hat sich nicht verändert`;
        }
        if (language === "en") {
            return `Your performance at ${trend?.name} ${t(isPositiveTrend ? "increased" : "decreased")} by ${processedPercent}%`;
        }
        return `Deine Leistung bei ${trend?.name} ist um ${processedPercent}% ${t(isPositiveTrend ? "gestiegen" : "gefallen")}`;
    }, [even, language, t, processedPercent, isPositiveTrend, trend?.name]);

    const measurementText = useMemo(() => {
        if (even) {
            if (language === "en") {
                return "No changes on your measurement";
            }
            return "Keine Veränderung für deine Messung";
        }
        if (isPositiveTrend) {
            if (language === "en") {
                return `Your measurement ${trend?.name ?? ""} ${t("progress_increased")} by ${processedPercent} %`;
            }
            return `Deine Messung ${trend?.name ?? ""} ist um ${processedPercent} % ${t("progress_increased")}`;
        }
        if (language === "en") {
            return `Your measurement ${trend?.name ?? ""} ${t("progress_decreased")} by ${processedPercent} %`;
        }
        return `Deine Messung ${trend?.name ?? ""} ist um ${processedPercent} % ${t("progress_decreased")}`;
    }, [even, isPositiveTrend, language, trend?.name, processedPercent, t]);

    if (type === "Measurement") {
        return measurementText;
    }
    return workoutText;
};

export const ProgressDisplay = ({ trend, onPress, higherIsBetter = true, type }: ProgressDisplayProps) => {
    const pro = useAppSelector(getIsPro);
    const language = useAppSelector(getLanguage);
    const positivePercentage = useMemo(() => {
        if (trend?.isPositive === undefined) {
            return Boolean((trend?.percent ?? 0) > 0);
        }
        return trend.isPositive;
    }, [trend?.isPositive, trend?.percent]);
    const navigate = useNavigate();
    const navigateToPurchase = useCallback(() => {
        navigate("purchase");
    }, [navigate]);

    const isPartOfProText = useMemo(() => {
        if (language === "en") {
            return "Graphs are part of the PRO version";
        }
        return "Graphen sind Teil der PRO-Version";
    }, [pro]);

    const { successColor, errorColor } = useTheme();
    const progressDisplayPositive = useMemo(() => {
        if (higherIsBetter) {
            return positivePercentage;
        }
        return !positivePercentage;
    }, [higherIsBetter, positivePercentage]);

    const processedPercent = trunicateToNthSignificantDigit(trend?.percent ?? 0);
    const even = processedPercent === 0;
    const text = useText(type, even, positivePercentage, processedPercent, trend);
    const active = useContext(swipableContext);

    const icon = useMemo(() => {
        if (even) {
            return "arrow-right";
        }
        if (positivePercentage) {
            return "arrow-up";
        }
        return "arrow-down";
    }, [even, positivePercentage]);

    const chartStyle = useMemo(() => {
        if (progressDisplayPositive) {
            return { color: successColor };
        }
        if (even) {
            return { color: successColor };
        }
        return { color: errorColor };
    }, [progressDisplayPositive, even, errorColor, successColor]);

    const handlePress = useCallback(() => {
        if (active) {
            return;
        }
        onPress();
    }, [active, onPress]);

    if (!trend) {
        return null;
    }

    if (!pro) {
        return (
            <ThemedPressable secondary style={styles.progressWrapper} onPress={navigateToPurchase}>
                <HStack secondary style={styles.diffWrapper}>
                    <ThemedView stretch ghost>
                        <Text cta ghost style={styles.text}>
                            {isPartOfProText}
                        </Text>
                    </ThemedView>
                </HStack>
            </ThemedPressable>
        );
    }

    return (
        <ThemedPressable secondary style={styles.progressWrapper} onPress={handlePress}>
            <HStack secondary style={styles.diffWrapper}>
                <ThemedMaterialCommunityIcons secondary name={icon} color={chartStyle.color} size={20} />
                <ThemedView stretch background>
                    <Text secondary style={styles.text}>
                        {text}
                    </Text>
                </ThemedView>
                <ThemedMaterialCommunityIcons ghost name="chevron-right" size={20} />
            </HStack>
        </ThemedPressable>
    );
};
