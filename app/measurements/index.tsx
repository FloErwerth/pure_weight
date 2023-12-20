import { DEFAULT_PLUS, SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { MeasurementModal } from "../../components/MeasurementModal/MeasurementModal";
import { PageContent } from "../../components/PageContent/PageContent";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { RenderedMeasurement } from "../../components/App/measurements/RenderedMeasurement";
import { BottomToast } from "../../components/BottomToast/BottomToast";
import { useBottomSheetRef } from "../../components/BottomSheetModal/ThemedBottomSheetModal";
import { deleteMeasurement, recoverMeasurement, setEditedMeasurement, setupNewMeasurement } from "../../store/reducers/measurements";
import { getMeasurements } from "../../store/reducers/measurements/measurementSelectors";
import { MeasurementSorting } from "../../components/App/measurements/Sorting/MeasurementSorting";

export function Measurements() {
    const { t } = useTranslation();
    const measurements = useAppSelector(getMeasurements);
    const dispatch = useAppDispatch();
    const [showToast, setShowToast] = useState(false);
    const [ref, open, close] = useBottomSheetRef();

    const handleAddNewMeasurement = useCallback(() => {
        dispatch(setupNewMeasurement());
        open();
    }, [dispatch, open]);

    const handleCloseModal = useCallback(() => {
        close();
    }, [close]);

    const handleAddExistingMeasurement = useCallback(
        (index: number) => {
            dispatch(setEditedMeasurement({ index, isNew: false }));
            open();
        },
        [dispatch, open],
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

    const mappedMeasurements = useMemo(
        () =>
            measurements?.map((measurement, index) => (
                <Swipeable onDelete={() => handleDeleteMeasurement(index)} key={`${measurement.name}-pressable`} onClick={() => handleAddExistingMeasurement(index)}>
                    <RenderedMeasurement index={index} measurement={measurement} />
                </Swipeable>
            )),
        [handleAddExistingMeasurement, handleDeleteMeasurement, measurements],
    );

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons titleFontSize={40} title={t("measurements")} handleConfirm={handleAddNewMeasurement} handleConfirmIcon={DEFAULT_PLUS} />
            <MeasurementSorting />
            <PageContent background ignoreGap paddingTop={20} scrollable>
                {mappedMeasurements}
            </PageContent>
            <MeasurementModal reference={ref} onRequestClose={handleCloseModal} />
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
