import { RefObject, useCallback, useContext, useMemo, useRef } from "react";
import { TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemedButtomSheetModal } from "../BottomSheetModal/ThemedButtomSheetModal";
import { VStack } from "../Stack/VStack/VStack";
import { HStack } from "../Stack/HStack/HStack";
import { Button } from "../Themed/Button/Button";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { workoutContext } from "../App/train/workoutContext";
import { styles } from "./styles";

interface EditNoteModalProps {
  onRequestClose: () => void;
  reference: RefObject<BottomSheetModal>;
  index: number;
}

export const AddNoteModal = ({ reference, onRequestClose, index }: EditNoteModalProps) => {
  const { doneSetsThisExercise, handleSaveNote } = useContext(workoutContext);
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();
  const note = doneSetsThisExercise.get(index)?.note;

  const handleInput = useCallback(
    (note: string | undefined) => {
      handleSaveNote(index, note);
    },
    [handleSaveNote, index],
  );

  const buttonStyle = useMemo(() => ({ button: styles.button }), [styles.button]);

  return (
    <ThemedButtomSheetModal onRequestClose={onRequestClose} ref={reference} title={t("edit_note_title")}>
      <VStack component style={styles.wrapper}>
        <ThemedTextInput bottomSheet={true} returnKeyType="done" autoFocus style={styles.input} reference={inputRef} onChangeText={handleInput} value={note} placeholder={t("edit_note_placeholder")} />
        <HStack style={styles.buttonWrapper}>
          <Button style={buttonStyle} title={t("edit_note_done")} onPress={onRequestClose} />
        </HStack>
      </VStack>
    </ThemedButtomSheetModal>
  );
};
