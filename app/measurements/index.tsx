import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "../../store";
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
import { useBottomSheetRef } from "../../components/BottomSheetModal/ThemedBottomSheetModal";
import { addMeasurement, deleteMeasurement, recoverMeasurement } from "../../store/reducers/measurements";
import { cleanError } from "../../store/reducers/errors";
import { getMeasurements } from "../../store/reducers/measurements/measurementSelectors";

const emptyMeasurement = { measurement: { name: "", value: "", date: new Date(), higherIsBetter: false } };

const dateParser = z.date().transform((date) => {
    return date.toISOString().split("T")[0];
});

export function Measurements() {
    const { t } = useTranslation();
    const measurements = useAppSelector(getMeasurements);
    const [currentMeasurement, setCurrentMeasurement] = useState<{ measurement: Measurement; index?: number }>(emptyMeasurement);
    const [isNewMeasurement, setIsNewMeasurement] = useState(false);
    const dispatch = useAppDispatch();
    const [showToast, setShowToast] = useState(false);
    const [ref, open, close] = useBottomSheetRef();

    const handleAddNewMeasurement = useCallback(() => {
        setIsNewMeasurement(true);
        setCurrentMeasurement(emptyMeasurement);
        open();
    }, [open]);

    const reset = useCallback(() => {
        setCurrentMeasurement(emptyMeasurement);
        setIsNewMeasurement(true);
        dispatch(cleanError(["measurement_type", "measurement_name", "measurement_value"]));
    }, [dispatch]);

    const handleCloseModal = useCallback(() => {
        close();
        reset();
    }, [close, reset]);

    const handleConfirmMeasurementModal = useCallback(() => {
        const { measurement, index } = currentMeasurement;
        if (measurement.name && measurement.type) {
            const parsedDate = dateParser.safeParse(measurement.date);
            const data = measurement.value ? { [(parsedDate.success && parsedDate.data) || getDateTodayIso()]: measurement.value } : undefined;
            dispatch(
                addMeasurement({
                    measurement: {
                        name: measurement.name,
                        type: measurement.type,
                        data,
                    },
                    index,
                }),
            );
        }
        handleCloseModal();
    }, [currentMeasurement, dispatch, handleCloseModal]);

    const handleAddExistingMeasurement = useCallback(
        (measurement: Measurement, index: number) => {
            setCurrentMeasurement({
                measurement: {
                    name: measurement.name,
                    type: measurement.type,
                    value: "",
                    date: new Date(getDateTodayIso()),
                },
                index,
            });
            open();
            setIsNewMeasurement(false);
        },
        [open],
    );

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
            <SiteNavigationButtons titleFontSize={40} title={t("measurements")} handleConfirm={handleAddNewMeasurement} handleConfirmIcon={{ name: "plus", size: 40 }} />
            <PageContent style={styles.contentWrapper}>
                <ScrollView style={styles.measurementsWrapper}>
                    {measurements?.map((measurement, index) => (
                        <Swipeable onDelete={() => handleDeleteMeasurement(index)} key={`${measurement.name}-pressable`} onClick={() => handleAddExistingMeasurement(measurement, index)}>
                            <RenderedMeasurement index={index} measurement={measurement} />
                        </Swipeable>
                    ))}
                </ScrollView>
            </PageContent>
            <MeasurementModal
                reference={ref}
                isNewMeasurement={isNewMeasurement}
                saveMeasurement={handleConfirmMeasurementModal}
                setCurrentMeasurement={setCurrentMeasurement}
                currentMeasurement={currentMeasurement}
                onRequestClose={handleCloseModal}
            />
            <BottomToast
                onRequestClose={() => setShowToast(false)}
                open={showToast}
                messageKey={"measurement_deleted_undo"}
                titleKey={"measurement_deleted_message"}
                onRedo={handleRecoverMeasurement}
            />
        </ThemedView>
    );
}
