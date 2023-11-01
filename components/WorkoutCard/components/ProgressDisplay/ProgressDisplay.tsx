import { IsoDate } from "../../../../types/date";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../theme/context";
import { useMemo } from "react";
import { styles } from "../../styles";
import { Pressable, View } from "react-native";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { HStack } from "../../../HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { Text } from "../../../Themed/ThemedText/Text";

export interface ProgressDisplayProps {
  overallTrainingData: { date?: IsoDate; diff?: { absolute: number; percent: string } };
  handleNavigateToProgress: () => void;
}
export const ProgressDisplay = ({ overallTrainingData, handleNavigateToProgress }: ProgressDisplayProps) => {
  const isPositive = overallTrainingData.diff !== undefined && overallTrainingData.diff.absolute > 0;
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { secondaryColor } = useTheme();

  const text = useMemo(() => {
    if (language === "en") {
      return (
        <>
          {t("progress_text_1").concat("", t(isPositive ? "progress_increased" : "progress_decreased"))} by {overallTrainingData.diff?.percent}&thinsp;%
        </>
      );
    } else {
      return (
        <>
          {t("progress_text_1")} {overallTrainingData.diff?.percent}&thinsp;% {t(isPositive ? "progress_increased" : "progress_decreased")}
        </>
      );
    }
  }, [isPositive, language, overallTrainingData.diff?.percent, t]);

  const chartStyle = useMemo(() => {
    if (isPositive) {
      return { color: "green" };
    } else {
      return { color: "red", style: { transform: "rotate(180deg)" } };
    }
  }, [isPositive]);
  const hintStyles = useMemo(() => [styles.hint, { color: secondaryColor }], [secondaryColor]);

  if (overallTrainingData.diff === undefined) {
    return null;
  }

  return (
    <Pressable onPress={handleNavigateToProgress}>
      <ThemedView style={styles.progressWrapper} secondary>
        <HStack style={styles.diffWrapper}>
          <HStack style={styles.diffWrapper}>
            <ThemedMaterialCommunityIcons secondary name="arrow-up" style={chartStyle.style} color={chartStyle.color} size={26} />
            <View>
              <Text style={styles.text}>{text}</Text>
              <Text style={hintStyles}>{t("progress_text_hint")}</Text>
            </View>
          </HStack>
          <ThemedMaterialCommunityIcons secondary name="arrow-right" size={16} />
        </HStack>
      </ThemedView>
    </Pressable>
  );
};
