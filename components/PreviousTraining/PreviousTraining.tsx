import { useAppSelector } from "../../store";
import { getPreviousTraining } from "../../store/selectors";
import { DoneSetDisplayRow } from "../DoneSetDisplayRow/DoneSetDisplayRow";
import { Text } from "../Themed/ThemedText/Text";
import { View } from "react-native";
import { borderRadius } from "../../theme/border";
import { VStack } from "../VStack/VStack";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/context";

export const PreviousTraining = () => {
  const previousTraining = useAppSelector(getPreviousTraining);
  const { t } = useTranslation();
  const { textDisabled, componentBackgroundColor } = useTheme();

  if (!previousTraining) {
    return null;
  }

  const { date, vals } = previousTraining;
  if (!vals || vals?.length === 0 || vals?.some((val) => val === undefined)) {
    return null;
  }

  return (
    <View>
      <Text style={{ fontSize: 16, marginBottom: 10, color: textDisabled }}>
        {t("previous_training_title_with_date")}
        {date}
      </Text>
      <View style={{ paddingTop: 10, paddingBottom: 15, borderRadius, backgroundColor: componentBackgroundColor }}>
        {vals?.length > 0 && (
          <VStack>
            <DoneSetDisplayRow />
            {vals.map((data, index) => {
              if (data?.weight && data?.reps) {
                const { weight, reps } = data;
                return <DoneSetDisplayRow key={weight + reps + index} setNumber={index + 1} setData={{ weight, reps }} />;
              }
            })}
          </VStack>
        )}
      </View>
    </View>
  );
};
