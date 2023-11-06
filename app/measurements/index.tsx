import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { HStack } from "../../components/HStack/HStack";
import { useAppDispatch, useAppSelector } from "../../store";
import { getMeasurements } from "../../store/selectors";
import { addMeasurement } from "../../store/reducer";
import { MeasurementModal } from "../../components/MeasurementModal/MeasurementModal";
import { z } from "zod/lib/index";
import { getDateTodayIso } from "../../utils/date";
import { PageContent } from "../../components/PageContent/PageContent";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { Text } from "../../components/Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedMaterialCommunityIcons } from "../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { styles } from "../../components/App/measurements/styles";

export type Measurement = {
  name?: string;
  unit?: string;
  value?: string;
  date?: Date;
};
const emptyMeasurement: Measurement = { name: "", unit: "", value: "", date: new Date() };

const dateParser = z.date().transform((date) => {
  return date.toISOString().split("T")[0];
});

export function Measurements() {
  const { mainColor, componentBackgroundColor } = useTheme();
  const { t } = useTranslation();
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const measurements = useAppSelector(getMeasurements);
  const [measurement, setMeasurement] = useState<Measurement>(emptyMeasurement);
  const [isNewMeasurement, setIsNewMeasurement] = useState(false);
  const dispatch = useAppDispatch();

  const addMeasurementEntry = useCallback(() => {
    if (measurement.name && measurement.unit && measurement.value) {
      const parsedDate = dateParser.safeParse(measurement.date);
      dispatch(
        addMeasurement({
          name: measurement.name,
          unit: measurement.unit,
          data: { [(parsedDate.success && parsedDate.data) || getDateTodayIso()]: measurement.value },
        }),
      );
    }
    setShowMeasurementModal(false);
  }, [dispatch, measurement.date, measurement.name, measurement.unit, measurement.value]);

  const handleAddNewMesaurement = useCallback(() => {
    setMeasurement(emptyMeasurement);
    setShowMeasurementModal(true);
    setIsNewMeasurement(true);
  }, []);

  const handleAddExistingMeasurement = useCallback((measurement: Measurement) => {
    setMeasurement({ name: measurement.name, unit: measurement.unit, value: "", date: new Date(getDateTodayIso()) });
    setShowMeasurementModal(true);
    setIsNewMeasurement(false);
  }, []);

  const handleDiscardMeasurment = useCallback(() => {
    setMeasurement(emptyMeasurement);
    setShowMeasurementModal(false);
  }, []);

  const pressableWrapperStyle = useMemo(() => [styles.pressableWrapper, { backgroundColor: componentBackgroundColor }], [componentBackgroundColor]);
  const textStyle = useMemo(() => [styles.text, { color: mainColor }], [mainColor]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons title={t("measurements")} handleConfirm={handleAddNewMesaurement} handleConfirmIcon={{ name: "plus", size: 40 }} />
      <PageContent style={styles.contentWrapper}>
        <View style={styles.measurementsWrapper}>
          {measurements?.map((measurement) => (
            <Pressable key={`${measurement.name}-pressable`} onPress={() => handleAddExistingMeasurement(measurement)}>
              <HStack style={pressableWrapperStyle}>
                <Text style={textStyle}>{measurement.name}</Text>
                <ThemedMaterialCommunityIcons name="plus" size={26} />
              </HStack>
            </Pressable>
          ))}
        </View>
      </PageContent>
      <MeasurementModal
        isNewMeasurement={isNewMeasurement}
        saveMeasurement={addMeasurementEntry}
        isVisible={showMeasurementModal}
        setMeasurement={setMeasurement}
        onRequestClose={handleDiscardMeasurment}
        measurement={measurement}
      />
    </ThemedView>
  );
}
