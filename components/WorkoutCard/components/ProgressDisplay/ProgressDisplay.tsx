import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../theme/context";
import { useCallback, useContext, useMemo } from "react";
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

export interface ProgressDisplayProps {
    onPress: () => void;
    higherIsBetter?: boolean;
    wasPositive?: boolean;
    percent: number;
    name: string;
    type: "Workout" | "Measurement";
}

const useText = (type: "Workout" | "Measurement", even: boolean, higherPercentage: boolean = true, processedPercent: number, name: string) => {
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();

    const workoutText = useMemo(() => {
        if (even) {
            return <>{t("progress_text_even")}</>;
        }
        if (language === "en") {
            return (
                <>
                    {t("progress_text_1").concat(name, " ", t(higherPercentage ? "progress_increased" : "progress_decreased"))} by {processedPercent}
                    &thinsp;%
                </>
            );
        }
        return (
            <>
                {t("progress_text_1")} {processedPercent}&thinsp;% {t(higherPercentage ? "progress_increased" : "progress_decreased")}
            </>
        );
    }, [even, language, t, processedPercent, higherPercentage, name]);

    const measurementText = useMemo(() => {
        if (even) {
            if (language === "en") {
                return <>No changes on your measurement</>;
            }
            return <>Keine Veränderung für deine Messung</>;
        }
        if (higherPercentage) {
            if (language === "en") {
                return (
                    <>
                        Your measurement {name} {t("progress_increased")} by {processedPercent}&thinsp;%
                    </>
                );
            }
            return (
                <>
                    Deine Messung {name} ist um {processedPercent}&thinsp;% {t("progress_increased")}
                </>
            );
        }
        if (language === "en") {
            return (
                <>
                    Your measurement {name} {t("progress_decreased")} by {processedPercent}&thinsp;%
                </>
            );
        }
        return (
            <>
                Deine Messung {name} ist um {processedPercent}&thinsp;% {t("progress_decreased")}
            </>
        );
    }, [even, higherPercentage, language, name, processedPercent, t]);

    if (type === "Measurement") {
        return measurementText;
    }
    return workoutText;
};

export const ProgressDisplay = ({ percent, onPress, higherIsBetter = true, wasPositive, name, type }: ProgressDisplayProps) => {
    const isPositive = wasPositive && higherIsBetter;
    const processedPercent = trunicateToNthSignificantDigit(percent ?? 0);
    const even = processedPercent === 0;
    const text = useText(type, even, wasPositive, processedPercent, name);

    const active = useContext(swipableContext);
    const { t } = useTranslation();
    const { secondaryColor } = useTheme();

    const icon = useMemo(() => {
        if (even) {
            return "arrow-right";
        }
        if (wasPositive) {
            return "arrow-up";
        }
        return "arrow-down";
    }, [even, wasPositive]);

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

    return (
        <ThemedPressable secondary style={styles.progressWrapper} onPress={handlePress}>
            <HStack secondary style={styles.diffWrapper}>
                <HStack secondary style={styles.diffWrapper}>
                    <ThemedMaterialCommunityIcons secondary name={icon} color={chartStyle.color} size={26} />
                    <ThemedView stretch secondary>
                        <Text secondary style={styles.text}>
                            {text}
                        </Text>
                        <Text secondary style={styles.hint}>
                            {t("progress_text_hint")}
                        </Text>
                    </ThemedView>
                </HStack>
            </HStack>
        </ThemedPressable>
    );
};
