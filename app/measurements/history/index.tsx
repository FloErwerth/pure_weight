import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigateBack } from "../../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
    getDatesFromCurrentMeasurement,
    getEditedMeasurement,
    getUnitByType,
} from "../../../store/reducers/measurements/measurementSelectors";
import { PageContent } from "../../../components/PageContent/PageContent";
import { SelectableMeasurementDataPoint } from "../../../components/App/measurements/SelectableMeasurementDataPoint/SelectableMeasurementDataPoint";
import { FlatList, Keyboard, ListRenderItem } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MeasurementDataPoint } from "../../../components/App/measurements/types";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { getDateTodayIso, getLocaleDate } from "../../../utils/date";
import { getLanguage, getUnitSystem } from "../../../store/reducers/settings/settingsSelectors";
import { useTranslation } from "react-i18next";
import { EditableExerciseInputRow } from "../../../components/EditableExercise/EditableExerciseInputRow";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { Text } from "../../../components/Themed/ThemedText/Text";
import {
    deleteMeasurementDataPoint,
    recoverMeasurementDataPoint,
    saveEditedMeasurement,
    saveMeasurementDataPoint,
} from "../../../store/reducers/measurements";
import { createStyles } from "../../../components/App/measurements/styles";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { AnswerText } from "../../../components/HelpQuestionAnswer/AnswerText";
import { ThemedMaterialCommunityIcons } from "../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { BottomToast } from "../../../components/BottomToast/BottomToast";
import { useToast } from "../../../components/BottomToast/useToast";
import { DateConfig, DatePicker } from "../../../components/DatePicker/DatePicker";
import { IsoDate } from "../../../types/date";

export const MeasurementHistory = () => {
    const navigateBack = useNavigateBack();
    const editedMeasurement = useAppSelector(getEditedMeasurement);
    const { bottom } = useSafeAreaInsets();

    const { ref, openBottomSheet, closeBottomSheet } = useBottomSheetRef();
    const [editedDatapoint, setEditedDatapoint] = useState<(MeasurementDataPoint & { index: number; oldDate: IsoDate }) | undefined>();
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();
    const unitSystem = useAppSelector(getUnitSystem);
    const dispatch = useAppDispatch();
    const measurementDates = useAppSelector(getDatesFromCurrentMeasurement);

    const { toastRef, openToast, closeToast, showToast } = useToast();
    const { ref: warningRef, openBottomSheet: openWarning, closeBottomSheet: closeWarning, isOpen: showWarning } = useBottomSheetRef();

    const handleEditMeasurementPoint = useCallback(
        (index: number) => {
            if (editedMeasurement?.measurement) {
                const dataPoint = editedMeasurement?.measurement.data[index];
                if (dataPoint?.isoDate === undefined || dataPoint?.value === undefined) {
                    return;
                }
                setEditedDatapoint({ ...dataPoint, index, oldDate: dataPoint.isoDate });
                openBottomSheet();
            }
        },
        [editedMeasurement?.measurement, openBottomSheet],
    );

    const handleNavigateToMeasurements = useCallback(() => {
        dispatch(saveEditedMeasurement());
        navigateBack();
    }, [dispatch, navigateBack]);

    const renderItem: ListRenderItem<MeasurementDataPoint> = useCallback(
        ({ item, index }) => {
            if (item === undefined) {
                return <ThemedView stretch ghost />;
            } else {
                const { isoDate, value } = item;
                return (
                    <SelectableMeasurementDataPoint
                        selectMeasurementPoint={() => handleEditMeasurementPoint(index)}
                        type={editedMeasurement?.measurement?.type}
                        isoDate={isoDate}
                        value={value}
                    />
                );
            }
        },
        [editedMeasurement?.measurement?.type, handleEditMeasurementPoint],
    );

    const flatlistConfig = useMemo(() => {
        return {
            contentInset: { bottom: bottom * 2 },
            contentContainerStyle: { gap: 10 },
            columnWrapperStyle: { gap: 10 },
        };
    }, [bottom]);

    const title = useMemo(
        () =>
            editedDatapoint?.oldDate &&
            `${editedMeasurement?.measurement?.name} ${t("on")} ${getLocaleDate(editedDatapoint?.oldDate, language, {
                dateStyle: "medium",
            })}`,
        [editedDatapoint?.oldDate, editedMeasurement?.measurement?.name, language, t],
    );

    const unit = useMemo(() => {
        return getUnitByType(unitSystem, editedMeasurement?.measurement?.type);
    }, [editedMeasurement?.measurement?.type, unitSystem]);

    const handleSaveEditedDatapoint = useCallback(() => {
        if (editedDatapoint) {
            const datapoint = { ...editedDatapoint, value: editedDatapoint?.value ?? "0" };
            if (showWarning) {
                const overwriteIndex = editedMeasurement?.measurement?.data.findIndex(
                    (datapoint) => datapoint?.isoDate === editedDatapoint?.isoDate,
                );
                dispatch(saveMeasurementDataPoint({ datapoint, index: overwriteIndex }));
                dispatch(deleteMeasurementDataPoint({ index: datapoint?.index }));
                closeWarning();
            } else {
                dispatch(saveMeasurementDataPoint({ datapoint, index: datapoint?.index }));
            }
        }
        Keyboard.dismiss();
        closeBottomSheet();
    }, [closeBottomSheet, closeWarning, dispatch, editedDatapoint, editedMeasurement?.measurement?.data, showWarning]);

    const handleRecoverMeasurementDataPoint = useCallback(() => {
        dispatch(recoverMeasurementDataPoint());
        closeToast();
    }, [closeToast, dispatch]);

    const handleDeleteDataPoint = useCallback(() => {
        dispatch(deleteMeasurementDataPoint({ index: editedDatapoint?.index }));
        if (showToast) {
            toastRef.current?.restart();
        } else {
            openToast();
        }
        closeBottomSheet();
    }, [closeBottomSheet, dispatch, editedDatapoint?.index, openToast, showToast, toastRef]);

    const handleCheckForDates = useCallback(() => {
        if (editedDatapoint?.isoDate === undefined) {
            return;
        }
        const originalIsoDate = editedMeasurement?.measurement?.data[editedDatapoint?.index]?.isoDate;
        if (measurementDates?.includes(editedDatapoint?.isoDate) && editedDatapoint?.isoDate !== originalIsoDate) {
            openWarning();
            return;
        }
        handleSaveEditedDatapoint();
    }, [
        editedDatapoint?.isoDate,
        editedDatapoint?.index,
        editedMeasurement?.measurement?.data,
        measurementDates,
        handleSaveEditedDatapoint,
        openWarning,
    ]);

    const handleSetDatapointValue = useCallback(
        (value?: string) => {
            if (editedDatapoint === undefined) return;
            setEditedDatapoint({
                oldDate: editedDatapoint.oldDate,
                isoDate: editedDatapoint.isoDate,
                value: value ?? "0",
                index: editedDatapoint.index,
            });
        },
        [editedDatapoint],
    );

    const handleSetDatapointDate = useCallback(
        (selectedDate?: IsoDate) => {
            if (selectedDate === undefined || editedDatapoint?.index === undefined) {
                return;
            }
            setEditedDatapoint({
                oldDate: editedDatapoint.oldDate,
                isoDate: selectedDate,
                value: editedDatapoint?.value ?? "0",
                index: editedDatapoint.index,
            });
        },
        [editedDatapoint?.index, editedDatapoint?.oldDate, editedDatapoint?.value],
    );

    const mappedData = useMemo(() => {
        if (editedMeasurement !== undefined && editedMeasurement.measurement && editedMeasurement.measurement?.data) {
            const filledData = 3 - (editedMeasurement.measurement.data.length % 3);
            return filledData === 0
                ? editedMeasurement?.measurement?.data
                : [...editedMeasurement.measurement.data, ...Array(filledData).fill(undefined)];
        }
        return undefined;
    }, [editedMeasurement]);

    const handleToastClosed = useCallback(() => {
        closeToast();
        if (editedMeasurement?.measurement?.data.length === 0) {
            handleNavigateToMeasurements();
        }
    }, [closeToast, editedMeasurement?.measurement?.data.length, handleNavigateToMeasurements]);

    const dateConfig = useMemo(
        () =>
            measurementDates?.map(
                (date, index) => ({ date, marked: true, latest: index === measurementDates?.length - 1 }) satisfies DateConfig,
            ),
        [measurementDates],
    );

    if (editedMeasurement === undefined) {
        navigateBack();
        return null;
    }

    return (
        <ThemedView background stretch>
            <SiteNavigationButtons backButtonAction={handleNavigateToMeasurements} title={editedMeasurement.measurement?.name} />
            <PageContent stretch ghost paddingTop={20}>
                <FlatList
                    contentInset={flatlistConfig.contentInset}
                    contentContainerStyle={flatlistConfig.contentContainerStyle}
                    numColumns={3}
                    columnWrapperStyle={flatlistConfig.columnWrapperStyle}
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

            <ThemedBottomSheetModal title={title} ref={ref}>
                <PageContent ghost stretch paddingTop={20}>
                    <EditableExerciseInputRow
                        placeholder="0"
                        background
                        stretch
                        suffix={unit}
                        setValue={handleSetDatapointValue}
                        value={editedDatapoint?.value}
                    />
                    <ThemedView round padding background style={{ gap: 20, marginBottom: 20 }}>
                        <Text style={{ fontSize: 20 }} ghost>
                            Neues Datum der Messung:
                        </Text>
                        <DatePicker
                            handleSelectDate={handleSetDatapointDate}
                            selectedDate={editedDatapoint?.isoDate ?? getDateTodayIso()}
                            dateConfig={dateConfig}
                            allSelectable
                        />
                    </ThemedView>
                </PageContent>
                <PageContent ghost>
                    <HStack ghost style={createStyles.actionWrapper}>
                        <ThemedPressable stretch center padding round onPress={handleCheckForDates}>
                            <Text>{t("measurement_add")}</Text>
                        </ThemedPressable>
                        <ThemedPressable stretch center padding round onPress={handleDeleteDataPoint}>
                            <Text>{t("measurement_delete")}</Text>
                        </ThemedPressable>
                    </HStack>
                </PageContent>
            </ThemedBottomSheetModal>
            <ThemedBottomSheetModal ref={warningRef} title={t("measurement_warning_title")}>
                <PageContent safeBottom stretch ghost>
                    <HStack stretch ghost style={createStyles.warningWrapper}>
                        <AnswerText>{t(`measurement_warning_text`)}</AnswerText>
                    </HStack>
                    <ThemedPressable center padding round onPress={handleSaveEditedDatapoint}>
                        <HStack ghost center style={createStyles.warningConfirmWrapper}>
                            <ThemedMaterialCommunityIcons name="content-save-outline" size={24} />
                            <Text>{t("measurement_warning_confirm")}</Text>
                        </HStack>
                    </ThemedPressable>
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
