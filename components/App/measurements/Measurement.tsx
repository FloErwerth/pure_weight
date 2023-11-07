import { VStack } from "../../VStack/VStack";
import { Pressable, View } from "react-native";
import { Text } from "../../Themed/ThemedText/Text";
import { getDate } from "../../../utils/date";
import { ThemedMaterialCommunityIcons } from "../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { HStack } from "../../HStack/HStack";
import { useContext, useMemo } from "react";
import { styles } from "./styles";
import { useAppSelector } from "../../../store";
import { getLanguage, getLatestMeasurements } from "../../../store/selectors";
import { useTheme } from "../../../theme/context";
import { Measurement } from "../../../store/types";
import { useTranslation } from "react-i18next";
import { swipableContext } from "../../WorkoutCard/Swipeable";

interface MeasurementProps {
  index: number;
  measurement: Measurement;
}
export const RenderedMeasurement = ({ index, measurement }: MeasurementProps) => {
  const latestMeasurements = useAppSelector(getLatestMeasurements);
  const { t } = useTranslation();
  const active = useContext(swipableContext);
  const { mainColor, componentBackgroundColor } = useTheme();
  const pressableWrapperStyle = useMemo(() => [styles.pressableWrapper, { backgroundColor: componentBackgroundColor }], [componentBackgroundColor]);
  const textStyle = useMemo(() => [styles.text, { color: mainColor }], [mainColor]);
  const language = useAppSelector(getLanguage);

  return (
    <HStack style={pressableWrapperStyle}>
      <VStack style={{ gap: 15, flex: 1, paddingRight: 10 }}>
        <View>
          <Text style={textStyle}>{measurement.name}</Text>
          <Text>
            {t("measurement_latest")} {getDate(latestMeasurements[index], language)}
          </Text>
        </View>
        <Pressable disabled={active}>
          <Text>Show progress</Text>
        </Pressable>
      </VStack>
      <ThemedMaterialCommunityIcons name="table-large-plus" size={26} />
    </HStack>
  );
};
