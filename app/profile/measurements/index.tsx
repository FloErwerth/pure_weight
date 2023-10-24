import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { Pressable, View } from "react-native";
import { AddButton } from "../../../components/AddButton/AddButton";
import { borderRadius } from "../../../theme/border";
import { HStack } from "../../../components/HStack/HStack";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getMeasurements } from "../../../store/selectors";
import { addMeasurement } from "../../../store/reducer";
import { MeasurementModal } from "../../../components/MeasurementModal/MeasurementModal";
import { z } from "zod/lib/index";
import { getDateTodayIso } from "../../../utils/date";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { useTheme } from "../../../theme/context";
import { ThemedMaterialCommunityIcons } from "../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";

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
  const navigate = useNavigate();
  const handleNavigateBack = useCallback(() => {
    navigate("profile");
  }, [navigate]);

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
  }, [dispatch, measurement.date, measurement.name, measurement.unit, measurement.value]);

  const handleDispatchNewMeasurement = useCallback(() => {
    const parsedDate = dateParser.safeParse(measurement.date);
    if (parsedDate.success && parsedDate.data === getDateTodayIso()) {
      setShowMeasurementModal(false);
      return;
    }
    addMeasurementEntry();
    setShowMeasurementModal(false);
  }, [addMeasurementEntry, measurement.date]);

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

  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons handleBack={handleNavigateBack} title={t("measurements")} />
      <PageContent style={{ gap: 20 }}>
        <View style={{ gap: 10 }}>
          {measurements?.map((measurement) => (
            <Pressable key={`${measurement.name}-pressable`} onPress={() => handleAddExistingMeasurement(measurement)}>
              <HStack style={{ padding: 15, backgroundColor: componentBackgroundColor, borderRadius, justifyContent: "space-between" }}>
                <Text style={{ fontSize: 20, color: mainColor }}>{measurement.name}</Text>
                <ThemedMaterialCommunityIcons name="plus" size={26} />
              </HStack>
            </Pressable>
          ))}
        </View>
        <AddButton title={t("measurement_add")} onPress={handleAddNewMesaurement}></AddButton>
      </PageContent>
      <MeasurementModal
        isNewMeasurement={isNewMeasurement}
        saveMeasurement={handleDispatchNewMeasurement}
        isVisible={showMeasurementModal}
        setMeasurement={setMeasurement}
        onRequestClose={handleDiscardMeasurment}
        measurement={measurement}
      />
    </ThemedView>
  );
}
