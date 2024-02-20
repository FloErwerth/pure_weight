import { EditableExerciseInputRow } from "../../../../components/EditableExercise/EditableExerciseInputRow";
import { ThemedView } from "../../../../components/Themed/ThemedView/View";
import { Text } from "../../../../components/Themed/ThemedText/Text";
import { DateConfig, DatePicker } from "../../../../components/DatePicker/DatePicker";
import { getDateTodayIso } from "../../../../utils/date";
import { PageContent } from "../../../../components/PageContent/PageContent";
import React, { useCallback, useMemo } from "react";
import { SiteNavigationButtons } from "../../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useNavigateBack } from "../../../../hooks/navigate";
import { IsoDate } from "../../../../types/date";
import { deleteMeasurementDataPoint, mutateEditedDatapoint, saveMeasurementDataPoint } from "../../../../store/reducers/measurements";
import {
    getDatesFromCurrentMeasurement,
    getEditedMeasurement,
    getEditedMeasurementDataPoint,
    getUnitByType,
} from "../../../../store/reducers/measurements/measurementSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getUnitSystem } from "../../../../store/reducers/settings/settingsSelectors";
import { Keyboard, View } from "react-native";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { HStack } from "../../../../components/Stack/HStack/HStack";
import { createStyles } from "../../../../components/App/measurements/styles";
import { AnswerText } from "../../../../components/HelpQuestionAnswer/AnswerText";
import { ThemedPressable } from "../../../../components/Themed/Pressable/Pressable";
import { ThemedMaterialCommunityIcons } from "../../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { useTranslation } from "react-i18next";

export const MeasurementHistoryEdit = () => {
    const navigateBack = useNavigateBack();
    const measurementDates = useAppSelector(getDatesFromCurrentMeasurement);
    const unitSystem = useAppSelector(getUnitSystem);
    const {
        ref: dateWarning,
        openBottomSheet: openDateWarning,
        closeBottomSheet: closeDateWarning,
        isOpen: showDateWarning,
    } = useBottomSheetRef();

    const { ref: discardWarning, openBottomSheet: openDiscardWarning, closeBottomSheet: closeDiscardWarning } = useBottomSheetRef();
    const editedDatapoint = useAppSelector(getEditedMeasurementDataPoint);
    const editedMeasurement = useAppSelector(getEditedMeasurement);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const handleNavigateBack = useCallback(() => {
        closeDiscardWarning();
        navigateBack();
    }, [closeDiscardWarning, navigateBack]);

    const handleValidateBack = useCallback(() => {
        const newStringifiedDatapoint = JSON.stringify({ isoDate: editedDatapoint?.isoDate, value: editedDatapoint?.value });
        if (newStringifiedDatapoint !== editedDatapoint?.stringifiedDataPoint) {
            openDiscardWarning();
            return;
        }
        navigateBack();
    }, [editedDatapoint?.isoDate, editedDatapoint?.stringifiedDataPoint, editedDatapoint?.value, navigateBack, openDiscardWarning]);

    const handleSaveEditedDatapoint = useCallback(() => {
        if (editedDatapoint) {
            const datapoint = { ...editedDatapoint, value: editedDatapoint?.value ?? "0" };
            if (showDateWarning) {
                const overwriteIndex = editedMeasurement?.measurement?.data.findIndex(
                    (datapoint) => datapoint?.isoDate === editedDatapoint?.isoDate,
                );
                dispatch(saveMeasurementDataPoint({ datapoint, index: overwriteIndex }));
                dispatch(deleteMeasurementDataPoint({ index: datapoint?.indexInData }));
                closeDateWarning();
            } else {
                dispatch(saveMeasurementDataPoint({ datapoint, index: datapoint?.indexInData }));
                navigateBack();
            }
        }
        Keyboard.dismiss();
    }, [closeDateWarning, dispatch, editedDatapoint, editedMeasurement?.measurement?.data, navigateBack, showDateWarning]);

    const handleSetDatapointDate = useCallback(
        (selectedDate?: IsoDate) => {
            dispatch(
                mutateEditedDatapoint({
                    key: "isoDate",
                    value: selectedDate,
                }),
            );
        },
        [dispatch],
    );

    const unit = useMemo(() => {
        return getUnitByType(unitSystem, editedMeasurement?.measurement?.type);
    }, [editedMeasurement?.measurement?.type, unitSystem]);

    const handleCheckForDates = useCallback(() => {
        if (editedDatapoint?.isoDate === undefined) {
            return;
        }
        const originalIsoDate = editedMeasurement?.measurement?.data[editedDatapoint?.indexInData]?.isoDate;
        if (measurementDates?.includes(editedDatapoint?.isoDate) && editedDatapoint?.isoDate !== originalIsoDate) {
            openDateWarning();
            return;
        }
        handleSaveEditedDatapoint();
    }, [
        editedDatapoint?.isoDate,
        editedDatapoint?.indexInData,
        editedMeasurement?.measurement?.data,
        measurementDates,
        handleSaveEditedDatapoint,
        openDateWarning,
    ]);

    const handleSetDatapointValue = useCallback(
        (value?: string) => {
            dispatch(
                mutateEditedDatapoint({
                    key: "value",
                    value,
                }),
            );
        },
        [dispatch],
    );

    const dateConfig = useMemo(
        () =>
            measurementDates?.map(
                (date, index) => ({ date, marked: true, latest: index === measurementDates?.length - 1 }) satisfies DateConfig,
            ),
        [measurementDates],
    );
    return (
        <>
            <ThemedView stretch ghost>
                <SiteNavigationButtons
                    title={t("measurement_datapoint_edit_title")}
                    backButtonAction={handleValidateBack}
                    handleConfirm={handleCheckForDates}
                />
                <PageContent scrollable ghost paddingTop={10} style={{ gap: 10 }} stretch>
                    <View style={{ gap: 3 }}>
                        <Text style={{ fontSize: 20 }} ghost>
                            {editedMeasurement?.measurement?.name}
                        </Text>
                        <EditableExerciseInputRow
                            placeholder="0"
                            suffix={unit}
                            setValue={handleSetDatapointValue}
                            value={editedDatapoint?.value}
                        />
                    </View>
                    <ThemedView input round padding>
                        <Text style={{ fontSize: 20, marginBottom: 20 }} ghost>
                            {t("measurement_datapoint_new_date")}
                        </Text>
                        <DatePicker
                            handleSelectDate={handleSetDatapointDate}
                            selectedDate={editedDatapoint?.isoDate ?? getDateTodayIso()}
                            dateConfig={dateConfig}
                            allSelectable
                        />
                    </ThemedView>
                </PageContent>
            </ThemedView>
            <ThemedBottomSheetModal ref={dateWarning} title={t("alert_measurement_date_title")}>
                <PageContent paddingTop={20} safeBottom stretch ghost>
                    <AnswerText>{t(`alert_measurement_date_content`)}</AnswerText>
                </PageContent>
                <PageContent ghost>
                    <ThemedPressable center padding round onPress={handleSaveEditedDatapoint}>
                        <HStack ghost center style={createStyles.warningConfirmWrapper}>
                            <ThemedMaterialCommunityIcons name="content-save-outline" size={24} />
                            <Text>{t("alert_measurement_date_confirm")}</Text>
                        </HStack>
                    </ThemedPressable>
                </PageContent>
            </ThemedBottomSheetModal>
            <ThemedBottomSheetModal ref={discardWarning} title={t("alert_discard_measurement_datapoint_title")}>
                <PageContent stretch ghost>
                    <AnswerText>{t(`alert_discard_measurement_datapoint_content`)} </AnswerText>
                </PageContent>
                <PageContent paddingTop={20} ghost>
                    <ThemedPressable center padding round onPress={handleNavigateBack}>
                        <HStack ghost center gap>
                            <ThemedMaterialCommunityIcons name="content-save-outline" size={24} />
                            <Text>{t("alert_discard_measurement_datapoint_confirm")}</Text>
                        </HStack>
                    </ThemedPressable>
                </PageContent>
            </ThemedBottomSheetModal>
        </>
    );
};
