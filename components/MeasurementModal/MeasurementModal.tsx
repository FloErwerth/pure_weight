import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedBottomSheetModal, ThemedBottomSheetModalProps } from "../BottomSheetModal/ThemedBottomSheetModal";
import { RefObject, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { getDateTodayIso } from "../../utils/date";
import { useAppDispatch, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { styles } from "./styles";
import { ThemedDropdown } from "../Themed/Dropdown/ThemedDropdown";
import { CheckBox } from "../Themed/CheckBox/CheckBox";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AnimatedView } from "../Themed/AnimatedView/AnimatedView";

import { getLanguage, getThemeKey, getUnitSystem } from "../../store/reducers/settings/settingsSelectors";
import { getDatesFromCurrentMeasurement, getEditedMeasurementData, getUnitByType } from "../../store/reducers/measurements/measurementSelectors";
import { IsoDate } from "../../types/date";
import { mutateEditedMeasurement, saveEditedMeasurement } from "../../store/reducers/measurements";
import { AddButton } from "../AddButton/AddButton";
import { View } from "react-native";
import { getAppInstallDate } from "../../store/reducers/metadata/metadataSelectors";
import { measurementTypes } from "../App/measurements/types";

interface MeasurementModalProps extends ThemedBottomSheetModalProps {
    reference: RefObject<BottomSheetModal>;
}

const useMeasurementOptions = () => {
    const unitSystem = useAppSelector(getUnitSystem);
    return measurementTypes.map((type) => getUnitByType(unitSystem, type));
};
const useDropdownValue = () => {
    const unitSystem = useAppSelector(getUnitSystem);
    const type = useAppSelector(getEditedMeasurementData)?.measurement.type;
    return getUnitByType(unitSystem, type);
};
const getTypeByUnit = (unit: string) => {
    return measurementTypes.find((type) => getUnitByType("metric", type) === unit);
};

const MAX_DATE = new Date(getDateTodayIso());
export const MeasurementModal = ({ onRequestClose, reference }: MeasurementModalProps) => {
    const themeKey = useAppSelector(getThemeKey);
    const dates = useAppSelector(getDatesFromCurrentMeasurement);
    const language = useAppSelector(getLanguage);
    const [showWarning, setShowWarnining] = useState(false);
    const [date, setDate] = useState(MAX_DATE);
    const dispatch = useAppDispatch();
    const { mainColor, warningColor } = useTheme();
    const { t } = useTranslation();
    const dropdownValue = useDropdownValue();
    const measurementOptions = useMeasurementOptions();
    const editedMeasurement = useAppSelector(getEditedMeasurementData);
    const installDate = useAppSelector(getAppInstallDate);
    const minimiumDate = useMemo(() => new Date(installDate ?? "2023-01-01"), [installDate]);

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
            return t("measurement_add_existing");
        }
        if (showWarning) {
            return t("measurement_warning_confirm");
        }
        return t("measurement_add");
    }, [editedMeasurement?.isNew, showWarning, t]);

    const handleSaveMeasurement = useCallback(() => {
        if (!showWarning && date && dates?.includes(date?.toISOString().split("T")[0] as IsoDate)) {
            setShowWarnining(true);
            return;
        }
        dispatch(saveEditedMeasurement({ hadWarning: showWarning }));
        setShowWarnining(false);
        onRequestClose?.();
    }, [showWarning, date, dates, dispatch, onRequestClose]);
    const buttonIcon = useMemo(() => ({ name: !editedMeasurement?.isNew ? "table-check" : "table-large-plus", size: 24 }) as const, [editedMeasurement?.isNew]);

    const handleDateChange = useCallback(
        (event: DateTimePickerEvent, selectedDate?: Date) => {
            const currentDate = selectedDate || date;
            setDate(currentDate);
        },
        [date],
    );

    if (!editedMeasurement) {
        return null;
    }
    const { value, name, higherIsBetter } = editedMeasurement.measurement;

    return (
        <ThemedBottomSheetModal onRequestClose={onRequestClose} title={measurementButtonText} snapPoints={["100%"]} ref={reference}>
            <View style={styles.outerWrapper}>
                <AnimatedView ghost style={styles.innerWrapper}>
                    <ThemedTextInput
                        maxLength={20}
                        errorKey="measurement_name"
                        style={styles.textInput}
                        onChangeText={handleSetMeasurementName}
                        value={name}
                        clearButtonMode="while-editing"
                        placeholder={t("measurement_placeholder")}
                    />
                    <HStack ghost style={{ alignSelf: "stretch", gap: 10 }}>
                        <ThemedTextInput
                            stretch
                            errorKey="measurement_value"
                            returnKeyType="done"
                            keyboardType="decimal-pad"
                            style={styles.textInput}
                            onChangeText={handleSetMeasurementValue}
                            value={value}
                            clearButtonMode="while-editing"
                            placeholder={t("measurement")}
                        />
                        <ThemedDropdown
                            isSelectable={editedMeasurement.isNew}
                            options={measurementOptions}
                            errorKey="measurement_type"
                            value={dropdownValue}
                            placeholder={t("measurement_unit")}
                            onSelectItem={handleSetMeasurementType}
                        />
                    </HStack>
                    <CheckBox label={t("measurement_higher_is_better")} helpText={t("measurement_higher_is_better_help")} checked={higherIsBetter} size={26} onChecked={handleSelectHigherIsBetter} />
                    <DateTimePicker
                        display="inline"
                        maximumDate={MAX_DATE}
                        minimumDate={minimiumDate}
                        locale={language}
                        accentColor={mainColor}
                        themeVariant={themeKey}
                        style={styles.calendar}
                        onChange={handleDateChange}
                        value={date}
                    />
                </AnimatedView>
                <View style={styles.innerWrapper}>
                    {showWarning && (
                        <HStack ghost style={styles.warningWrapper}>
                            <ThemedMaterialCommunityIcons ghost name="alert-circle-outline" size={20} color={warningColor} />
                            <Text ghost warning style={styles.warningText}>
                                {t(`measurement_warning_text`)}
                            </Text>
                        </HStack>
                    )}
                    <AddButton onPress={handleSaveMeasurement} title={measurementButtonText} icon={buttonIcon} />
                </View>
            </View>
        </ThemedBottomSheetModal>
    );
};
