import { useAppSelector } from "../../store";
import { getPreviousTraining } from "../../store/selectors";
import { Text } from "../Themed/ThemedText/Text";
import { View } from "react-native";
import { borderRadius } from "../../theme/border";
import { VStack } from "../VStack/VStack";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/context";
import { useMemo } from "react";
import { HStack } from "../HStack/HStack";
import { styles } from "./styles";

interface PreviousTrainingProps {
  exerciseIndex: number;
  activeSetIndex: number;
}
export const PreviousTraining = ({ exerciseIndex, activeSetIndex }: PreviousTrainingProps) => {
  const getPreviousTrainingFn = useAppSelector(getPreviousTraining);
  const receivedPreviousTraining = useMemo(() => getPreviousTrainingFn(exerciseIndex), [exerciseIndex, getPreviousTrainingFn]);
  const { t } = useTranslation();
  const { textDisabled, componentBackgroundColor, mainColor, secondaryColor, inputFieldBackgroundColor } = useTheme();

  const mappedData = useMemo(
    () =>
      receivedPreviousTraining?.vals.map(({ weight, reps }, index) => {
        const highlight = activeSetIndex === index;
        const filled = activeSetIndex > index;
        const highlightWrapperStyles = { backgroundColor: highlight ? inputFieldBackgroundColor : "transparent" };
        const computedColor = highlight || filled ? mainColor : secondaryColor;
        return (
          <HStack key={Math.random() * 102} style={[styles.innerWrapper, highlightWrapperStyles]}>
            <Text style={[styles.setDisplayStyle, { color: computedColor }]}>{index + 1}</Text>
            <Text style={[{ color: computedColor }, styles.set]}>{weight}</Text>
            <Text style={[{ color: computedColor }, styles.set]}>{reps}</Text>
          </HStack>
        );
      }),
    [activeSetIndex, inputFieldBackgroundColor, mainColor, receivedPreviousTraining?.vals, secondaryColor],
  );

  if (!receivedPreviousTraining) {
    return null;
  }

  const { date, vals } = receivedPreviousTraining;
  if (!vals || vals?.length === 0 || vals?.some((val) => val === undefined)) {
    return null;
  }

  return (
    <View>
      <Text style={{ fontSize: 16, marginBottom: 10, color: textDisabled }}>
        {t("previous_training_title_with_date")}
        {date}
      </Text>
      <View style={{ padding: 10, borderRadius, backgroundColor: componentBackgroundColor }}>
        {vals?.length > 0 && (
          <VStack style={{ backgroundColor: componentBackgroundColor }}>
            <HStack style={styles.innerWrapper}>
              <Text style={[styles.setDisplayStyle, { color: secondaryColor }]}>{"#"}</Text>
              <Text style={[{ color: secondaryColor }, styles.set]}>{t("training_header_weight")}</Text>
              <Text style={[{ color: secondaryColor }, styles.set]}>{t("training_header_reps")}</Text>
            </HStack>
            {mappedData}
          </VStack>
        )}
      </View>
    </View>
  );
};
