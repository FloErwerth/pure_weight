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

type Trend = { isPositive?: boolean; percent: number; name: string };
export interface ProgressDisplayProps {
    onPress: () => void;
    higherIsBetter?: boolean;
    trend: Trend | undefined;
    type: "Workout" | "Measurement";
}

const useText = (type: "Workout" | "Measurement", even: boolean, higherPercentage: boolean = true, processedPercent: number, trend?: Trend) => {
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();

    const workoutText = useMemo(() => {
        if (even) {
            return `${t("progress_text_even")}`;
        }
        if (language === "en") {
            return `${t("progress_text_1").concat(trend?.name ?? "", " ", t(higherPercentage ? "progress_increased" : "progress_decreased"))} by ${processedPercent} %`;
        }
        return `${t("progress_text_1")} ${processedPercent}% ${t(higherPercentage ? "progress_increased" : "progress_decreased")}`;
    }, [even, language, t, processedPercent, higherPercentage, trend?.name]);

    const measurementText = useMemo(() => {
        if (even) {
            if (language === "en") {
                return "No changes on your measurement";
            }
            return "Keine Veränderung für deine Messung";
        }
        if (higherPercentage) {
            if (language === "en") {
                return `Your measurement ${trend?.name ?? ""} ${t("progress_increased")} by ${processedPercent} %`;
            }
            return `Deine Messung ${trend?.name ?? ""} ist um ${processedPercent} % ${t("progress_increased")}`;
        }
        if (language === "en") {
            return `Your measurement ${trend?.name ?? ""} ${t("progress_decreased")} by ${processedPercent} %`;
        }
        return `Deine Messung ${trend?.name ?? ""} ist um ${processedPercent} % ${t("progress_decreased")}`;
    }, [even, higherPercentage, language, trend?.name ?? "", processedPercent, t]);

    if (type === "Measurement") {
        return measurementText;
    }
    return workoutText;
};

export const ProgressDisplay = ({ trend, onPress, higherIsBetter = true, type }: ProgressDisplayProps) => {
    const isPositive = trend?.isPositive && higherIsBetter;
    const processedPercent = trunicateToNthSignificantDigit(trend?.percent ?? 0);

    const even = processedPercent === 0;
    const text = useText(type, even, isPositive, processedPercent, trend);
    const active = useContext(swipableContext);
    const { secondaryColor } = useTheme();

    const icon = useMemo(() => {
        if (even) {
            return "arrow-right";
        }
        if (trend?.isPositive) {
            return "arrow-up";
        }
        return "arrow-down";
    }, [even, trend?.isPositive]);

    const chartStyle = useMemo(() => {
        if (isPositive) {
            return { color: "green" };
        }
        if (even) {
            return { color: secondaryColor };
        }
        return { color: "rgb(255,100,100)" };
    }, [isPositive, secondaryColor, even]);

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
