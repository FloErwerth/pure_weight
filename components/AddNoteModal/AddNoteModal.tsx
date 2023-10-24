import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { Modal } from "../Modal/Modal";
import { VStack } from "../VStack/VStack";
import { backgroundColor, secondaryColor } from "../App/theme/colors";
import { borderRadius } from "../App/theme/border";
import { ThemedTextInput } from "../TextInput/ThemedTextInput";
import { HStack } from "../HStack/HStack";
import { Button } from "../Button/Button";

interface EditNoteModalProps {
  showModal: boolean;
  setNote: Dispatch<SetStateAction<string | undefined>>;
  onCancel: () => void;
  onConfirm: () => void;
  note?: string;
}
export const AddNoteModal = ({ showModal, setNote, note, onCancel, onConfirm }: EditNoteModalProps) => {
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();

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
          onChangeText={setNote}
          value={note}
          placeholderTextColor={secondaryColor}
          placeholder={t("edit_note_placeholder")}
        />
        <HStack style={{ justifyContent: "flex-end" }}>
          <Button style={{ button: { width: 100 } }} title={t("edit_note_done")} onPress={onConfirm} />
        </HStack>
      </VStack>
    </Modal>
  );
};
