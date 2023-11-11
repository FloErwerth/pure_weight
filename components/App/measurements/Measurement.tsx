import { VStack } from "../../VStack/VStack";
import { View } from "react-native";
import { Text } from "../../Themed/ThemedText/Text";
import { getDate } from "../../../utils/date";
import { ThemedMaterialCommunityIcons } from "../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { HStack } from "../../HStack/HStack";
import { useCallback, useContext, useMemo, useState } from "react";
import { styles } from "./styles";
import { useAppSelector } from "../../../store";
import { getLanguage, getLatestMeasurements, getMeasurmentProgress } from "../../../store/selectors";
import { useTheme } from "../../../theme/context";
import { AppState } from "../../../store/types";
import { useTranslation } from "react-i18next";
import { swipableContext } from "../../WorkoutCard/Swipeable";
import { ProgressDisplay } from "../../WorkoutCard/components/ProgressDisplay/ProgressDisplay";
import { MeasurementChartModal } from "./Chart/MeasurementChartModal";
import { Measurement } from "./types";

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
  const [showMeasurementChart, setShowMeasurementChart] = useState(false);
  const progress = useAppSelector((state: AppState) => getMeasurmentProgress(state, index));

  const handleNavigateToChart = useCallback(() => {
    if (active) {
      return;
    }
    setShowMeasurementChart(true);
  }, [active]);

  const handleRequestClose = useCallback(() => {
    setShowMeasurementChart(false);
  }, []);

  return (
    <HStack style={pressableWrapperStyle}>
      <VStack style={{ gap: 15, flex: 1, paddingRight: 10 }}>
        <View>
          <Text style={textStyle}>{measurement.name}</Text>
          <Text>
            {t("measurement_latest")} {getDate(latestMeasurements[index], language)}
          </Text>
        </View>
        {measurement.name && progress && (
          <ProgressDisplay type="Measurement" higherIsBetter={measurement?.higherIsBetter} name={measurement?.name} percent={progress} onPress={handleNavigateToChart} />
        )}
      </VStack>
      <ThemedMaterialCommunityIcons name="table-large-plus" size={26} />
      {showMeasurementChart && <MeasurementChartModal index={index} name={measurement.name} unit={measurement.unit} isVisible={showMeasurementChart} onRequestClose={handleRequestClose} />}
    </HStack>
  );
};
