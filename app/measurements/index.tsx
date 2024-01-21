import { DEFAULT_PLUS, SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { PageContent } from "../../components/PageContent/PageContent";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { RenderedMeasurement } from "../../components/App/measurements/RenderedMeasurement";
import { BottomToast } from "../../components/BottomToast/BottomToast";
import { deleteMeasurement, recoverMeasurement, setEditedMeasurement, setupNewMeasurement } from "../../store/reducers/measurements";
import { getSortedMeasurements } from "../../store/reducers/measurements/measurementSelectors";
import { MeasurementSorting } from "../../components/App/measurements/Sorting/MeasurementSorting";
import { useNavigate } from "../../hooks/navigate";

export function Measurements() {
    const { t } = useTranslation();
    const measurements = useAppSelector(getSortedMeasurements);
    const dispatch = useAppDispatch();
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();

    const handleAddNewMeasurement = useCallback(() => {
        dispatch(setupNewMeasurement());
        navigate("measurement/create");
    }, [dispatch, navigate]);

    const handleAddExistingMeasurement = useCallback(
        (measurementId: number) => {
            const measurement = measurements?.find((measurement) => measurement.measurementId === measurementId);
            dispatch(setEditedMeasurement({ isEditing: false, isNew: false, measurement }));
            navigate("measurement/create");
        },
        [dispatch, measurements, navigate],
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

    const handleEditMeasuremnt = useCallback(
        (measurementId: number) => {
            const measurement = measurements?.find((measurement) => measurement.measurementId === measurementId);
            dispatch(setEditedMeasurement({ isNew: false, isEditing: true, measurement }));
            navigate("measurement/create");
        },
        [dispatch, measurements, navigate],
    );

    const mappedMeasurements = useMemo(
        () =>
            measurements?.map((measurement) => (
                <Swipeable
                    onEdit={() => handleEditMeasuremnt(measurement.measurementId)}
                    onDelete={() => handleDeleteMeasurement(measurement.measurementId)}
                    key={`${measurement.name}-pressable`}
                    onClick={() => handleAddExistingMeasurement(measurement.measurementId)}
                >
                    <RenderedMeasurement measurement={measurement} />
                </Swipeable>
            )),
        [handleAddExistingMeasurement, handleDeleteMeasurement, handleEditMeasuremnt, measurements],
    );

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons titleFontSize={40} title={t("measurements")} handleConfirm={handleAddNewMeasurement} handleConfirmIcon={DEFAULT_PLUS} />
            <MeasurementSorting />
            <PageContent background ignoreGap paddingTop={20} scrollable>
                {mappedMeasurements}
            </PageContent>
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
