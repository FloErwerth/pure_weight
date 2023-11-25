import { TextInput } from "react-native";
import { useCallback, useMemo, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ErrorFields, ExerciseMetaData, ExerciseTypeOptions } from "../../store/types";
import { styles } from "./styles";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../store";
import { setError } from "../../store/reducer";
import { EditableExerciseInputRow } from "./EditableExerciseInputRow";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedView } from "../Themed/ThemedView/View";
import { emptyExercise } from "../App/create/context";
import { ThemedDropdown } from "../Themed/Dropdown/ThemedDropdown";
import { ThemedPressable } from "../Themed/Pressable/Pressable";

export interface EditableExerciseProps {
    onConfirmEdit: (exercise: ExerciseMetaData) => void;
    editedExercise?: ExerciseMetaData;
    handleEditExercise?: (field: keyof ExerciseMetaData, value: string) => void;
}

const validateData = (data: Partial<ExerciseMetaData>) => {
    const errors: ErrorFields[] = [];
    if (data.type === "Classical") {
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
    if (data.type === "Time based") {
        if (!data.timePerSet) {
            errors.push("create_timePerSet");
        }
        if (!data.sets) {
            errors.push("create_sets");
        }
    }
    return errors;
};
export const EditableExerciseContent = ({ editedExercise, handleEditExercise }: Omit<EditableExerciseProps, "onConfirmEdit">) => {
    if (editedExercise?.type !== "Time based") {
        return (
            <ThemedView ghost style={styles.inputWrapper}>
                <HStack style={styles.inputWrapper} ghost>
                    <EditableExerciseInputRow
                        stretch
                        i18key="weight"
                        setValue={(weight) => handleEditExercise?.("weight", weight)}
                        errorKey={"create_weight"}
                        value={editedExercise?.weight}
                    />
                    <EditableExerciseInputRow
                        stretch
                        i18key="sets"
                        setValue={(sets) => handleEditExercise?.("sets", sets)}
                        errorKey={"create_sets"}
                        value={editedExercise?.sets}
                    />
                </HStack>
                <HStack ghost style={styles.inputWrapper}>
                    <EditableExerciseInputRow
                        stretch
                        i18key="reps"
                        setValue={(reps) => handleEditExercise?.("reps", reps)}
                        errorKey={"create_reps"}
                        value={editedExercise?.reps}
                    />
                    <EditableExerciseInputRow
                        stretch
                        i18key="pause"
                        setValue={(pause) => handleEditExercise?.("pause", pause)}
                        value={editedExercise?.pause}
                    />
                </HStack>
            </ThemedView>
        );
    }
    return (
        <ThemedView ghost style={styles.inputWrapper}>
            <EditableExerciseInputRow
                type="TIME"
                i18key="timePerSet"
                setValue={(weight) => handleEditExercise?.("timePerSet", weight)}
                errorKey={"create_timePerSet"}
                value={editedExercise?.weight}
            />
            <EditableExerciseInputRow
                i18key="sets"
                setValue={(sets) => handleEditExercise?.("sets", sets)}
                errorKey={"create_sets"}
                value={editedExercise?.sets}
            />
        </ThemedView>
    );
};

export const EditableExercise = ({ onConfirmEdit, editedExercise = emptyExercise, handleEditExercise }: EditableExerciseProps) => {
    const { t } = useTranslation();
    const { mainColor } = useTheme();
    const inputRef = useRef<TextInput>(null);
    const dispatch = useAppDispatch();
    const isEditing = useMemo(() => Boolean(editedExercise), [editedExercise]);

    const handleConfirm = useCallback(() => {
        if (editedExercise) {
            const { name, sets, reps, weight, pause, timePerSet, type } = editedExercise;
            const possibleErrors = validateData({ reps, sets, weight, name });
            if (possibleErrors.length > 0) {
                dispatch(setError(possibleErrors));
            } else {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                onConfirmEdit({
                    name: name ?? "",
                    reps: reps ?? "",
                    sets: sets ?? "",
                    weight: weight ?? "",
                    pause,
                    type: type ?? "Classical",
                    timePerSet: timePerSet ?? "",
                });
            }
        }
    }, [dispatch, editedExercise, onConfirmEdit]);

    return (
        <ThemedView ghost style={styles.innerWrapper}>
            <ThemedTextInput
                ghost
                bottomSheet
                showClear
                autoFocus
                errorKey="create_name"
                placeholder={t("exercise_name")}
                reference={inputRef}
                value={editedExercise?.name}
                onChangeText={(name) => handleEditExercise?.("name", name)}
                style={styles.title}
            />
            <ThemedView ghost>
                <Text ghost style={styles.label}>
                    Exercise Type
                </Text>
                <ThemedDropdown
                    secondary
                    placeholderTranslationKey="create_select_type"
                    isSelectable
                    value={editedExercise?.type}
                    onSelectItem={(type) => handleEditExercise?.("type", type)}
                    options={ExerciseTypeOptions}
                />
            </ThemedView>
            <EditableExerciseContent editedExercise={editedExercise} handleEditExercise={handleEditExercise} />
            <ThemedPressable ghost behind onPress={handleConfirm}>
                <HStack secondary style={styles.button}>
                    <Text secondary style={styles.buttonText}>
                        {t(isEditing ? "edit_exercise" : "create_exercise")}
                    </Text>
                    <MaterialCommunityIcons color={mainColor} name="pencil-plus-outline" size={20}></MaterialCommunityIcons>
                </HStack>
            </ThemedPressable>
        </ThemedView>
    );
};
