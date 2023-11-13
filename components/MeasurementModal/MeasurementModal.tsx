import { Pressable } from "react-native";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedBottomSheetModalProps, ThemedButtomSheetModal } from "../BottomSheetModal/ThemedButtomSheetModal";
import { Dispatch, RefObject, SetStateAction, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDateTodayIso } from "../../utils/date";
import { useAppDispatch, useAppSelector } from "../../store";
import { getDatesFromCurrentMeasurement, getLanguage, getThemeKey } from "../../store/selectors";
import { Text } from "../Themed/ThemedText/Text";
import { AppState, ErrorFields } from "../../store/types";
import { cleanError, setError } from "../../store/reducer";
import { useTheme } from "../../theme/context";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { styles } from "./styles";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import { ThemedDropdown } from "../Themed/Dropdown/ThemedDropdown";
import { CheckBox } from "../Themed/CheckBox/CheckBox";
import { getMeasurementUnits, Measurement } from "../App/measurements/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AnimatedView } from "../Themed/AnimatedView/AnimatedView";

interface MeasurementModalProps extends ThemedBottomSheetModalProps {
  setCurrentMeasurement: Dispatch<SetStateAction<{ measurement: Measurement; index?: number }>>;
  currentMeasurement: { measurement: Measurement; index?: number };
  saveMeasurement: () => void;
  isNewMeasurement?: boolean;
  isEditingMeasurement?: boolean;
  reference: RefObject<BottomSheetModal>;
}

const fieldToErrorMap: Record<keyof Omit<Measurement, "higherIsBetter" | "data">, ErrorFields> = {
  unit: "measurement_unit",
  value: "measurement_value",
  name: "measurement_name",
  date: "measurement_value",
};

export const MeasurementModal = ({
  reference,
  isNewMeasurement = true,
  currentMeasurement: { measurement, index },
  setCurrentMeasurement,
  saveMeasurement,
  isEditingMeasurement,
}: MeasurementModalProps) => {
  const { t } = useTranslation();
  const { mainColor, warningColor } = useTheme();
  const themeKey = useAppSelector(getThemeKey);
  const dates = useAppSelector((state: AppState) => getDatesFromCurrentMeasurement(state)(measurement?.name));
  const language = useAppSelector(getLanguage);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWarning, setShowWarnining] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddMeasurementData = useCallback(
    (field: keyof Measurement, value: Measurement[keyof Measurement]) => {
      const newMeasurement: Measurement = { ...measurement, [field]: value };
      if (field !== "higherIsBetter" && field !== "data") {
        dispatch(cleanError([fieldToErrorMap[field]]));
      }
      setCurrentMeasurement({ measurement: newMeasurement, index });
    },
    [dispatch, index, measurement, setCurrentMeasurement],
  );

  const measurementButtonText = useMemo(() => {
    if (isEditingMeasurement) {
      return t("measurement_edit_confirm");
    }
    if (showWarning) {
      return t("measurement_warning_confirm");
    }
    return t("measurement_add");
  }, [isEditingMeasurement, showWarning, t]);

  const collectErrors = useCallback(() => {
    const errors: ErrorFields[] = [];
    if (!measurement?.name || !measurement?.unit || !measurement?.value) {
      if (!measurement?.name) {
        errors.push("measurement_name");
      }
      if (!measurement?.value && !isEditingMeasurement) {
        errors.push("measurement_value");
      }
      if (!measurement?.unit) {
        errors.push("measurement_unit");
      }
    }
    return errors;
  }, [isEditingMeasurement, measurement?.name, measurement?.unit, measurement?.value]);

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

  const measurementUnits = useMemo(() => {
    if (isEditingMeasurement) {
      return getMeasurementUnits(measurement.unit);
    }
    return getMeasurementUnits();
  }, [isEditingMeasurement, measurement.unit]);

  const unitDropdownSelectable = Boolean((isNewMeasurement || isEditingMeasurement) && measurementUnits.length > 1);

  return (
    <ThemedButtomSheetModal title={t("measurement_add")} snapPoints={["100%"]} ref={reference}>
      <AnimatedView style={styles.outerWrapper}>
        <ThemedTextInput
          maxLength={20}
          errorKey="measurement_name"
          editable={isEditingMeasurement || isNewMeasurement}
          style={styles.textInput}
          onChangeText={(value) => handleAddMeasurementData("name", value)}
          value={measurement?.name}
          clearButtonMode="while-editing"
          placeholder={t("measurement_placeholder")}
        />
        <HStack ghost style={{ alignSelf: "stretch", gap: 10 }}>
          <ThemedTextInput
            stretch
            errorKey="measurement_value"
            returnKeyType="done"
            editable={!isEditingMeasurement}
            keyboardType="decimal-pad"
            style={styles.textInput}
            onChangeText={(value) => handleAddMeasurementData("value", value)}
            value={measurement?.value}
            clearButtonMode="while-editing"
            placeholder={t("measurement")}
          />
          <ThemedDropdown
            isSelectable={unitDropdownSelectable}
            options={measurementUnits}
            errorKey="measurement_unit"
            value={measurement?.unit}
            placeholderTranslationKey="measurement_unit"
            onSelectItem={(value) => handleAddMeasurementData("unit", value)}
          />
        </HStack>
        <CheckBox
          label={t("measurement_higher_is_better")}
          helpText={t("measurement_higher_is_better_help")}
          checked={measurement.higherIsBetter ?? false}
          size={26}
          onChecked={(val) => handleAddMeasurementData("higherIsBetter", val)}
        />
        {!isEditingMeasurement && (
          <HStack style={styles.calendarButtonsWrapper}>
            <ThemedPressable input stretch style={styles.dateWrapper} onPress={() => setShowDatePicker((open) => !open)}>
              <Text ghost style={styles.text}>
                {measurement?.date?.toLocaleDateString(language)}
              </Text>
            </ThemedPressable>
            <ThemedPressable input onPress={() => setShowDatePicker((open) => !open)} style={styles.calendarWrapper}>
              <ThemedMaterialCommunityIcons ghost name="calendar" size={26} />
            </ThemedPressable>
          </HStack>
        )}
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
              removeClippedSubviews={true}
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
            <ThemedMaterialCommunityIcons ghost name={isEditingMeasurement ? "table-check" : "table-large-plus"} size={20} />
          </HStack>
        </Pressable>
      </AnimatedView>
    </ThemedButtomSheetModal>
  );
};
