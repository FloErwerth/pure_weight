import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "../../store";
import { getMeasurements } from "../../store/selectors";
import { addMeasurement, deleteMeasurement, editMeasurement, recoverMeasurement } from "../../store/reducer";
import { MeasurementModal } from "../../components/MeasurementModal/MeasurementModal";
import { z } from "zod/lib/index";
import { getDateTodayIso } from "../../utils/date";
import { PageContent } from "../../components/PageContent/PageContent";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { styles } from "../../components/App/measurements/styles";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { RenderedMeasurement } from "../../components/App/measurements/Measurement";
import { BottomToast } from "../../components/BottomToast/BottomToast";
import { Measurement } from "../../components/App/measurements/types";

const emptyMeasurement = { measurement: { name: "", value: "", date: new Date(), higherIsBetter: false } };

const dateParser = z.date().transform((date) => {
  return date.toISOString().split("T")[0];
});

export function Measurements() {
  const { t } = useTranslation();
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const measurements = useAppSelector(getMeasurements);
  const [currentMeasurement, setCurrentMeasurement] = useState<{ measurement: Measurement; index?: number }>(emptyMeasurement);
  const [isNewMeasurement, setIsNewMeasurement] = useState(false);
  const [isEditingMeasurement, setIsEditingMeasurement] = useState(false);
  const dispatch = useAppDispatch();
  const [showToast, setShowToast] = useState(false);

  const reset = useCallback(() => {
    setShowMeasurementModal(false);
    setCurrentMeasurement(emptyMeasurement);
    setIsNewMeasurement(true);
    setIsEditingMeasurement(false);
  }, []);

  const handleConfirmMeasurementModal = useCallback(() => {
    const { measurement, index } = currentMeasurement;
    if (isEditingMeasurement && index !== undefined) {
      dispatch(editMeasurement({ measurement, index }));
      reset();
      return;
    }
    if (measurement.name && measurement.unit && measurement.value) {
      const parsedDate = dateParser.safeParse(measurement.date);
      dispatch(
        addMeasurement({
          measurement: {
            name: measurement.name,
            unit: measurement.unit,
            data: { [(parsedDate.success && parsedDate.data) || getDateTodayIso()]: measurement.value },
          },
          index,
        }),
      );
      reset();
    }
  }, [currentMeasurement, dispatch, isEditingMeasurement, reset]);

  const handlePrepareAddingNewMeasurement = useCallback(() => {
    setShowMeasurementModal(true);
  }, []);

  const handleAddExistingMeasurement = useCallback((measurement: Measurement, index: number) => {
    setCurrentMeasurement({
      measurement: {
        name: measurement.name,
        unit: measurement.unit,
        value: "",
        date: new Date(getDateTodayIso()),
      },
      index,
    });
    setShowMeasurementModal(true);
    setIsNewMeasurement(false);
    setIsEditingMeasurement(false);
  }, []);

  const handleDeleteMeasurement = useCallback(
    (index: number) => {
      dispatch(deleteMeasurement(index));
      setShowToast(true);
    },
    [dispatch, setShowToast],
  );

  const handleEditMeasurement = useCallback((measurement: Measurement, index: number) => {
    setCurrentMeasurement({ measurement, index });
    setIsEditingMeasurement(true);
    setShowMeasurementModal(true);
  }, []);

  const handleRecoverMeasurement = useCallback(() => {
    dispatch(recoverMeasurement());
    setShowToast(false);
  }, [dispatch]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons title={t("measurements")} handleConfirm={handlePrepareAddingNewMeasurement} handleConfirmIcon={{ name: "plus", size: 40 }} />
      <PageContent style={styles.contentWrapper}>
        <ScrollView style={styles.measurementsWrapper}>
          {measurements?.map((measurement, index) => (
            <Swipeable
              onEdit={() => handleEditMeasurement(measurement, index)}
              onDelete={() => handleDeleteMeasurement(index)}
              key={`${measurement.name}-pressable`}
              onClick={() => handleAddExistingMeasurement(measurement, index)}
            >
              <RenderedMeasurement index={index} measurement={measurement} />
            </Swipeable>
          ))}
        </ScrollView>
      </PageContent>
      <MeasurementModal
        isNewMeasurement={isNewMeasurement}
        saveMeasurement={handleConfirmMeasurementModal}
        isVisible={showMeasurementModal}
        setCurrentMeasurement={setCurrentMeasurement}
        onRequestClose={reset}
        currentMeasurement={currentMeasurement}
        isEditingMeasurement={isEditingMeasurement}
      />
      <BottomToast onRequestClose={() => setShowToast(false)} open={showToast} messageKey={"measurement_deleted_undo"} titleKey={"measurement_deleted_message"} onRedo={handleRecoverMeasurement} />
    </ThemedView>
  );
}
