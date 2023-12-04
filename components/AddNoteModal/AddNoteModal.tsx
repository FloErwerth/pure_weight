import { RefObject, useCallback, useRef } from "react";
import { Keyboard, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemedBottomSheetModal } from "../BottomSheetModal/ThemedBottomSheetModal";
import { VStack } from "../Stack/VStack/VStack";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { styles } from "./styles";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { Text } from "../Themed/ThemedText/Text";
import { saveNote } from "../../store/reducers/workout";
import { useAppDispatch, useAppSelector } from "../../store";
import { getNote } from "../../store/reducers/workout/workoutSelectors";

interface EditNoteModalProps {
    onRequestClose: () => void;
    reference: RefObject<BottomSheetModal>;
}

export const AddNoteModal = ({ reference, onRequestClose }: EditNoteModalProps) => {
    const inputRef = useRef<TextInput>(null);
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const storedNote = useAppSelector(getNote);

    const handleInput = useCallback(
        (note: string | undefined) => {
            dispatch(saveNote(note));
        },
        [dispatch],
    );

    const handleRequestClose = useCallback(() => {
        Keyboard.dismiss();
        onRequestClose();
    }, [onRequestClose]);

    return (
        <ThemedBottomSheetModal ref={reference} title={t("edit_note_title")}>
            <VStack style={styles.wrapper}>
                <ThemedTextInput
                    bottomSheet={true}
                    returnKeyType="done"
                    autoFocus
                    style={styles.input}
                    reference={inputRef}
                    onChangeText={handleInput}
                    value={storedNote}
                    placeholder={t("edit_note_placeholder")}
                />
                <HStack style={styles.buttonWrapper}>
                    <ThemedPressable input style={styles.button} onPress={handleRequestClose}>
                        <Text input>{t("edit_note_done")}</Text>
                    </ThemedPressable>
                </HStack>
            </VStack>
        </ThemedBottomSheetModal>
    );
};
