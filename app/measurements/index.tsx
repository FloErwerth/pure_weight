import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { HStack } from "../../components/HStack/HStack";
import { useAppDispatch, useAppSelector } from "../../store";
import { getLanguage, getLatestMeasurements, getMeasurements } from "../../store/selectors";
import { addMeasurement, deleteMeasurement, recoverMeasurement } from "../../store/reducer";
import { MeasurementModal } from "../../components/MeasurementModal/MeasurementModal";
import { z } from "zod/lib/index";
import { getDate, getDateTodayIso } from "../../utils/date";
import { PageContent } from "../../components/PageContent/PageContent";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { Text } from "../../components/Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedMaterialCommunityIcons } from "../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { styles } from "../../components/App/measurements/styles";
import { VStack } from "../../components/VStack/VStack";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { borderRadius } from "../../theme/border";
import Toast from "react-native-root-toast";
import { ThemedToast } from "../../components/Themed/ThemedToast/ThemedToast";

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
  const { mainColor, componentBackgroundColor, secondaryBackgroundColor, secondaryColor } = useTheme();
  const { t } = useTranslation();
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const measurements = useAppSelector(getMeasurements);
  const latestMeasurements = useAppSelector(getLatestMeasurements);
  const [measurement, setMeasurement] = useState<Measurement>(emptyMeasurement);
  const [isNewMeasurement, setIsNewMeasurement] = useState(false);
  const dispatch = useAppDispatch();
  const [showToast, setShowToast] = useState(false);

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
    setShowMeasurementModal(false);
    setTimeout(() => setMeasurement(emptyMeasurement), 200);
  }, []);

  const pressableWrapperStyle = useMemo(() => [styles.pressableWrapper, { backgroundColor: componentBackgroundColor }], [componentBackgroundColor]);
  const textStyle = useMemo(() => [styles.text, { color: mainColor }], [mainColor]);
  const language = useAppSelector(getLanguage);

  const handleDeleteMeasurement = useCallback(
    (index: number) => {
      dispatch(deleteMeasurement(index));
      setShowToast(true);
    },
    [dispatch, setShowToast],
  );

  const handleRecoverMeasurement = useCallback(() => {
    dispatch(recoverMeasurement());
    setShowToast(false);
  }, [dispatch]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons title={t("measurements")} handleConfirm={handleAddNewMesaurement} handleConfirmIcon={{ name: "plus", size: 40 }} />
      <PageContent style={styles.contentWrapper}>
        <ScrollView style={styles.measurementsWrapper}>
          {measurements?.map((measurement, index) => (
            <Swipeable onDelete={() => handleDeleteMeasurement(index)} key={`${measurement.name}-pressable`} onClick={() => handleAddExistingMeasurement(measurement)}>
              <HStack style={pressableWrapperStyle}>
                <VStack style={{ gap: 15, flex: 1, paddingRight: 10 }}>
                  <View>
                    <Text style={textStyle}>{measurement.name}</Text>
                    <Text>
                      {t("measurement_latest")} {getDate(latestMeasurements[index], language)}
                    </Text>
                  </View>
                  <Pressable>
                    <Text>Show progress</Text>
                  </Pressable>
                </VStack>
                <ThemedMaterialCommunityIcons name="table-large-plus" size={26} />
              </HStack>
            </Swipeable>
          ))}
        </ScrollView>
      </PageContent>
      <MeasurementModal
        isNewMeasurement={isNewMeasurement}
        saveMeasurement={addMeasurementEntry}
        isVisible={showMeasurementModal}
        setMeasurement={setMeasurement}
        onRequestClose={handleDiscardMeasurment}
        measurement={measurement}
      />
      <ThemedToast onPress={() => setShowToast(false)} opacity={1} position={Toast.positions.BOTTOM - 75} visible={showToast}>
        <VStack style={{ gap: 10, justifyContent: "space-evenly" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{t("measurement_deleted_message")}</Text>
          <Pressable style={{ padding: 10, justifyContent: "space-between", flexDirection: "row", borderRadius, backgroundColor: secondaryBackgroundColor }} onPress={handleRecoverMeasurement}>
            <Text style={{ alignSelf: "center", fontSize: 16, color: secondaryColor }}>{t("measurement_deleted_undo")}</Text>
            <MaterialCommunityIcons color={mainColor} name="undo" size={20} />
          </Pressable>
        </VStack>
      </ThemedToast>
    </ThemedView>
  );
}
