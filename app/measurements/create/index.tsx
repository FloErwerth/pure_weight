import { useAppDispatch, useAppSelector } from "../../../store";
import { getLanguage, getThemeKeyFromStore, getUnitSystem } from "../../../store/reducers/settings/settingsSelectors";
import {
    getDatesFromCurrentMeasurement,
    getEditedMeasurement,
    getUnitByType,
} from "../../../store/reducers/measurements/measurementSelectors";
import { useCallback, useMemo, useState } from "react";
import { useTheme } from "../../../theme/context";
import { useTranslation } from "react-i18next";
import { getAppInstallDate } from "../../../store/reducers/metadata/metadataSelectors";
import { mutateEditedMeasurement, saveEditedMeasurement } from "../../../store/reducers/measurements";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import { convertDate, getDateTodayIso } from "../../../utils/date";
import { EditableExerciseInputRow } from "../../../components/EditableExercise/EditableExerciseInputRow";
import { cleanError, setError } from "../../../store/reducers/errors";
import { ErrorFields } from "../../../store/reducers/errors/types";
import { View } from "react-native";

export const useMeasurementOptions = () => {
    const unitSystem = useAppSelector(getUnitSystem);
    return measurementTypes.map((type) => getUnitByType(unitSystem, type));
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

const MAX_DATE = new Date(getDateTodayIso());

const useIsValidMeasurement = () => {
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
        if (!editedMeasurement?.measurement?.value || editedMeasurement?.measurement?.value === "0") {
            errors.push("create_measurement_value");
        }
        if (errors.length > 0) {
            dispatch(setError(errors));
            return false;
        }
        return true;
    }, [editedMeasurement]);
};

export const CreateMeasurement = () => {
    const themeKey = useAppSelector(getThemeKeyFromStore);
    const language = useAppSelector(getLanguage);
    const dates = useAppSelector(getDatesFromCurrentMeasurement);
    const [showDateWarning, setShowWarnining] = useState(false);
    const [date, setDate] = useState(MAX_DATE);
    const dispatch = useAppDispatch();
    const { mainColor, warningColor } = useTheme();
    const { t } = useTranslation();
    const dropdownValue = useDropdownValue();
    const measurementOptions = useMeasurementOptions();
    const editedMeasurement = useAppSelector(getEditedMeasurement);
    const installDate = useAppSelector(getAppInstallDate);
    const minimiumDate = useMemo(() => new Date(installDate ?? "2023-01-01"), [installDate]);
    const navigateBack = useNavigateBack();
    const isEditing = editedMeasurement?.isEditing;
    const isAddingData = !editedMeasurement?.isEditing && !editedMeasurement?.isNew;
    const unitSystem = useAppSelector(getUnitSystem);
    const getIsValidMeasurement = useIsValidMeasurement();

    const value = useMemo(() => {
        const value = editedMeasurement?.measurement?.value;
        const data = editedMeasurement?.measurement?.data;

        if (!value || data?.length === 0) {
            return undefined;
        }
        if (value) {
            return value;
        }
        if (data) {
            return data[data.length - 1]?.value;
        }
    }, [editedMeasurement?.measurement?.data, editedMeasurement?.measurement?.value]);

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
            return t("measurement_save_edit");
        }
        if (!editedMeasurement?.isNew) {
            return t("measurement_add");
        }
        if (showDateWarning) {
            return t("measurement_warning_confirm");
        }
        return t("measurement_create");
    }, [editedMeasurement?.isEditing, editedMeasurement?.isNew, showDateWarning, t]);

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
        (_: unknown, selectedDate?: Date) => {
            const currentDate = selectedDate || date;
            setDate(currentDate);
        },
        [date],
    );

    const pageTitle = useMemo(() => {
        if (isAddingData) {
            return t("measurement_add_data");
        }
        if (editedMeasurement?.isEditing) {
            return t("measurement_edit");
        }
        return t("measurement_page_title");
    }, [editedMeasurement?.isEditing, isAddingData, t]);

    const handleSaveMeasurement = useCallback(() => {
        if (!getIsValidMeasurement()) {
            return;
        }
        const sameDateIndex = dates?.findIndex((searchDate) => searchDate === convertDate.toIsoDate(date));
        if (!isEditing && !showDateWarning && sameDateIndex !== -1) {
            setShowWarnining(true);
            return;
        }
        dispatch(
            saveEditedMeasurement({ isoDate: convertDate.toIsoDate(date), replaceIndex: sameDateIndex !== -1 ? sameDateIndex : undefined }),
        );

        setShowWarnining(false);
        navigateBack();
    }, [dates, isEditing, showDateWarning, dispatch, date, navigateBack, getIsValidMeasurement]);

    const helpText = useMemo(() => ({ title: t("measurement_higher_is_better"), text: t("measurement_higher_is_better_help") }), [t]);

    const handleNavigateBack = useCallback(() => {
        navigateBack();
        cleanError(["create_measurement_name", "create_measurement_type", "create_measurement_value"]);
    }, [navigateBack]);

    return (
        <ThemedView background stretch round>
            <SiteNavigationButtons backButtonAction={handleNavigateBack} title={pageTitle} />
            <PageContent ghost stretch paddingTop={20} style={{ gap: 10 }}>
                {!isAddingData && (
                    <View>
                        <ThemedTextInput
                            maxLength={20}
                            errorKey="create_measurement_name"
                            style={createStyles.textInput}
                            onChangeText={handleSetMeasurementName}
                            value={editedMeasurement?.measurement?.name}
                            clearButtonMode="while-editing"
                            placeholder={t("measurement_placeholder")}
                        />
                    </View>
                )}
                {!isEditing && (
                    <HStack ghost style={{ gap: 5 }}>
                        <EditableExerciseInputRow
                            placeholder="0"
                            stretch
                            errorTextConfig={{ errorKey: "create_measurement_value" }}
                            suffix={valueSuffix}
                            setValue={handleSetMeasurementValue}
                            value={editedMeasurement?.measurement?.value}
                        />
                        {!isAddingData && (
                            <ThemedDropdown
                                isSelectable={editedMeasurement?.isNew}
                                options={measurementOptions}
                                errorKey="create_measurement_type"
                                value={dropdownValue}
                                placeholder={t("measurement_unit")}
                                onSelectItem={handleSetMeasurementType}
                            />
                        )}
                    </HStack>
                )}
                {!isAddingData && (
                    <CheckBox
                        label={t("measurement_higher_is_better")}
                        helpTextConfig={helpText}
                        checked={Boolean(editedMeasurement?.measurement?.higherIsBetter)}
                        size={20}
                        onChecked={handleSelectHigherIsBetter}
                    />
                )}
                {!isEditing && (
                    <DateTimePicker
                        display="inline"
                        maximumDate={MAX_DATE}
                        minimumDate={minimiumDate}
                        locale={language}
                        accentColor={mainColor}
                        themeVariant={themeKey}
                        style={createStyles.calendar}
                        onChange={handleDateChange}
                        value={date}
                    />
                )}
            </PageContent>
            <PageContent safeBottom ghost>
                {showDateWarning && (
                    <HStack ghost style={createStyles.warningWrapper}>
                        <ThemedMaterialCommunityIcons ghost name="alert-circle-outline" size={20} color={warningColor} />
                        <Text ghost warning style={createStyles.warningText}>
                            {t(`measurement_warning_text`)}
                        </Text>
                    </HStack>
                )}
                <AddButton onPress={handleSaveMeasurement} title={measurementButtonText} icon={buttonIcon} />
            </PageContent>
        </ThemedView>
    );
};
