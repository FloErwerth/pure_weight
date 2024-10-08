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
} from "../../../../store/selectors/measurements/measurementSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getUnitSystem } from "../../../../store/selectors/settings/settingsSelectors";
import { Keyboard, View } from "react-native";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { HStack } from "../../../../components/Stack/HStack/HStack";
import { createStyles } from "../../../../components/App/measurements/styles";
import { AnswerText } from "../../../../components/HelpQuestionAnswer/AnswerText";
import { ThemedPressable } from "../../../../components/Themed/Pressable/Pressable";
import { ThemedMaterialCommunityIcons } from "../../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { setError } from "../../../../store/reducers/errors";
import { useTypedTranslation } from "../../../../locales/i18next";
import { TranslationKeys } from "../../../../locales/translationKeys";

export const MeasurementHistoryEdit = () => {
	const navigateBack = useNavigateBack();
	const measurementDates = useAppSelector(getDatesFromCurrentMeasurement);
	const unitSystem = useAppSelector(getUnitSystem);
	const { ref: dateWarning, openBottomSheet: openDateWarning, closeBottomSheet: closeDateWarning, isOpen: showDateWarning } = useBottomSheetRef();

	const { ref: discardWarning, openBottomSheet: openDiscardWarning, closeBottomSheet: closeDiscardWarning } = useBottomSheetRef();
	const editedDatapoint = useAppSelector(getEditedMeasurementDataPoint);
	const editedMeasurement = useAppSelector(getEditedMeasurement);
	const dispatch = useAppDispatch();
	const { t } = useTypedTranslation();

	const handleNavigateBack = useCallback(() => {
		closeDiscardWarning();
		navigateBack();
	}, [closeDiscardWarning, navigateBack]);

	const handleValidateBack = useCallback(() => {
		const newStringifiedDatapoint = JSON.stringify({
			isoDate: editedDatapoint?.isoDate,
			value: editedDatapoint?.value,
		});
		if (newStringifiedDatapoint !== editedDatapoint?.stringifiedDataPoint) {
			openDiscardWarning();
			return;
		}
		navigateBack();
	}, [editedDatapoint?.isoDate, editedDatapoint?.stringifiedDataPoint, editedDatapoint?.value, navigateBack, openDiscardWarning]);

	const handleSaveEditedDatapoint = useCallback(() => {
		if (editedDatapoint) {
			if (editedDatapoint?.value === undefined || editedDatapoint?.value === "") {
				dispatch(setError(["create_measurement_value"]));
				return;
			}
			const datapoint = { ...editedDatapoint, value: editedDatapoint?.value ?? "0" };
			if (showDateWarning) {
				const overwriteIndex = editedMeasurement?.measurement?.data.findIndex((datapoint) => datapoint?.isoDate === editedDatapoint?.isoDate);
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

	const handleConfirmSave = useCallback(() => {
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
		() => measurementDates?.map((date, index) => ({ date, marked: true, latest: index === measurementDates?.length - 1 }) satisfies DateConfig),
		[measurementDates],
	);
	return (
		<>
			<ThemedView stretch ghost>
				<SiteNavigationButtons
					title={t(TranslationKeys.MEASUREMENT_DATAPOINT_EDIT_TITLE)}
					backButtonAction={handleValidateBack}
					handleConfirm={handleConfirmSave}
				/>
				<PageContent scrollable ghost paddingTop={10} style={{ gap: 10 }} stretch>
					<View style={{ gap: 3 }}>
						<Text style={{ fontSize: 26 }} ghost>
							{editedMeasurement?.measurement?.name}
						</Text>
						<EditableExerciseInputRow
							placeholder="0"
							errorTextConfig={{ errorKey: "create_measurement_value" }}
							suffix={unit}
							setValue={handleSetDatapointValue}
							value={editedDatapoint?.value}
						/>
					</View>
					<ThemedView input round padding>
						<Text style={{ fontSize: 20, marginBottom: 20 }} ghost>
							{t(TranslationKeys.MEASUREMENT_DATAPOINT_NEW_DATE)}
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
			<ThemedBottomSheetModal ref={dateWarning} title={t(TranslationKeys.ALERT_MEASUREMENT_DATE_TITLE)}>
				<PageContent paddingTop={20} safeBottom stretch ghost>
					<AnswerText>{t(TranslationKeys.ALERT_MEASUREMENT_DATE_CONTENT)}</AnswerText>
				</PageContent>
				<PageContent ghost>
					<ThemedPressable center padding round onPress={handleSaveEditedDatapoint}>
						<HStack ghost center style={createStyles.warningConfirmWrapper}>
							<ThemedMaterialCommunityIcons name="content-save-outline" size={24} />
							<Text>{t(TranslationKeys.ALERT_MEASUREMENT_DATE_CONFIRM)}</Text>
						</HStack>
					</ThemedPressable>
				</PageContent>
			</ThemedBottomSheetModal>
			<ThemedBottomSheetModal ref={discardWarning} title={t(TranslationKeys.ALERT_DISCARD_MEASUREMENT_DATAPOINT_TITLE)}>
				<PageContent stretch ghost>
					<AnswerText>{t(TranslationKeys.ALERT_DISCARD_MEASUREMENT_DATAPOINT_CONTENT)}</AnswerText>
				</PageContent>
				<PageContent paddingTop={20} ghost>
					<ThemedPressable center padding round onPress={handleNavigateBack}>
						<HStack ghost center gap>
							<ThemedMaterialCommunityIcons name="content-save-outline" size={24} />
							<Text>{t(TranslationKeys.ALERT_DISCARD_MEASUREMENT_DATAPOINT_CONFIRM)}</Text>
						</HStack>
					</ThemedPressable>
				</PageContent>
			</ThemedBottomSheetModal>
		</>
	);
};
