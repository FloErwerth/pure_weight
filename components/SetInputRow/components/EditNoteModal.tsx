import { useCallback, useEffect, useRef, useState } from "react";
import { ThemedButtomSheetModal, useBottomSheetRef } from "../../BottomSheetModal/ThemedButtomSheetModal";
import { TextInput } from "react-native";
import { Button } from "../../Themed/Button/Button";
import { HStack } from "../../Stack/HStack/HStack";
import { VStack } from "../../Stack/VStack/VStack";
import { borderRadius } from "../../../theme/border";
import { ThemedTextInput } from "../../Themed/ThemedTextInput/ThemedTextInput";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../theme/context";

interface EditNoteModalProps {
  showModal: boolean;
  note?: string;
  onDoneEdit?: (note?: string) => void;
  onCancel: () => void;
}
export const EditNoteModal = ({ showModal, note, onDoneEdit, onCancel }: EditNoteModalProps) => {
  const [internalNote, setInternalNote] = useState(note);
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();
  const { backgroundColor, secondaryColor } = useTheme();
  const ref = useBottomSheetRef();

  const handleSetNote = useCallback((note: string) => {
    setInternalNote(note);
  }, []);

  const handlePressDone = useCallback(() => {
    onDoneEdit?.(internalNote);
  }, [internalNote, onDoneEdit]);

  useEffect(() => {
    if (showModal) {
      inputRef.current?.focus();
    }
  }, [showModal]);

  return (
    <ThemedButtomSheetModal title={t("edit_note_title")} onRequestClose={onCancel} ref={ref}>
      <VStack style={{ backgroundColor, borderRadius, gap: 15 }}>
        <ThemedTextInput
          style={{ height: 140, padding: 10, borderRadius }}
          multiline={true}
          reference={inputRef}
          onChangeText={handleSetNote}
          value={internalNote}
          placeholderTextColor={secondaryColor}
          placeholder={t("edit_note_placeholder")}
        />
        <HStack style={{ justifyContent: "flex-end" }}>
          <Button style={{ button: { width: 100 } }} title={t("edit_note_done")} onPress={handlePressDone} />
        </HStack>
      </VStack>
    </ThemedButtomSheetModal>
  );
};
