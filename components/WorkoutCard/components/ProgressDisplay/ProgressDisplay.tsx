import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../theme/context";
import { useCallback, useContext, useMemo } from "react";
import { styles } from "../../styles";
import { Pressable, View } from "react-native";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { HStack } from "../../../HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { Text } from "../../../Themed/ThemedText/Text";
import { swipableContext } from "../../Swipeable";

function truncateTo3rdSignificantDigit(number: number) {
  // Find the 3rd significant digit by converting the number to a string
  const numberString = number.toString();
  const dotIndex = numberString.indexOf(".");

  if (dotIndex === -1) {
    // The number doesn't have a decimal point, so return the number as is
    return number;
  }

  const significantDigits = numberString.substring(0, dotIndex + 3);
  return parseFloat(significantDigits);
}

export type ProgressData = { name: string; percent: number };
type ProgressDisplayType = "WORKOUT" | "MEASUREMENT";
export interface ProgressDisplayProps {
  progressData: ProgressData;
  onPress: () => void;
}

export const ProgressDisplay = ({ progressData, onPress }: ProgressDisplayProps) => {
  const isPositive = progressData.percent > 100;

  const processedPercent = truncateTo3rdSignificantDigit(isPositive ? progressData.percent - 100 : 100 - progressData.percent);
  const even = processedPercent === 0;

  const active = useContext(swipableContext);
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { secondaryColor } = useTheme();

  const icon = useMemo(() => {
    if (even) {
      return "arrow-right";
    }
    if (isPositive) {
      return "arrow-up";
    }
    return "arrow-down";
  }, [isPositive, even]);

  const text = useMemo(() => {
    if (even) {
      return <>{t("progress_text_1").concat(t("progress_stayed"))}</>;
    }
    if (language === "en") {
      return (
        <>
          {t("progress_text_1").concat(progressData.name, " ", t(isPositive ? "progress_increased" : "progress_decreased"))} by {processedPercent}&thinsp;%
        </>
      );
    }
    return (
      <>
        {t("progress_text_1")} {processedPercent}&thinsp;% {t(isPositive ? "progress_increased" : "progress_decreased")}
      </>
    );
  }, [even, language, t, progressData.name, isPositive, processedPercent]);

  const chartStyle = useMemo(() => {
    if (isPositive) {
      return { color: "green" };
    }
    if (even) {
      return { color: secondaryColor };
    }
    return { color: "rgb(255,100,100)" };
  }, [isPositive, secondaryColor, even]);
  const hintStyles = useMemo(() => [styles.hint, { color: secondaryColor }], [secondaryColor]);

  const handlePress = useCallback(() => {
    if (active) {
      return;
    }
    onPress();
  }, [active, onPress]);

  return (
    <Pressable onPress={handlePress}>
      <ThemedView style={styles.progressWrapper} secondary>
        <HStack style={styles.diffWrapper}>
          <HStack style={styles.diffWrapper}>
            <ThemedMaterialCommunityIcons secondary name={icon} color={chartStyle.color} size={26} />
            <View>
              <Text style={styles.text}>{text}</Text>
              <Text style={hintStyles}>{t("progress_text_hint")}</Text>
            </View>
          </HStack>
        </HStack>
      </ThemedView>
    </Pressable>
  );
};
