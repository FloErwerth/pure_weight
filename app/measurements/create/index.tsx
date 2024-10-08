import { useAppDispatch, useAppSelector } from "../../../store";
import { getUnitSystem } from "../../../store/selectors/settings/settingsSelectors";
import { getDatesFromCurrentMeasurement, getEditedMeasurement, getUnitByType } from "../../../store/selectors/measurements/measurementSelectors";
import React, { useCallback, useMemo, useState } from "react";
import { mutateEditedMeasurement, saveEditedMeasurement } from "../../../store/reducers/measurements";
import { ThemedTextInput } from "../../../components/Themed/ThemedTextInput/ThemedTextInput";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { ThemedDropdown } from "../../../components/Themed/Dropdown/ThemedDropdown";
import { CheckBox } from "../../../components/Themed/CheckBox/CheckBox";
import { ThemedMaterialCommunityIcons } from "../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { AddButton } from "../../../components/AddButton/AddButton";
import { createStyles } from "../../../components/App/measurements/styles";
import { MeasurementType, measurementTypes } from "../../../components/App/measurements/types";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../components/PageContent/PageContent";
import { useNavigateBack } from "../../../hooks/navigate";
import { getDateTodayIso } from "../../../utils/date";
import { EditableExerciseInputRow } from "../../../components/EditableExercise/EditableExerciseInputRow";
import { cleanError, setError } from "../../../store/reducers/errors";
import { ErrorFields } from "../../../store/reducers/errors/types";
import { View } from "react-native";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { AnswerText } from "../../../components/HelpQuestionAnswer/AnswerText";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { DateConfig, DatePicker } from "../../../components/DatePicker/DatePicker";
import { IsoDate } from "../../../types/date";
import { styles } from "../../../components/App/create/styles";
import { useTypedTranslation } from "../../../locales/i18next";
import { TranslationKeys } from "../../../locales/translationKeys";

export const useMeasurementOptions = () => {
	const unitSystem = useAppSelector(getUnitSystem);
	return measurementTypes.map((type) => ({
		value: getUnitByType(unitSystem, type),
		label: getUnitByType(unitSystem, type),
	}));
};

export const useMeasurementOptionMap = () => {
	const unitSystem = useAppSelector(getUnitSystem);
	return measurementTypes.reduce(
		(acc, type) => {
			acc[type] = getUnitByType(unitSystem, type);
			return acc;
		},
		{} as Record<MeasurementType, string>,
	);
};

const useDropdownValue = () => {
	const unitSystem = useAppSelector(getUnitSystem);
	const type = useAppSelector(getEditedMeasurement)?.measurement?.type;
	return getUnitByType(unitSystem, type);
};

const getTypeByUnit = (unit: string) => {
	return measurementTypes.find((type) => getUnitByType("metric", type) === unit);
};

const MAX_DATE = getDateTodayIso();

const useIsValidMeasurement = (isEditing?: boolean) => {
	const editedMeasurement = useAppSelector(getEditedMeasurement);
	const dispatch = useAppDispatch();

	return useCallback(() => {
		const errors: ErrorFields[] = [];
		if (!editedMeasurement?.measurement?.name) {
			errors.push("create_measurement_name");
		}
		if (!editedMeasurement?.measurement?.type) {
			errors.push("create_measurement_type");
		}
		if ((!isEditing && !editedMeasurement?.measurement?.value) || editedMeasurement?.measurement?.value === "0") {
			errors.push("create_measurement_value");
		}
		if (errors.length > 0) {
			dispatch(setError(errors));
			return false;
		}
		return true;
	}, [dispatch, editedMeasurement?.measurement?.name, editedMeasurement?.measurement?.type, editedMeasurement?.measurement?.value, isEditing]);
};

export const CreateMeasurement = () => {
	const dates = useAppSelector(getDatesFromCurrentMeasurement);
	const [date, setDate] = useState(MAX_DATE);
	const dispatch = useAppDispatch();
	const { t } = useTypedTranslation();
	const dropdownValue = useDropdownValue();
	const measurementOptions = useMeasurementOptions();
	const editedMeasurement = useAppSelector(getEditedMeasurement);
	const navigateBack = useNavigateBack();
	const isEditing = editedMeasurement?.isEditing;
	const isAddingData = !editedMeasurement?.isEditing && !editedMeasurement?.isNew;
	const unitSystem = useAppSelector(getUnitSystem);
	const getIsValidMeasurement = useIsValidMeasurement(isEditing);
	const { ref: discardWarningRef, openBottomSheet: openDiscardWarning } = useBottomSheetRef();
	const { ref: dateWarningRef, openBottomSheet: openDateWarning } = useBottomSheetRef();

	const wasEdited = useMemo(
		() => Boolean(editedMeasurement?.stringifiedMeasurement !== JSON.stringify(editedMeasurement?.measurement)),
		[editedMeasurement?.stringifiedMeasurement, editedMeasurement?.measurement],
	);
	const valueSuffix = useMemo(() => {
		return isAddingData ? getUnitByType(unitSystem, editedMeasurement?.measurement?.type) : "";
	}, [isAddingData, unitSystem, editedMeasurement?.measurement?.type]);

	const handleSetMeasurementName = useCallback(
		(name: string) => {
			dispatch(cleanError(["create_measurement_name"]));
			dispatch(mutateEditedMeasurement({ key: "name", value: name }));
		},
		[dispatch],
	);

	const handleSelectHigherIsBetter = useCallback(
		(higherIsBetter: boolean) => {
			dispatch(mutateEditedMeasurement({ key: "higherIsBetter", value: higherIsBetter }));
		},
		[dispatch],
	);

	const handleSetMeasurementType = useCallback(
		(type: string) => {
			dispatch(cleanError(["create_measurement_type"]));
			dispatch(mutateEditedMeasurement({ key: "type", value: getTypeByUnit(type) }));
		},
		[dispatch],
	);

	const handleSetMeasurementValue = useCallback(
		(value: string) => {
			dispatch(cleanError(["create_measurement_value"]));
			dispatch(mutateEditedMeasurement({ key: "value", value: value ?? "0" }));
		},
		[dispatch],
	);

	const measurementButtonText = useMemo(() => {
		if (editedMeasurement?.isEditing) {
			return t(TranslationKeys.MEASUREMENT_SAVE_EDIT);
		}
		if (!editedMeasurement?.isNew) {
			return t(TranslationKeys.MEASUREMENT_ADD);
		}
		return t(TranslationKeys.MEASUREMENT_CREATE);
	}, [editedMeasurement?.isEditing, editedMeasurement?.isNew, t]);

	const buttonIcon = useMemo(() => {
		if (editedMeasurement?.isEditing) {
			return { name: "content-save-edit", size: 24 } as const;
		}
		if (!editedMeasurement?.isNew) {
			return { name: "table-plus", size: 24 } as const;
		}
		return { name: "table-check", size: 24 } as const;
	}, [editedMeasurement?.isEditing, editedMeasurement?.isNew]);

	const handleDateChange = useCallback(
		(selectedDate?: IsoDate) => {
			setDate(selectedDate ?? date);
		},
		[date],
	);

	const pageTitle = useMemo(() => {
		if (isAddingData) {
			return t(TranslationKeys.MEASUREMENT_ADD_DATA);
		}
		if (editedMeasurement?.isEditing) {
			return t(TranslationKeys.MEASUREMENT_EDIT);
		}
		return t(TranslationKeys.MEASUREMENT_PAGE_TITLE);
	}, [editedMeasurement?.isEditing, isAddingData, t]);

	const handleSaveMeasurement = useCallback(() => {
		const sameDateIndex = dates?.findIndex((searchDate) => searchDate === date);
		dispatch(
			saveEditedMeasurement({
				isoDate: date,
				replaceIndex: sameDateIndex !== -1 ? sameDateIndex : undefined,
			}),
		);
		navigateBack();
	}, [date, dates, dispatch, navigateBack]);

	const handleCheckMeasurement = useCallback(() => {
		if (!getIsValidMeasurement()) {
			return;
		}
		const sameDateIndex = dates?.findIndex((searchDate) => searchDate === date);
		if (!isEditing && sameDateIndex !== -1) {
			openDateWarning();
			return;
		}
		handleSaveMeasurement();
	}, [getIsValidMeasurement, dates, isEditing, handleSaveMeasurement, date, openDateWarning]);

	const helpText = useMemo(
		() => ({
			title: t(TranslationKeys.MEASUREMENT_HIGHER_IS_BETTER),
			text: t(TranslationKeys.MEASUREMENT_HIGHER_IS_BETTER_HELP),
		}),
		[t],
	);

	const handleNavigateBack = useCallback(() => {
		navigateBack();
		cleanError(["create_measurement_name", "create_measurement_type", "create_measurement_value"]);
	}, [navigateBack]);

	const handleBackButtonPress = useCallback(() => {
		if (wasEdited) {
			openDiscardWarning();
			return;
		}
		handleNavigateBack();
	}, [handleNavigateBack, openDiscardWarning, wasEdited]);

	const discardWarningTitle = useMemo(
		() =>
			t(
				isAddingData
					? TranslationKeys.ALERT_ADD_MEASUREMENT_DATA_TITLE
					: !isEditing
						? TranslationKeys.ALERT_CREATE_DISCARD_TITLE
						: TranslationKeys.ALERT_EDIT_DISCARD_TITLE,
			),
		[isAddingData, isEditing, t],
	);

	const discardWarningContent = useMemo(
		() =>
			t(
				isAddingData
					? TranslationKeys.ALERT_ADD_MEASUREMENT_DATA_CONTENT
					: !isEditing
						? TranslationKeys.ALERT_CREATE_MEASUREMENT_DISCARD_CONTENT
						: TranslationKeys.ALERT_EDIT_MEASUREMENT_DISCARD_CONTENT,
			),
		[isAddingData, isEditing, t],
	);

	const discardWarningConfirm = useMemo(
		() =>
			t(
				isAddingData
					? TranslationKeys.ALERT_ADD_MEASUREMENT_DATA_CONFIRM
					: !isEditing
						? TranslationKeys.ALERT_CREATE_CONFIRM_CANCEL
						: TranslationKeys.ALERT_EDIT_CONFIRM_CANCEL,
			),
		[isAddingData, isEditing, t],
	);

	const dateWarningTitle = useMemo(() => t(TranslationKeys.ALERT_MEASUREMENT_DATE_TITLE), [t]);
	const dateWarningContent = useMemo(() => t(TranslationKeys.ALERT_MEASUREMENT_DATE_CONTENT), [t]);
	const dateWarniningOverwriteConfirm = useMemo(() => t(TranslationKeys.ALERT_MEASUREMENT_DATE_CONFIRM), [t]);

	const dateConfig = useMemo(
		() =>
			dates?.map(
				(date, index) =>
					({
						date,
						marked: true,
						latest: index === dates?.length - 1,
					}) satisfies DateConfig,
			),
		[dates],
	);

	const unitModalTitle = useMemo(() => t(TranslationKeys.MEASUREMENT_UNIT_MODAL_TITLE), [t]);
	const errorConfig = useMemo(() => ({ errorKey: "create_measurement_value" }) as const, []);
	return (
		<ThemedView background stretch round>
			<SiteNavigationButtons backButtonAction={handleBackButtonPress} title={pageTitle} />
			<ThemedView ghost stretch>
				<PageContent ghost>
					{!isAddingData && (
						<View>
							<ThemedTextInput
								maxLength={20}
								errorKey="create_measurement_name"
								style={createStyles.textInput}
								onChangeText={handleSetMeasurementName}
								value={editedMeasurement?.measurement?.name}
								clearButtonMode="while-editing"
								placeholder={t(TranslationKeys.MEASUREMENT_PLACEHOLDER)}
							/>
						</View>
					)}
					{!isEditing && (
						<ThemedView ghost>
							<HStack ghost style={styles.gap}>
								<EditableExerciseInputRow
									placeholder="0"
									stretch
									errorTextConfig={errorConfig}
									suffix={valueSuffix}
									setValue={handleSetMeasurementValue}
									value={editedMeasurement?.measurement?.value}
								/>
								{!isAddingData && (
									<ThemedDropdown
										hideCheck
										stretch
										modalTitle={unitModalTitle}
										isSelectable={editedMeasurement?.isNew}
										options={measurementOptions}
										errorKey="create_measurement_type"
										value={dropdownValue}
										placeholder={t(TranslationKeys.MEASUREMENT_UNIT)}
										onSelectItem={handleSetMeasurementType}
									/>
								)}
							</HStack>
						</ThemedView>
					)}
					{!isAddingData && (
						<CheckBox
							label={t(TranslationKeys.MEASUREMENT_HIGHER_IS_BETTER)}
							helpTextConfig={helpText}
							checked={Boolean(editedMeasurement?.measurement?.higherIsBetter)}
							size={20}
							onChecked={handleSelectHigherIsBetter}
						/>
					)}
					{!isEditing && (
						<ThemedView round input padding>
							<Text style={styles.textSize} ghost>
								{t(TranslationKeys.MEASUREMENT_DATAPOINT_DATE)}
							</Text>
							<DatePicker handleSelectDate={handleDateChange} selectedDate={date} dateConfig={dateConfig} allSelectable />
						</ThemedView>
					)}
				</PageContent>
			</ThemedView>

			<PageContent ghost safeBottom>
				<AddButton onPress={handleCheckMeasurement} title={measurementButtonText} icon={buttonIcon} />
			</PageContent>

			<ThemedBottomSheetModal ref={dateWarningRef} title={dateWarningTitle}>
				<PageContent stretch ghost>
					<AnswerText>{dateWarningContent}</AnswerText>
				</PageContent>
				<PageContent ghost paddingTop={30}>
					<ThemedPressable center padding round onPress={handleSaveMeasurement}>
						<HStack style={styles.save}>
							<ThemedMaterialCommunityIcons name="table-check" size={24} />
							<Text>{dateWarniningOverwriteConfirm}</Text>
						</HStack>
					</ThemedPressable>
				</PageContent>
			</ThemedBottomSheetModal>

			<ThemedBottomSheetModal title={discardWarningTitle} ref={discardWarningRef}>
				<PageContent stretch ghost>
					<AnswerText>{discardWarningContent}</AnswerText>
				</PageContent>
				<PageContent ghost paddingTop={30}>
					<ThemedView ghost style={styles.largeGap}>
						<ThemedPressable center round padding secondary onPress={handleNavigateBack}>
							<HStack ghost style={styles.save}>
								<ThemedMaterialCommunityIcons ghost name="check" size={24} />
								<Text ghost>{discardWarningConfirm}</Text>
							</HStack>
						</ThemedPressable>
					</ThemedView>
				</PageContent>
			</ThemedBottomSheetModal>
		</ThemedView>
	);
};
