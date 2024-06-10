import { RefObject, useCallback, useMemo, useRef } from "react";
import { Keyboard, NativeSyntheticEvent, TextInput, TextInputTextInputEventData } from "react-native";
import { ThemedBottomSheetModal } from "../BottomSheetModal/ThemedBottomSheetModal";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { styles } from "./styles";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { Text } from "../Themed/ThemedText/Text";
import { useAppDispatch, useAppSelector } from "../../store";
import { getNote } from "../../store/selectors/workout/workoutSelectors";
import { ThemedView } from "../Themed/ThemedView/View";
import { saveNote } from "../../store/reducers/workout";
import * as Haptics from "expo-haptics";
import { SNAP_POINTS } from "../../constants/snapPoints";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";

interface EditNoteModalProps {
    onRequestClose: () => void;
    reference: RefObject<BottomSheetModal>;
}

export const AddNoteModal = ({ reference, onRequestClose }: EditNoteModalProps) => {
    const inputRef = useRef<TextInput>(null);
    const { t } = useTypedTranslation();
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
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, [onRequestClose]);

    const addNoteTitle = useMemo(() => t(TranslationKeys.EDIT_NOTE_TITLE), [t]);
    const addNotePlaceholder = useMemo(() => t(TranslationKeys.EDIT_NOTE_PLACEHOLDER), [t]);
    const text = useMemo(() => t(TranslationKeys.EDIT_NOTE_DONE), [t]);

    return (
        <ThemedBottomSheetModal snapPoints={SNAP_POINTS["100"]} ref={reference} title={addNoteTitle}>
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
                    placeholder={addNotePlaceholder}
                />
            </ThemedView>
            <ThemedPressable padding round style={styles.button} onPress={handleRequestClose}>
                <Text style={styles.buttonText} ghost>
                    {text}
                </Text>
            </ThemedPressable>
        </ThemedBottomSheetModal>
    );
};
