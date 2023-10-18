import { useAppSelector } from "../../store";
import { getPreviousTraining } from "../../store/selectors";
import { DoneSetDisplayRow } from "../DoneSetDisplayRow/DoneSetDisplayRow";
import { componentBackgroundColor, mainDisabledColor } from "../../app/theme/colors";
import { Text } from "../Text/Text";
import { View } from "react-native";
import { borderRadius } from "../../app/theme/border";
import { VStack } from "../VStack/VStack";
import { useTranslation } from "react-i18next";

export const PreviousTraining = () => {
  const { date, vals: previousTraining } = useAppSelector(getPreviousTraining);
  const { t } = useTranslation();
  if (previousTraining === undefined || previousTraining.length === 0 || previousTraining.some((data) => data?.weight === undefined || data?.reps === undefined)) {
    return null;
  }

  return (
    <View>
      <Text style={{ fontSize: 16, marginBottom: 10, color: mainDisabledColor }}>
        {t("previous_training_title_with_date")}
        {date}
      </Text>
      <View style={{ paddingTop: 10, paddingBottom: 15, borderRadius, backgroundColor: componentBackgroundColor }}>
        {previousTraining?.length > 0 && (
          <VStack style={{ gap: 10 }}>
            <DoneSetDisplayRow setNumber={"#"} setData={{ weight: t("training_header_weight"), reps: t("training_header_reps"), note: t("training_header_note") }} />
            {previousTraining?.map((data, index) => {
              if (data?.weight && data?.reps) {
                const { weight, reps, note } = data;
                return <DoneSetDisplayRow key={weight + reps + index} setNumber={index + 1} setData={{ weight, reps, note }} />;
              }
            })}
          </VStack>
        )}
      </View>
    </View>
  );
};
