import { RefObject, useCallback, useRef } from "react";
import { Keyboard, NativeSyntheticEvent, TextInput, TextInputTextInputEventData } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemedBottomSheetModal } from "../BottomSheetModal/ThemedBottomSheetModal";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { styles } from "./styles";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { Text } from "../Themed/ThemedText/Text";
import { useAppDispatch, useAppSelector } from "../../store";
import { getNote } from "../../store/reducers/workout/workoutSelectors";
import { ThemedView } from "../Themed/ThemedView/View";
import { saveNote } from "../../store/reducers/workout";

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
        (e: NativeSyntheticEvent<TextInputTextInputEventData>) => {
            const newText = e.nativeEvent.text ? e.nativeEvent.previousText.concat(e.nativeEvent.text) : e.nativeEvent.previousText.slice(0, -1);
            dispatch(saveNote(newText));
        },
        [dispatch],
    );

    const handleRequestClose = useCallback(() => {
        Keyboard.dismiss();
        onRequestClose();
    }, [onRequestClose]);

    return (
        <ThemedBottomSheetModal snapPoints={["100%"]} ref={reference} title={t("edit_note_title")}>
            <ThemedView stretch style={styles.wrapper}>
                <ThemedTextInput
                    ghost
                    returnKeyType="done"
                    blurOnSubmit
                    style={styles.input}
                    multiline
                    reference={inputRef}
                    onTextInput={handleInput}
                    value={storedNote}
                    placeholder={t("edit_note_placeholder")}
                />
            </ThemedView>
            <ThemedPressable padding round style={styles.button} onPress={handleRequestClose}>
                <Text style={styles.buttonText} ghost>
                    {t("edit_note_done")}
                </Text>
            </ThemedPressable>
        </ThemedBottomSheetModal>
    );
};
