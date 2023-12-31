import { useAppDispatch, useAppSelector } from "../../../store";
import { getLanguage, getThemeKey, getUnitSystem } from "../../../store/reducers/settings/settingsSelectors";
import { getDatesFromCurrentMeasurement, getEditedMeasurement, getMeasurementDataPoint, getUnitByType } from "../../../store/reducers/measurements/measurementSelectors";
import { useCallback, useMemo, useState } from "react";
import { useTheme } from "../../../theme/context";
import { useTranslation } from "react-i18next";
import { getAppInstallDate } from "../../../store/reducers/metadata/metadataSelectors";
import { mutateEditedMeasurement, saveEditedMeasurement, saveMeasurementDataPoint } from "../../../store/reducers/measurements";
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
import { useNavigate } from "../../../hooks/navigate";
import { convertDate, getDateTodayIso } from "../../../utils/date";

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
    const type = useAppSelector(getEditedMeasurement)?.measurement.type;
    return getUnitByType(unitSystem, type);
};
const getTypeByUnit = (unit: string) => {
    return measurementTypes.find((type) => getUnitByType("metric", type) === unit);
};

const MAX_DATE = new Date(getDateTodayIso());

const useDate = () => {
    const isMeasurementDataPoint = useAppSelector(getMeasurementDataPoint);
    const editedMeasurement = useAppSelector(getEditedMeasurement);
    if (isMeasurementDataPoint && !editedMeasurement?.isNew && editedMeasurement?.isDataPoint) {
        return convertDate.toDate(editedMeasurement.measurement.data[editedMeasurement.dataPointIndex].isoDate);
    }
};

export const CreateMeasurement = () => {
    const themeKey = useAppSelector(getThemeKey);
    const language = useAppSelector(getLanguage);
    const dates = useAppSelector(getDatesFromCurrentMeasurement);
    const [showWarning, setShowWarnining] = useState(false);
    const generatedDate = useDate() ?? MAX_DATE;
    const [date, setDate] = useState(generatedDate);
    const dispatch = useAppDispatch();
    const { mainColor, warningColor } = useTheme();
    const { t } = useTranslation();
    const dropdownValue = useDropdownValue();
    const measurementOptions = useMeasurementOptions();
    const editedMeasurement = useAppSelector(getEditedMeasurement);
    const installDate = useAppSelector(getAppInstallDate);
    const minimiumDate = useMemo(() => new Date(installDate ?? "2023-01-01"), [installDate]);
    const navigate = useNavigate();
    const isMeasurementDataPoint = useAppSelector(getMeasurementDataPoint);

    const handleSetMeasurementName = useCallback(
        (name: string) => {
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
            dispatch(mutateEditedMeasurement({ key: "type", value: getTypeByUnit(type) }));
        },
        [dispatch],
    );

    const handleSetMeasurementValue = useCallback(
        (value: string) => {
            dispatch(mutateEditedMeasurement({ key: "value", value }));
        },
        [dispatch],
    );

    const measurementButtonText = useMemo(() => {
        if (!editedMeasurement?.isNew) {
            return t("measurement_add");
        }
        if (showWarning) {
            return t("measurement_warning_confirm");
        }
        return t("measurement_create");
    }, [editedMeasurement?.isNew, showWarning, t]);

    const buttonIcon = useMemo(() => ({ name: !editedMeasurement?.isNew ? "table-check" : "table-large-plus", size: 24 }) as const, [editedMeasurement?.isNew]);

    const handleDateChange = useCallback(
        (_: unknown, selectedDate?: Date) => {
            const currentDate = selectedDate || date;
            setDate(currentDate);
        },
        [date],
    );

    const handleNavigateToMeasurements = useCallback(() => {
        navigate("measurements");
    }, [navigate]);

    const handleSaveMeasurement = useCallback(() => {
        const sameDateIndex = dates?.findIndex((searchDate) => searchDate === convertDate.toIsoDate(date));
        if (!isMeasurementDataPoint && !showWarning && sameDateIndex !== -1) {
            setShowWarnining(true);
            return;
        }
        if (isMeasurementDataPoint) {
            dispatch(saveMeasurementDataPoint({ isoDate: convertDate.toIsoDate(date) }));
        } else {
            dispatch(saveEditedMeasurement({ isoDate: convertDate.toIsoDate(date), replaceIndex: sameDateIndex !== -1 ? sameDateIndex : undefined }));
        }
        setShowWarnining(false);
        handleNavigateToMeasurements();
    }, [dates, showWarning, date, dispatch, handleNavigateToMeasurements, isMeasurementDataPoint]);

    return (
        <ThemedView background stretch round>
            <SiteNavigationButtons handleBack={handleNavigateToMeasurements} titleFontSize={40} title={t("measurement_page_title")} />
            <PageContent ghost paddingTop={20} stretch>
                <ThemedTextInput
                    maxLength={20}
                    errorKey="measurement_name"
                    style={createStyles.textInput}
                    onChangeText={handleSetMeasurementName}
                    value={editedMeasurement?.measurement.name}
                    clearButtonMode="while-editing"
                    editable={!isMeasurementDataPoint}
                    placeholder={t("measurement_placeholder")}
                />
                <HStack ghost style={{ alignSelf: "stretch", gap: 10 }}>
                    <ThemedTextInput
                        stretch
                        errorKey="measurement_value"
                        returnKeyType="done"
                        keyboardType="decimal-pad"
                        style={createStyles.textInput}
                        onChangeText={handleSetMeasurementValue}
                        value={editedMeasurement?.measurement.value}
                        clearButtonMode="while-editing"
                        placeholder={t("measurement")}
                    />
                    <ThemedDropdown
                        isSelectable={editedMeasurement?.isNew}
                        options={measurementOptions}
                        errorKey="measurement_type"
                        value={dropdownValue}
                        placeholder={t("measurement_unit")}
                        onSelectItem={handleSetMeasurementType}
                    />
                </HStack>
                <CheckBox
                    label={t("measurement_higher_is_better")}
                    helpText={t("measurement_higher_is_better_help")}
                    checked={editedMeasurement?.measurement.higherIsBetter}
                    size={26}
                    onChecked={handleSelectHigherIsBetter}
                    disabled={isMeasurementDataPoint}
                />
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
            </PageContent>
            <PageContent safeBottom ghost>
                {showWarning && (
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
