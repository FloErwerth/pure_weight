import { Pressable } from "react-native";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedBottomSheetModal, ThemedBottomSheetModalProps } from "../BottomSheetModal/ThemedBottomSheetModal";
import { RefObject, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDateTodayIso } from "../../utils/date";
import { useAppDispatch, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { styles } from "./styles";
import { ThemedDropdown } from "../Themed/Dropdown/ThemedDropdown";
import { CheckBox } from "../Themed/CheckBox/CheckBox";
import { measurementTypes } from "../App/measurements/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AnimatedView } from "../Themed/AnimatedView/AnimatedView";

import { getLanguage, getThemeKey } from "../../store/reducers/settings/settingsSelectors";
import { getDatesFromCurrentMeasurement, getEditedMeasurementData } from "../../store/reducers/measurements/measurementSelectors";
import { IsoDate } from "../../types/date";
import { mutateEditedMeasurement, saveInspectedMeasurement } from "../../store/reducers/measurements";

interface MeasurementModalProps extends ThemedBottomSheetModalProps {
    reference: RefObject<BottomSheetModal>;
}

const MEASUREMENT_KEY_PREFIX = "measurement_type_";

const useMeasurementOptions = () => {
    const { t } = useTranslation();
    return measurementTypes.map((type) => t(MEASUREMENT_KEY_PREFIX + type));
};
const useDropdownValue = () => {
    const { t } = useTranslation();
    const type = useAppSelector(getEditedMeasurementData)?.measurement.type;
    return type && t(MEASUREMENT_KEY_PREFIX + type.toLowerCase());
};
export const MeasurementModal = ({ onRequestClose, reference }: MeasurementModalProps) => {
    const themeKey = useAppSelector(getThemeKey);
    const dates = useAppSelector(getDatesFromCurrentMeasurement);
    const language = useAppSelector(getLanguage);

    const [showWarning, setShowWarnining] = useState(false);
    const [date, setDate] = useState(new Date(dates ? dates[dates.length - 1] : getDateTodayIso()));
    const dispatch = useAppDispatch();
    const { mainColor, warningColor } = useTheme();
    const { t } = useTranslation();
    const dropdownValue = useDropdownValue();
    const measurementOptions = useMeasurementOptions();
    const inspectedMeasurement = useAppSelector(getEditedMeasurementData);

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
            dispatch(mutateEditedMeasurement({ key: "type", value: type }));
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
        if (!inspectedMeasurement?.isNew) {
            return t("measurement_add_existing");
        }
        if (showWarning) {
            return t("measurement_warning_confirm");
        }
        return t("measurement_add");
    }, [inspectedMeasurement?.isNew, showWarning, t]);

    const handleSaveMeasurement = useCallback(() => {
        if (!showWarning && date && dates?.includes(date?.toISOString().split("T")[0] as IsoDate)) {
            setShowWarnining(true);
            return;
        }
        setShowWarnining(false);
        dispatch(saveInspectedMeasurement());
    }, [showWarning, date, dates, dispatch]);

    if (!inspectedMeasurement) {
        return null;
    }

    const { value, name, higherIsBetter } = inspectedMeasurement.measurement;

    return (
        <ThemedBottomSheetModal onRequestClose={onRequestClose} title={measurementButtonText} snapPoints={["100%"]} ref={reference}>
            <AnimatedView ghost style={styles.outerWrapper}>
                <ThemedTextInput
                    maxLength={20}
                    bottomSheet
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
                        bottomSheet
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
                        isSelectable={inspectedMeasurement.isNew}
                        options={measurementOptions}
                        errorKey="measurement_type"
                        value={dropdownValue}
                        placeholderTranslationKey="measurement_type"
                        onSelectItem={handleSetMeasurementType}
                    />
                </HStack>
                <CheckBox
                    label={t("measurement_higher_is_better")}
                    helpText={t("measurement_higher_is_better_help")}
                    checked={higherIsBetter ?? false}
                    size={26}
                    onChecked={handleSelectHigherIsBetter}
                />
                <DateTimePicker
                    display="inline"
                    maximumDate={new Date(getDateTodayIso())}
                    locale={language}
                    accentColor={mainColor}
                    themeVariant={themeKey}
                    style={styles.calendar}
                    onChange={(_, date) => setDate(date ?? new Date(getDateTodayIso()))}
                    value={date}
                />
                {showWarning && (
                    <HStack style={styles.warningWrapper}>
                        <ThemedMaterialCommunityIcons ghost name="alert-circle-outline" size={20} color={warningColor} />
                        <Text warning style={styles.warningText}>
                            {t(`measurement_warning_text`)}
                        </Text>
                    </HStack>
                )}
                <Pressable style={styles.pressable} onPress={handleSaveMeasurement}>
                    <HStack input style={styles.addWrapper}>
                        <Text ghost style={styles.addMeasurement}>
                            {measurementButtonText}
                        </Text>
                        <ThemedMaterialCommunityIcons ghost name={!inspectedMeasurement.isNew ? "table-check" : "table-large-plus"} size={20} />
                    </HStack>
                </Pressable>
            </AnimatedView>
        </ThemedBottomSheetModal>
    );
};
