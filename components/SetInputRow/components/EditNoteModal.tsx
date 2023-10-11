import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "../../Modal/Modal";
import { TextInput } from "react-native";
import { Button } from "../../Button/Button";
import { HStack } from "../../HStack/HStack";
import { VStack } from "../../VStack/VStack";

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
    <Modal isVisible={showModal}>
      <VStack style={{ backgroundColor: "white", borderRadius: 10, gap: 15, padding: 10 }}>
        <TextInput
          style={{ borderWidth: 1, padding: 10, borderColor: "black", borderRadius: 5 }}
          numberOfLines={5}
          ref={inputRef}
          onChangeText={handleSetNote}
          value={internalNote}
          placeholderTextColor="grey"
          placeholder="Add your note here..."
        />
        <HStack style={{ gap: 20 }}>
          <Button theme="secondary" title={"cancel"} onPress={onCancel} />
          <Button title="done" onPress={handlePressDone} />
        </HStack>
      </VStack>
    </Modal>
  );
};
