import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "../../Modal/Modal";
import { TextInput } from "react-native";
import { Button } from "../../Button/Button";
import { HStack } from "../../HStack/HStack";
import { VStack } from "../../VStack/VStack";
import { borderRadius } from "../../App/theme/border";
import { backgroundColor, secondaryColor } from "../../App/theme/colors";
import { ThemedTextInput } from "../../TextInput/ThemedTextInput";
import { useTranslation } from "react-i18next";

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
    <Modal title={t("edit_note_title")} isVisible={showModal} onRequestClose={onCancel}>
      <VStack style={{ backgroundColor, borderRadius, gap: 15 }}>
        <ThemedTextInput
          style={{ height: 140, padding: 10, borderRadius }}
          multiline={true}
          ref={inputRef}
          onChangeText={handleSetNote}
          value={internalNote}
          placeholderTextColor={secondaryColor}
          placeholder={t("edit_note_placeholder")}
        />
        <HStack style={{ justifyContent: "flex-end" }}>
          <Button style={{ singleButton: { width: 100 } }} title={t("edit_note_done")} onPress={handlePressDone} />
        </HStack>
      </VStack>
    </Modal>
  );
};
