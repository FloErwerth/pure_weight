import { trainStyles } from "../../train/trainStyles";
import { View } from "react-native";
import { HStack } from "../../../components/HStack/HStack";
import { Text } from "../../../components/Text/Text";
import { useTranslation } from "react-i18next";

interface TrainingHeaderProps {
  showPlaceholderForDoneButton?: boolean;
}
export const TrainingHeader = ({ showPlaceholderForDoneButton = true }: TrainingHeaderProps) => {
  const { t } = useTranslation();
  return (
    <HStack style={trainStyles.stack}>
      <Text style={{ flex: 0.55, textAlign: "center", color: "rgb(130,130,130)", fontSize: 16 }}>#</Text>
      <Text style={{ flex: 0.55, textAlign: "center", color: "rgb(130,130,130)", fontSize: 16 }}>{t("training_header_weight")}</Text>
      <Text style={{ flex: 0.55, textAlign: "center", color: "rgb(130,130,130)", fontSize: 16 }}>{t("training_header_reps")}</Text>
      <Text style={{ flex: 1, textAlign: "center", color: "rgb(130,130,130)", fontSize: 16 }}>{t("training_header_note")}</Text>
      {showPlaceholderForDoneButton && <View style={{ flex: 0.6, width: 40 }}></View>}
    </HStack>
  );
};
