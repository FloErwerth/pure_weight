import { Pressable } from "react-native";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedBottomSheetModalProps, ThemedButtomSheetModal } from "../BottomSheetModal/ThemedButtomSheetModal";
import { Dispatch, RefObject, SetStateAction, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDateTodayIso } from "../../utils/date";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { styles } from "./styles";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import { ThemedDropdown } from "../Themed/Dropdown/ThemedDropdown";
import { CheckBox } from "../Themed/CheckBox/CheckBox";
import { Measurement, MeasurementType, measurementTypes } from "../App/measurements/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AnimatedView } from "../Themed/AnimatedView/AnimatedView";
import { cleanError, ErrorFields, setError } from "../../store/reducers/errors";

import { getLanguage, getThemeKey } from "../../store/reducers/settings/settingsSelectors";
import { getDatesFromCurrentMeasurement } from "../../store/reducers/measurements/measurementSelectors";

interface MeasurementModalProps extends ThemedBottomSheetModalProps {
    setCurrentMeasurement: Dispatch<SetStateAction<{ measurement: Measurement; index?: number }>>;
    currentMeasurement: { measurement: Measurement; index?: number };
    saveMeasurement: () => void;
    isNewMeasurement?: boolean;
    isEditingMeasurement?: boolean;
    reference: RefObject<BottomSheetModal>;
}

const fieldToErrorMap: Record<keyof Omit<Measurement, "higherIsBetter" | "data">, ErrorFields> = {
    type: "measurement_type",
    value: "measurement_value",
    name: "measurement_name",
    date: "measurement_value",
};

const MEASUREMENT_KEY_PREFIX = "measurement_type_";

const useMeasurementOptions = () => {
    const { t } = useTranslation();
    return measurementTypes.map((type) => t(MEASUREMENT_KEY_PREFIX + type));
};
const useDropdownValue = (type?: MeasurementType) => {
    const { t } = useTranslation();
    return type && t(MEASUREMENT_KEY_PREFIX + type.toLowerCase());
};
export const MeasurementModal = ({ onRequestClose, reference, isNewMeasurement = true, currentMeasurement: { measurement, index }, setCurrentMeasurement, saveMeasurement }: MeasurementModalProps) => {
    const { t } = useTranslation();
    const { mainColor, warningColor } = useTheme();
    const themeKey = useAppSelector(getThemeKey);
    const dates = useAppSelector((state: AppState) => getDatesFromCurrentMeasurement(state)(measurement?.name));
    const language = useAppSelector(getLanguage);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showWarning, setShowWarnining] = useState(false);
    const dispatch = useAppDispatch();
    const measurementOptions = useMeasurementOptions();
    const dropdownValue = useDropdownValue(measurement.type);

    const handleAddMeasurementData = useCallback(
        (field: keyof Measurement, value: Measurement[keyof Measurement]) => {
            const newValue = field === "type" ? (value as string).replace(MEASUREMENT_KEY_PREFIX, "") : value;
            const newMeasurement: Measurement = { ...measurement, [field]: newValue };
            if (field !== "higherIsBetter" && field !== "data") {
                dispatch(cleanError([fieldToErrorMap[field]]));
            }
            setCurrentMeasurement({ measurement: newMeasurement, index });
        },
        [dispatch, index, measurement, setCurrentMeasurement],
    );

    const measurementButtonText = useMemo(() => {
        if (!isNewMeasurement) {
            return t("measurement_add_existing");
        }
        if (showWarning) {
            return t("measurement_warning_confirm");
        }
        return t("measurement_add");
    }, [isNewMeasurement, showWarning, t]);

    const collectErrors = useCallback(() => {
        const errors: ErrorFields[] = [];
        if (!measurement?.name || !measurement?.type || !measurement?.value) {
            if (!measurement?.name) {
                errors.push("measurement_name");
            }
            if (!measurement?.type) {
                errors.push("measurement_type");
            }
        }
        return errors;
    }, [measurement?.name, measurement?.type, measurement?.value]);

    const handleSaveMeasurement = useCallback(() => {
        const errors = collectErrors();
        if (errors.length > 0) {
            dispatch(setError(errors));
            return;
        }
        if (!showWarning && measurement?.date && dates?.includes(measurement?.date?.toISOString().split("T")[0])) {
            setShowWarnining(true);
            return;
        }
        setShowWarnining(false);
        saveMeasurement();
    }, [collectErrors, dates, dispatch, measurement?.date, saveMeasurement, showWarning]);

    return (
        <ThemedButtomSheetModal onRequestClose={onRequestClose} title={measurementButtonText} snapPoints={["100%"]} ref={reference}>
            <AnimatedView ghost style={styles.outerWrapper}>
                <ThemedTextInput
                    maxLength={20}
                    bottomSheet
                    errorKey="measurement_name"
                    style={styles.textInput}
                    onChangeText={(value) => handleAddMeasurementData("name", value)}
                    value={measurement?.name}
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
                        onChangeText={(value) => handleAddMeasurementData("value", value)}
                        value={measurement?.value}
                        clearButtonMode="while-editing"
                        placeholder={t("measurement")}
                    />
                    <ThemedDropdown
                        isSelectable={isNewMeasurement}
                        options={measurementOptions}
                        errorKey="measurement_type"
                        value={dropdownValue}
                        placeholderTranslationKey="measurement_type"
                        onSelectItem={(value) => handleAddMeasurementData("type", value)}
                    />
                </HStack>
                <CheckBox
                    label={t("measurement_higher_is_better")}
                    helpText={t("measurement_higher_is_better_help")}
                    checked={measurement.higherIsBetter ?? false}
                    size={26}
                    onChecked={(val) => handleAddMeasurementData("higherIsBetter", val)}
                />
                <HStack ghost style={styles.calendarButtonsWrapper}>
                    <ThemedPressable input stretch style={styles.dateWrapper} onPress={() => setShowDatePicker((open) => !open)}>
                        <Text ghost style={styles.text}>
                            {measurement?.date?.toLocaleDateString(language)}
                        </Text>
                    </ThemedPressable>
                    <ThemedPressable input onPress={() => setShowDatePicker((open) => !open)} style={styles.calendarWrapper}>
                        <ThemedMaterialCommunityIcons ghost name="calendar" size={26} />
                    </ThemedPressable>
                </HStack>
                {showDatePicker && (
                    <Animated.View layout={Layout} entering={FadeIn} style={styles.dateWrapper}>
                        <DateTimePicker
                            display="inline"
                            mode={"date"}
                            maximumDate={new Date(getDateTodayIso())}
                            locale={language}
                            accentColor={mainColor}
                            themeVariant={themeKey}
                            style={styles.calendar}
                            onChange={(_, date) => handleAddMeasurementData("date", date)}
                            value={measurement?.date ?? new Date(getDateTodayIso())}
                        />
                    </Animated.View>
                )}
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
                        <ThemedMaterialCommunityIcons ghost name={!isNewMeasurement ? "table-check" : "table-large-plus"} size={20} />
                    </HStack>
                </Pressable>
            </AnimatedView>
        </ThemedButtomSheetModal>
    );
};
