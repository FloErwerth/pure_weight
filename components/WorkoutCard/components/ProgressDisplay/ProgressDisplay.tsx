import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../theme/context";
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

import { getLanguage } from "../../../../store/reducers/settings/settingsSelectors";

type Trend = { percent: number; name?: string };
export interface ProgressDisplayProps {
    onPress: () => void;
    higherIsBetter?: boolean;
    trend: Trend | undefined;
    type: "Workout" | "Measurement";
}

const useText = (
    type: "Workout" | "Measurement",
    even: boolean,
    isPositiveTrend: boolean = true,
    processedPercent: number,
    trend?: Trend,
) => {
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();

    const workoutText = useMemo(() => {
        if (even) {
            return `${t("progress_text_even")}`;
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
    const positivePercentage = useMemo(() => Boolean((trend?.percent ?? 100) > 100), [trend?.percent]);
    const progressDisplayPositive = useMemo(() => {
        if (higherIsBetter) {
            return positivePercentage;
        }
        return !positivePercentage;
    }, [higherIsBetter, positivePercentage]);

    const percent = useMemo(() => {
        if (trend?.percent === undefined || trend?.percent === 0) {
            return 0;
        }
        if (positivePercentage) {
            return trend.percent - 100;
        }
        return 100 - trend.percent;
    }, [positivePercentage, trend?.percent]);

    const processedPercent = trunicateToNthSignificantDigit(percent);

    const even = processedPercent === 0;
    const text = useText(type, even, positivePercentage, processedPercent, trend);
    const active = useContext(swipableContext);
    const { secondaryColor } = useTheme();

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
            return { color: "green" };
        }
        if (even) {
            return { color: secondaryColor };
        }
        return { color: "rgb(255,100,100)" };
    }, [progressDisplayPositive, even, secondaryColor]);

    const handlePress = useCallback(() => {
        if (active) {
            return;
        }
        onPress();
    }, [active, onPress]);

    if (!trend) {
        return null;
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
