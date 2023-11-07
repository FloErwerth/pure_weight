import { IsoDate } from "../../../../types/date";
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

export type ProgressData = { date?: IsoDate; diff?: { absolute: number; percent: string } };
export interface ProgressDisplayProps {
  progressData: ProgressData;
  onPress: () => void;
}
export const WorkoutProgress = ({ progressData, onPress }: ProgressDisplayProps) => {
  const isPositive = progressData.diff !== undefined && progressData.diff.absolute > 0;
  const active = useContext(swipableContext);
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { secondaryColor } = useTheme();

  const text = useMemo(() => {
    if (language === "en") {
      return (
        <>
          {t("progress_text_1").concat("", t(isPositive ? "progress_increased" : "progress_decreased"))} by {progressData.diff?.percent}&thinsp;%
        </>
      );
    } else {
      return (
        <>
          {t("progress_text_1")} {progressData.diff?.percent}&thinsp;% {t(isPositive ? "progress_increased" : "progress_decreased")}
        </>
      );
    }
  }, [isPositive, language, progressData.diff?.percent, t]);

  const chartStyle = useMemo(() => {
    if (isPositive) {
      return { color: "green" };
    } else {
      return { color: "grey" };
    }
  }, [isPositive]);
  const hintStyles = useMemo(() => [styles.hint, { color: secondaryColor }], [secondaryColor]);

  const handlePress = useCallback(() => {
    if (active) {
      return;
    }
    onPress();
  }, [active, onPress]);

  if (progressData.diff === undefined) {
    return null;
  }

  return (
    <Pressable onPress={handlePress}>
      <ThemedView style={styles.progressWrapper} secondary>
        <HStack style={styles.diffWrapper}>
          <HStack style={styles.diffWrapper}>
            <ThemedMaterialCommunityIcons secondary name={isPositive ? "arrow-up" : "arrow-down"} color={chartStyle.color} size={26} />
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
