import { DEFAULT_PLUS, SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import React, { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { PageContent } from "../../components/PageContent/PageContent";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { RenderedMeasurement } from "../../components/App/measurements/RenderedMeasurement";
import { BottomToast } from "../../components/BottomToast/BottomToast";
import {
    deleteMeasurement,
    recoverMeasurement,
    setEditedMeasurement,
    setSearchedMeasurements,
    setupNewMeasurement,
} from "../../store/reducers/measurements";
import { getSearchedMeasurements, getSortedMeasurements } from "../../store/reducers/measurements/measurementSelectors";
import { useNavigate } from "../../hooks/navigate";
import { useToast } from "../../components/BottomToast/useToast";
import { MeasurementId } from "../../components/App/measurements/types";
import { View } from "react-native";
import { styles } from "../../components/App/measurements/styles";
import { HStack } from "../../components/Stack/HStack/HStack";
import { trainStyles } from "../../components/App/train/trainStyles";
import { Sorting } from "../../components/Sorting/Sorting";
import { ExpandableSearchbar } from "../../components/Searchbar/ExpandableSearchbar";

export function Measurements() {
    const { t } = useTranslation();
    const measurements = useAppSelector(getSortedMeasurements);
    const searchedMeasurements = useAppSelector(getSearchedMeasurements);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toastRef, openToast, closeToast, showToast } = useToast();

    const filteredMeasurements = useMemo(
        () =>
            measurements.filter((measurement) => {
                if (!searchedMeasurements) {
                    return true;
                }

                return measurement.name.toLowerCase().includes(searchedMeasurements.toLowerCase());
            }),
        [measurements, searchedMeasurements],
    );

    const handleAddNewMeasurement = useCallback(() => {
        dispatch(setupNewMeasurement());
        navigate("measurement/create");
    }, [dispatch, navigate]);

    const handleSetSearchedMeasurements = useCallback(
        (searched: string) => {
            dispatch(setSearchedMeasurements(searched));
        },
        [dispatch],
    );

    const handleAddExistingMeasurement = useCallback(
        (measurementId: MeasurementId) => {
            const measurement = measurements?.find((measurement) => measurement.measurementId === measurementId);
            dispatch(setEditedMeasurement({ isEditing: false, isNew: false, measurement }));
            navigate("measurement/create");
        },
        [dispatch, measurements, navigate],
    );

    const handleDeleteMeasurement = useCallback(
        (id: MeasurementId) => {
            dispatch(deleteMeasurement(id));
            if (showToast && toastRef.current) {
                toastRef.current.restart();
            }
            openToast();
        },
        [dispatch, openToast, showToast, toastRef],
    );

    const handleRecoverMeasurement = useCallback(() => {
        dispatch(recoverMeasurement());
        closeToast();
    }, [closeToast, dispatch]);

    const handleEditMeasuremnt = useCallback(
        (measurementId: MeasurementId) => {
            const measurement = measurements?.find((measurement) => measurement.measurementId === measurementId);
            dispatch(setEditedMeasurement({ isNew: false, isEditing: true, measurement }));
            navigate("measurement/create");
        },
        [dispatch, measurements, navigate],
    );

    const mappedMeasurements = useMemo(
        () =>
            filteredMeasurements?.map((measurement) => (
                <Swipeable
                    onEdit={() => handleEditMeasuremnt(measurement.measurementId)}
                    onDelete={() => handleDeleteMeasurement(measurement.measurementId)}
                    key={measurement.measurementId}
                    onClick={() => handleAddExistingMeasurement(measurement.measurementId)}>
                    <RenderedMeasurement measurement={measurement} />
                </Swipeable>
            )),
        [filteredMeasurements, handleAddExistingMeasurement, handleDeleteMeasurement, handleEditMeasuremnt],
    );

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons title={t("measurements")} handleConfirm={handleAddNewMeasurement} handleConfirmIcon={DEFAULT_PLUS} />
            {measurements.length > 1 && (
                <PageContent ghost>
                    <HStack ghost style={trainStyles.searchAndFilterBar}>
                        <Sorting type="Workout" />
                        <ExpandableSearchbar handleSetSearchManual={handleSetSearchedMeasurements} />
                    </HStack>
                </PageContent>
            )}
            <PageContent background ignoreGap scrollable>
                <View style={styles.wrapper}>{mappedMeasurements}</View>
            </PageContent>
            <BottomToast
                reference={toastRef}
                onRequestClose={closeToast}
                open={showToast}
                messageKey={"measurement_deleted_undo"}
                titleKey={"measurement_deleted_message"}
                onRedo={handleRecoverMeasurement}
                bottom={10}
            />
        </ThemedView>
    );
}
