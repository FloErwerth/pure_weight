import { useAppSelector } from "../../store";
import { getPreviousTraining } from "../../store/selectors";
import { Text } from "../Themed/ThemedText/Text";
import { Pressable, View } from "react-native";
import { borderRadius } from "../../theme/border";
import { VStack } from "../VStack/VStack";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/context";
import { useCallback, useMemo } from "react";
import { HStack } from "../HStack/HStack";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedView } from "../Themed/ThemedView/View";
import { ThemedButtomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedButtomSheetModal";

interface PreviousTrainingProps {
  exerciseIndex: number;
  activeSetIndex: number;
}
export const PreviousTraining = ({ exerciseIndex, activeSetIndex }: PreviousTrainingProps) => {
  const getPreviousTrainingFn = useAppSelector(getPreviousTraining);
  const receivedPreviousTraining = useMemo(() => getPreviousTrainingFn(exerciseIndex), [exerciseIndex, getPreviousTrainingFn]);
  const { t } = useTranslation();
  const { textDisabled, componentBackgroundColor, mainColor, secondaryColor, inputFieldBackgroundColor } = useTheme();
  const ref = useBottomSheetRef();
  const mappedData = useMemo(
    () =>
      receivedPreviousTraining?.vals.map(({ weight, reps }, index) => {
        const highlight = activeSetIndex === index;
        const filled = activeSetIndex > index;
        const highlightWrapperStyles = { backgroundColor: highlight ? inputFieldBackgroundColor : "transparent" };
        const computedColor = highlight || filled ? mainColor : secondaryColor;
        return (
          <HStack key={Math.random() * 102} style={[styles.innerWrapper, highlightWrapperStyles]}>
            <Text style={[styles.setDisplayStyle, { color: computedColor }]}>{index + 1}</Text>
            <Text style={[{ color: computedColor }, styles.set]}>{weight}</Text>
            <Text style={[{ color: computedColor }, styles.set]}>{reps}</Text>
          </HStack>
        );
      }),
    [activeSetIndex, inputFieldBackgroundColor, mainColor, receivedPreviousTraining?.vals, secondaryColor],
  );

  const handleShowEditNoteModal = useCallback(() => {
    ref.current?.present();
  }, [ref]);

  const handleCloseNote = useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);

  if (!receivedPreviousTraining) {
    return null;
  }

  const { date, vals, note } = receivedPreviousTraining;
  if (!vals || vals?.length === 0 || vals?.some((val) => val === undefined)) {
    return null;
  }

  return (
    <View>
      <HStack style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: textDisabled, padding: note ? 0 : 10 }}>
          {t("previous_training_title_with_date")}
          {date}
        </Text>
        {note && (
          <ThemedView>
            <Pressable onPress={handleShowEditNoteModal}>
              <HStack style={styles.noteButtonWrapper}>
                <Text>Show note</Text>
                <MaterialCommunityIcons name="note-text-outline" color={mainColor} size={20} />
              </HStack>
            </Pressable>
          </ThemedView>
        )}
      </HStack>
      <View style={{ padding: 10, borderRadius, backgroundColor: componentBackgroundColor }}>
        {vals?.length > 0 && (
          <VStack style={{ backgroundColor: componentBackgroundColor }}>
            <HStack style={styles.innerWrapper}>
              <Text style={[styles.setDisplayStyle, { color: secondaryColor }]}>{"#"}</Text>
              <Text style={[{ color: secondaryColor }, styles.set]}>{t("training_header_weight")}</Text>
              <Text style={[{ color: secondaryColor }, styles.set]}>{t("training_header_reps")}</Text>
            </HStack>
            {mappedData}
          </VStack>
        )}
      </View>
      <ThemedButtomSheetModal title={`Your note from ${date}`} onRequestClose={handleCloseNote} ref={ref}>
        <Text style={{ fontSize: 20 }}>{note}</Text>
      </ThemedButtomSheetModal>
    </View>
  );
};
