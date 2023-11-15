import { useCallback, useRef, useState } from "react";
import { ThemedButtomSheetModal, useBottomSheetRef } from "../../BottomSheetModal/ThemedButtomSheetModal";
import { Pressable, TextInput } from "react-native";
import { HStack } from "../../Stack/HStack/HStack";
import { VStack } from "../../Stack/VStack/VStack";
import { ThemedTextInput } from "../../Themed/ThemedTextInput/ThemedTextInput";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../theme/context";
import { styles } from "./styles";
import { Text } from "../../Themed/ThemedText/Text";

interface EditNoteModalProps {
  note?: string;
  onDoneEdit?: (note?: string) => void;
  onCancel: () => void;
}
export const EditNoteModal = ({ note, onDoneEdit, onCancel }: EditNoteModalProps) => {
  const [internalNote, setInternalNote] = useState(note);
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();
  const { secondaryColor } = useTheme();
  const [ref] = useBottomSheetRef();

  const handleSetNote = useCallback((note: string) => {
    setInternalNote(note);
  }, []);

  const handlePressDone = useCallback(() => {
    onDoneEdit?.(internalNote);
  }, [internalNote, onDoneEdit]);

  return (
    <ThemedButtomSheetModal title={t("edit_note_title")} onRequestClose={onCancel} ref={ref}>
      <VStack background style={styles.wrapper}>
        <ThemedTextInput
          autoFocus
          style={styles.textInput}
          multiline={true}
          reference={inputRef}
          onChangeText={handleSetNote}
          value={internalNote}
          placeholderTextColor={secondaryColor}
          placeholder={t("edit_note_placeholder")}
        />
        <HStack style={styles.stack}>
          <Pressable style={styles.pressable} onPress={handlePressDone}>
            <Text>{t("edit_note_done")}</Text>
          </Pressable>
        </HStack>
      </VStack>
    </ThemedButtomSheetModal>
  );
};
