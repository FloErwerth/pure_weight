import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "../../Modal/Modal";
import {TextInput, View} from "react-native";

interface EditNoteModalProps {
  showModal: boolean;
  note?: string;
  onDoneEdit: (note?: string) => void;
  onCancel: () => void;
}
export const EditNoteModal = ({ showModal, note, onDoneEdit, onCancel }: EditNoteModalProps) => {
  const [internalNote, setInternalNote] = useState(note);
  const inputRef = useRef<TextInput>(null);

  const handleSetNote = useCallback((note: string) => {
    setInternalNote(note);
  }, []);

  const handlePressDone = useCallback(() => {
    onDoneEdit(internalNote);
  }, [internalNote, onDoneEdit]);

  useEffect(() => {
    if (showModal) {
      inputRef.current?.focus();
    }
  }, [showModal]);

  return (
    <Modal isVisible={showModal}>
      <View >
        <TextInput multiline={true} ref={inputRef} onChangeText={handleSetNote} value={internalNote} placeholder="Add your notes here..." />
      </View>
    </Modal>
  );
};
