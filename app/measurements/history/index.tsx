import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useNavigateBack } from "../../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getEditedMeasurement } from "../../../store/reducers/measurements/measurementSelectors";
import { PageContent } from "../../../components/PageContent/PageContent";
import { SelectableMeasurementDataPoint } from "../../../components/App/measurements/SelectableMeasurementDataPoint/SelectableMeasurementDataPoint";
import { FlatList, ListRenderItem } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MeasurementDataPoint } from "../../../components/App/measurements/types";
import {
    deleteMeasurementDataPoint,
    recoverMeasurementDataPoint,
    saveEditedMeasurement,
    setEditedMeasurementDataPoint,
} from "../../../store/reducers/measurements";
import { BottomToast } from "../../../components/BottomToast/BottomToast";
import { useToast } from "../../../components/BottomToast/useToast";
import { Swipeable } from "../../../components/WorkoutCard/Swipeable";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { AnswerText } from "../../../components/HelpQuestionAnswer/AnswerText";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { createStyles } from "../../../components/App/measurements/styles";
import { useTranslation } from "react-i18next";

export const MeasurementHistory = () => {
    const navigateBack = useNavigateBack();
    const navigate = useNavigate();
    const editedMeasurement = useAppSelector(getEditedMeasurement);
    const { bottom } = useSafeAreaInsets();
    const { toastRef, openToast, closeToast, showToast } = useToast();
    const { ref, openBottomSheet, closeBottomSheet } = useBottomSheetRef();
    const dispatch = useAppDispatch();
    const [deletedDatapointIndex, setDeletedDatapointIndex] = useState<number | null>(null);
    const { t } = useTranslation();

    const handleEditMeasurementPoint = useCallback(
        (index: number) => {
            if (editedMeasurement?.measurement) {
                dispatch(setEditedMeasurementDataPoint(index));
                navigate("measurements/history/edit");
            }
        },
        [dispatch, editedMeasurement?.measurement, navigate],
    );

    const handleNavigateToMeasurements = useCallback(() => {
        dispatch(saveEditedMeasurement());
        navigateBack();
    }, [dispatch, navigateBack]);

    const confirmDeleteMeasurementDataPoint = useCallback(() => {
        if (deletedDatapointIndex !== null) {
            dispatch(deleteMeasurementDataPoint({ index: deletedDatapointIndex }));
            closeBottomSheet();
            openToast();
            setTimeout(() => {
                toastRef.current.restart();
            }, 200);
        }
    }, [closeToast, deletedDatapointIndex, dispatch]);

    const renderItem: ListRenderItem<MeasurementDataPoint> = useCallback(
        ({ item, index }) => {
            if (item === undefined) {
                return <ThemedView stretch ghost />;
            } else {
                const { isoDate, value } = item;
                const handleDelete = () => {
                    setDeletedDatapointIndex(index);
                    openBottomSheet();
                };

                return (
                    <Swipeable onDelete={handleDelete}>
                        <SelectableMeasurementDataPoint
                            name={editedMeasurement?.measurement?.name ?? ""}
                            selectMeasurementPoint={() => handleEditMeasurementPoint(index)}
                            type={editedMeasurement?.measurement?.type}
                            isoDate={isoDate}
                            value={value}
                        />
                    </Swipeable>
                );
            }
        },
        [editedMeasurement?.measurement?.name, editedMeasurement?.measurement?.type, handleEditMeasurementPoint, openBottomSheet],
    );

    const flatlistConfig = useMemo(() => {
        return {
            contentInset: { bottom: bottom * 2 },
            contentContainerStyle: { gap: 10 },
            columnWrapperStyle: { gap: 10 },
        };
    }, [bottom]);

    const handleRecoverMeasurementDataPoint = useCallback(() => {
        dispatch(recoverMeasurementDataPoint());
        closeToast();
    }, [closeToast, dispatch]);

    const handleToastClosed = useCallback(() => {
        closeToast();
        if (editedMeasurement?.measurement?.data.length === 0) {
            navigateBack();
        }
    }, [closeToast, editedMeasurement?.measurement?.data.length, navigateBack]);

    const mappedData = useMemo(() => {
        if (editedMeasurement !== undefined && editedMeasurement.measurement && editedMeasurement.measurement?.data) {
            const filledData = 3 - (editedMeasurement.measurement.data.length % 3);
            return filledData === 0
                ? editedMeasurement?.measurement?.data
                : [...editedMeasurement.measurement.data, ...Array(filledData).fill(undefined)];
        }
        return undefined;
    }, [editedMeasurement]);

    if (editedMeasurement === undefined) {
        navigateBack();
        return null;
    }

    return (
        <ThemedView background stretch>
            <SiteNavigationButtons backButtonAction={handleNavigateToMeasurements} title={editedMeasurement.measurement?.name} />
            <PageContent stretch ghost>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    contentInset={flatlistConfig.contentInset}
                    contentContainerStyle={flatlistConfig.contentContainerStyle}
                    data={mappedData}
                    renderItem={renderItem}
                />
                <BottomToast
                    reference={toastRef}
                    leftCorrection={-20}
                    bottom={bottom}
                    onRequestClose={handleToastClosed}
                    open={showToast}
                    messageKey={"measurement_deleted_message"}
                    onRedo={handleRecoverMeasurementDataPoint}
                />
            </PageContent>

            <ThemedBottomSheetModal ref={ref} title={t("alert_delete_measurement_datapoint_title")}>
                <PageContent stretch ghost paddingTop={20}>
                    <AnswerText>{t("alert_delete_measurement_datapoint_content")}</AnswerText>
                </PageContent>
                <PageContent paddingTop={20} ghost>
                    <ThemedPressable center padding round onPress={confirmDeleteMeasurementDataPoint}>
                        <HStack ghost center style={createStyles.warningConfirmWrapper}>
                            <ThemedMaterialCommunityIcons name="delete" size={24} />
                            <Text>{t("alert_delete_measurement_datapoint_confirm")}</Text>
                        </HStack>
                    </ThemedPressable>
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
