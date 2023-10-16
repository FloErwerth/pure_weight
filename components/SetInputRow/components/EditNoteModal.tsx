import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "../../Modal/Modal";
import { TextInput } from "react-native";
import { Button } from "../../Button/Button";
import { HStack } from "../../HStack/HStack";
import { VStack } from "../../VStack/VStack";
import { borderRadius } from "../../../app/theme/border";
import { backgroundColor, secondaryColor } from "../../../app/theme/colors";
import { ThemedTextInput } from "../../TextInput/ThemedTextInput";

interface EditNoteModalProps {
  showModal: boolean;
  note?: string;
  onDoneEdit?: (note?: string) => void;
  onCancel: () => void;
}
export const EditNoteModal = ({ showModal, note, onDoneEdit, onCancel }: EditNoteModalProps) => {
  const [internalNote, setInternalNote] = useState(note);
  const inputRef = useRef<TextInput>(null);

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
    <Modal isVisible={showModal} onRequestClose={onCancel}>
      <VStack style={{ backgroundColor, borderRadius, gap: 15 }}>
        <ThemedTextInput
          style={{ height: 140, padding: 10, borderRadius }}
          multiline={true}
          ref={inputRef}
          onChangeText={handleSetNote}
          value={internalNote}
          placeholderTextColor={secondaryColor}
          placeholder="Add your note here..."
        />
        <HStack style={{ justifyContent: "flex-end" }}>
          <Button style={{ button: { width: 100 } }} title="done" onPress={handlePressDone} />
        </HStack>
      </VStack>
    </Modal>
  );
};
