import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "../../store";
import { getMeasurements } from "../../store/selectors";
import { addMeasurement, deleteMeasurement, recoverMeasurement } from "../../store/reducer";
import { MeasurementModal } from "../../components/MeasurementModal/MeasurementModal";
import { z } from "zod/lib/index";
import { getDateTodayIso } from "../../utils/date";
import { PageContent } from "../../components/PageContent/PageContent";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { styles } from "../../components/App/measurements/styles";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { RenderedMeasurement } from "../../components/App/measurements/Measurement";
import { BottomToast } from "../../components/BottomToast/BottomToast";
import { MeasurementUnit } from "../../components/MeasurementModal/measurementUnits";

export type WorkingMeasurement = {
  name?: string;
  unit?: MeasurementUnit;
  value?: string;
  date?: Date;
  higherIsBetter?: boolean;
};
const emptyMeasurement: WorkingMeasurement = { name: "", value: "", date: new Date(), higherIsBetter: false };

const dateParser = z.date().transform((date) => {
  return date.toISOString().split("T")[0];
});

export function Measurements() {
  const { t } = useTranslation();
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const measurements = useAppSelector(getMeasurements);
  const [measurement, setMeasurement] = useState<WorkingMeasurement>(emptyMeasurement);
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

  const handleAddExistingMeasurement = useCallback((measurement: WorkingMeasurement) => {
    setMeasurement({ name: measurement.name, unit: measurement.unit, value: "", date: new Date(getDateTodayIso()) });
    setShowMeasurementModal(true);
    setIsNewMeasurement(false);
  }, []);

  const handleDiscardMeasurment = useCallback(() => {
    setShowMeasurementModal(false);
    setTimeout(() => setMeasurement(emptyMeasurement), 200);
  }, []);

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
              <RenderedMeasurement index={index} measurement={measurement} />
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
      <BottomToast onRequestClose={() => setShowToast(false)} open={showToast} messageKey={"measurement_deleted_undo"} titleKey={"measurement_deleted_message"} onRedo={handleRecoverMeasurement} />
    </ThemedView>
  );
}
