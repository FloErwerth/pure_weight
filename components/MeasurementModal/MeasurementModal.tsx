import { Pressable, View } from "react-native";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { HStack } from "../HStack/HStack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, ModalProps } from "../Modal/Modal";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Measurement } from "../../app/measurements";
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

interface MeasurementModalProps extends ModalProps {
  setMeasurement: Dispatch<SetStateAction<Measurement>>;
  measurement?: Measurement;
  saveMeasurement: () => void;
  isNewMeasurement?: boolean;
}
const fieldToErrorMap: Record<keyof Measurement, ErrorFields> = {
  unit: "measurement_unit",
  value: "measurement_value",
  name: "measurement_name",
  date: "measurement_value",
};

export const MeasurementModal = ({ isNewMeasurement = true, onRequestClose, isVisible, measurement, setMeasurement, saveMeasurement }: MeasurementModalProps) => {
  const { t } = useTranslation();
  const { mainColor, componentBackgroundColor, warningColor } = useTheme();
  const themeKey = useAppSelector(getThemeKey);

  const dates = useAppSelector((state: AppState) => getDatesFromCurrentMeasurement(state)(measurement?.name));
  const language = useAppSelector(getLanguage);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWarning, setShowWarnining] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddMeasurementData = useCallback(
    (field: keyof Measurement, value: Measurement[keyof Measurement]) => {
      const newMeasurement = { ...measurement, [field]: value };
      dispatch(cleanError([fieldToErrorMap[field]]));
      setMeasurement(newMeasurement);
    },
    [dispatch, measurement, setMeasurement],
  );

  const collectErrors = useCallback(() => {
    const errors: ErrorFields[] = [];
    if (!measurement?.name || !measurement?.unit || !measurement?.value) {
      if (!measurement?.name) {
        errors.push("measurement_name");
      }
      if (!measurement?.value) {
        errors.push("measurement_value");
      }
      if (!measurement?.unit) {
        errors.push("measurement_unit");
      }
    }
    return errors;
  }, [measurement?.name, measurement?.unit, measurement?.value]);

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
    <Modal onRequestClose={onRequestClose} isVisible={isVisible}>
      <Animated.View style={styles.outerWrapper}>
        <ThemedTextInput
          errorKey="measurement_name"
          editable={isNewMeasurement}
          style={styles.textInput}
          onChangeText={(value) => handleAddMeasurementData("name", value)}
          value={measurement?.name}
          clearButtonMode="while-editing"
          placeholder={t("measurement_placeholder")}
        />
        <HStack style={{ alignSelf: "stretch" }}>
          <ThemedTextInput
            stretch
            errorKey="measurement_value"
            returnKeyType="done"
            keyboardType="decimal-pad"
            style={styles.textInput}
            onChangeText={(value) => handleAddMeasurementData("value", value)}
            value={measurement?.value}
            clearButtonMode="while-editing"
            placeholder={t("measurement")}
          />
          <ThemedTextInput
            stretch
            errorKey="measurement_unit"
            editable={isNewMeasurement}
            style={styles.textInput}
            onChangeText={(value) => handleAddMeasurementData("unit", value)}
            value={measurement?.unit}
            clearButtonMode="while-editing"
            placeholder={t("measurement_unit")}
          />
        </HStack>
        <HStack style={styles.calendarButtonsWrapper}>
          <ThemedPressable stretch style={styles.dateWrapper} onPress={() => setShowDatePicker((open) => !open)}>
            <Text style={styles.text}>{measurement?.date?.toLocaleDateString(language)}</Text>
          </ThemedPressable>
          <ThemedPressable onPress={() => setShowDatePicker((open) => !open)} style={styles.calendarWrapper}>
            <MaterialCommunityIcons name="calendar" size={26} color={mainColor} />
          </ThemedPressable>
        </HStack>
        {showDatePicker && (
          <Animated.View layout={Layout} entering={FadeIn} style={styles.dateWrapper}>
            <DateTimePicker
              display="inline"
              mode={"date"}
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
          <View style={styles.warningWrapper}>
            <Text warning style={styles.warningText}>
              {t("measurement_warning_text")}
            </Text>
          </View>
        )}
        <Pressable onPress={handleSaveMeasurement}>
          <HStack component style={styles.addWrapper}>
            <Text style={styles.addMeasurement}>{t(showWarning ? "measurement_warning_confirm" : "measurement_add")}</Text>
            <ThemedMaterialCommunityIcons name="table-large-plus" size={20} />
          </HStack>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};
