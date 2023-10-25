import { Animated, LayoutAnimation, Pressable, View } from "react-native";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { borderRadius } from "../../theme/border";
import { HStack } from "../HStack/HStack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, ModalProps } from "../Modal/Modal";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Measurement } from "../../app/profile/measurements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDateTodayIso } from "../../utils/date";
import { useAppDispatch, useAppSelector } from "../../store";
import { getDatesFromCurrentMeasurement, getLanguage, getThemeKey } from "../../store/selectors";
import { Text } from "../Themed/ThemedText/Text";
import { AppState, ErrorFields } from "../../store/types";
import { cleanError, setError } from "../../store/reducer";
import { useTheme } from "../../theme/context";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";

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
  const opacity = useRef(new Animated.Value(0)).current;
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

  useEffect(() => {
    if (isVisible) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Animated.timing(opacity, {
        toValue: showDatePicker ? 1 : 0,
        duration: showDatePicker ? 300 : 150,
        delay: showDatePicker ? 200 : 150,
        useNativeDriver: false,
      }).start();
    }
  }, [showWarning, isVisible, opacity, showDatePicker]);

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
      <View style={{ gap: 10, marginTop: 10 }}>
        <ThemedTextInput
          errorKey="measurement_name"
          editable={isNewMeasurement}
          style={{ fontSize: 20, borderRadius, padding: 10 }}
          onChangeText={(value) => handleAddMeasurementData("name", value)}
          value={measurement?.name}
          clearButtonMode="while-editing"
          placeholder={t("measurement_placeholder")}
        />
        <HStack style={{ alignSelf: "stretch" }}>
          <ThemedTextInput
            errorKey="measurement_value"
            returnKeyType="done"
            keyboardType="decimal-pad"
            style={{
              flex: 1,
              fontSize: 20,
              borderRadius,
              padding: 10,
            }}
            onChangeText={(value) => handleAddMeasurementData("value", value)}
            value={measurement?.value}
            clearButtonMode="while-editing"
            placeholder={t("measurement")}
          />
          <ThemedTextInput
            errorKey="measurement_unit"
            editable={isNewMeasurement}
            style={{ flex: 1, fontSize: 20, borderRadius, padding: 10 }}
            onChangeText={(value) => handleAddMeasurementData("unit", value)}
            value={measurement?.unit}
            clearButtonMode="while-editing"
            placeholder={t("measurement_unit")}
          />
        </HStack>
        <HStack style={{ gap: 10, paddingHorizontal: 10 }}>
          <Pressable style={{ backgroundColor: componentBackgroundColor, borderRadius, flex: 1, padding: 10 }} onPress={() => setShowDatePicker((open) => !open)}>
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                color: mainColor,
              }}
            >
              {measurement?.date?.toLocaleDateString(language)}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowDatePicker((open) => !open)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              backgroundColor: componentBackgroundColor,
              borderRadius,
            }}
          >
            <MaterialCommunityIcons name="calendar" size={26} color={mainColor} />
          </Pressable>
        </HStack>
        {showDatePicker && (
          <Animated.View style={{ opacity, paddingHorizontal: 10, borderRadius }}>
            <DateTimePicker
              display="inline"
              mode={"date"}
              locale={language}
              accentColor={mainColor}
              themeVariant={themeKey}
              style={{ borderColor: mainColor, borderWidth: 1, borderRadius, overflow: "hidden" }}
              onChange={(_, date) => handleAddMeasurementData("date", date)}
              removeClippedSubviews={true}
              value={measurement?.date ?? new Date(getDateTodayIso())}
            />
          </Animated.View>
        )}
        {showWarning && (
          <View style={{ padding: 10, paddingBottom: 0 }}>
            <Text style={{ fontSize: 16, color: warningColor }}>{t("measurement_warning_text")}</Text>
          </View>
        )}

        <Pressable onPress={handleSaveMeasurement}>
          <HStack
            style={{
              backgroundColor: componentBackgroundColor,
              borderRadius,
              padding: 10,
              margin: 10,
              gap: 15,
              justifyContent: "center",
            }}
          >
            <Text>{t(showWarning ? "measurement_warning_confirm" : "measurement_add")}</Text>
            <ThemedMaterialCommunityIcons name="table-large-plus" size={20} />
          </HStack>
        </Pressable>
      </View>
    </Modal>
  );
};
