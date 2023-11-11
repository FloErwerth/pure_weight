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
import { useAppSelector } from "../../../../store";
import { getLanguage } from "../../../../store/selectors";

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

export interface ProgressDisplayProps {
  onPress: () => void;
  higherIsBetter?: boolean;
  percent: number;
  name: string;
  type: "Workout" | "Measurement";
}

const useText = (type: "Workout" | "Measurement", even: boolean, higherPercentage: boolean, processedPercent: number, name: string) => {
  const language = useAppSelector(getLanguage);
  const { t } = useTranslation();

  const workoutText = useMemo(() => {
    if (even) {
      return <>{t("progress_text_1").concat(t("progress_stayed"))}</>;
    }
    if (language === "en") {
      return (
        <>
          {t("progress_text_1").concat(name, " ", t(higherPercentage ? "progress_increased" : "progress_decreased"))} by {processedPercent}&thinsp;%
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

export const ProgressDisplay = ({ percent, onPress, higherIsBetter = true, name, type }: ProgressDisplayProps) => {
  const higherPercentage = percent > 100;
  const isPositive = higherPercentage && higherIsBetter;

  const processedPercent = truncateTo3rdSignificantDigit(higherPercentage ? percent - 100 : 100 - percent);
  const even = processedPercent === 0;
  const text = useText(type, even, higherPercentage, processedPercent, name);

  const active = useContext(swipableContext);
  const { t } = useTranslation();
  const { secondaryColor } = useTheme();

  const icon = useMemo(() => {
    if (even) {
      return "arrow-right";
    }
    if (higherPercentage) {
      return "arrow-up";
    }
    return "arrow-down";
  }, [even, higherPercentage]);

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
