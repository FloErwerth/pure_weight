import { EditableExercise, EditableExerciseProps } from "../EditableExercise/EditableExercise";
import { ThemedBottomSheetModalProps, ThemedButtomSheetModal } from "../BottomSheetModal/ThemedButtomSheetModal";
import { RefObject, useCallback, useMemo } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { HStack } from "../Stack/HStack/HStack";
import { styles } from "../EditableExercise/styles";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import * as Haptics from "expo-haptics";
import { ExerciseMetaData } from "../../store/types";
import { useAppDispatch } from "../../store";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedView } from "../Themed/ThemedView/View";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorFields, setError } from "../../store/reducers/errors";

const validateData = (data: Partial<ExerciseMetaData>) => {
    const errors: ErrorFields[] = [];
    if (data.type === "WEIGHT_BASED") {
        if (!data.sets) {
            errors.push("create_sets");
        }
        if (!data.name) {
            errors.push("create_name");
        }
        if (!data.reps) {
            errors.push("create_reps");
        }
        if (!data.weight) {
            errors.push("create_weight");
        }
    }
    if (data.type === "TIME_BASED") {
        if (!data.timePerSet) {
            errors.push("create_timePerSet");
        }
        if (!data.sets) {
            errors.push("create_sets");
        }
    }
    return errors;
};

type AddExerciseModalProps = ThemedBottomSheetModalProps &
    Omit<EditableExerciseProps, "onCancel"> & { isEditingExercise: boolean; reference: RefObject<BottomSheetModal> };
export const AddExerciseModal = (props: AddExerciseModalProps) => {
    const { bottom } = useSafeAreaInsets();
    const { t } = useTranslation();
    const title = useMemo(() => t(props.isEditingExercise ? "exercise_edit_title" : "create_exercise"), [props.isEditingExercise, t]);
    const dispatch = useAppDispatch();
    const { editedExercise, onConfirmEdit, isEditingExercise } = props;

    const handleConfirm = useCallback(() => {
        if (editedExercise) {
            const { name, sets, reps, weight, pause, timePerSet, type } = editedExercise;
            const possibleErrors = validateData({ reps, sets, weight, name });
            if (possibleErrors.length > 0) {
                dispatch(setError(possibleErrors));
            } else {
                if (type === "WEIGHT_BASED") {
                    onConfirmEdit({
                        name: name ?? "",
                        reps: reps ?? "",
                        sets: sets ?? "",
                        weight: weight ?? "",
                        pause: pause ?? "",
                        type,
                    });
                }
                if (type === "TIME_BASED") {
                    onConfirmEdit({
                        name: name ?? "",
                        sets: sets ?? "",
                        pause: pause ?? "",
                        type,
                        timePerSet: timePerSet ?? "",
                    });
                }
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        }
    }, [dispatch, editedExercise, onConfirmEdit]);

    const buttonStyles = useMemo(() => ({ marginBottom: bottom }), [bottom]);
    return (
        <ThemedButtomSheetModal snapPoints={["100%"]} ref={props.reference} {...props} title={title}>
            <ThemedView stretch ghost style={styles.innerWrapper}>
                <EditableExercise
                    handleEditExercise={props.handleEditExercise}
                    editedExercise={props.editedExercise}
                    onConfirmEdit={props.onConfirmEdit}
                />
                <ThemedPressable style={buttonStyles} ghost behind onPress={handleConfirm}>
                    <HStack secondary style={styles.button}>
                        <Text secondary style={styles.buttonText}>
                            {t(isEditingExercise ? "edit_exercise" : "create_exercise")}
                        </Text>
                        <ThemedMaterialCommunityIcons ghost name="pencil-plus-outline" size={20} />
                    </HStack>
                </ThemedPressable>
            </ThemedView>
        </ThemedButtomSheetModal>
    );
};
