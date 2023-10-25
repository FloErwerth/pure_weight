import { View } from "react-native";
import { HStack } from "../../../HStack/HStack";
import { Text } from "../../../Themed/ThemedText/Text";
import { useTranslation } from "react-i18next";
import { styles } from "../../../SetInputRow/styles";

interface TrainingHeaderProps {
  showPlaceholderForDoneButton?: boolean;
}
export const TrainingHeader = ({ showPlaceholderForDoneButton = true }: TrainingHeaderProps) => {
  const { t } = useTranslation();
  return (
    <HStack style={[styles.vStack, { marginBottom: 10 }]}>
      <Text style={{ flex: 0.2, textAlign: "center", color: "rgb(130,130,130)", fontSize: 16 }}>#</Text>
      <HStack style={{ flex: 1 }}>
        <Text style={{ flex: 1, textAlign: "center", color: "rgb(130,130,130)", fontSize: 16 }}>{t("training_header_weight")}</Text>
        <Text style={{ flex: 1, textAlign: "center", color: "rgb(130,130,130)", fontSize: 16 }}>{t("training_header_reps")}</Text>
        {showPlaceholderForDoneButton && <View style={{ flex: 1, width: 40 }}></View>}
      </HStack>
    </HStack>
  );
};