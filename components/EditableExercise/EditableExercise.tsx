import { TextInput } from "react-native";
import { useRef } from "react";
import { ExerciseMetaData, ExerciseTypeOptions } from "../../store/types";
import { styles } from "./styles";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useTranslation } from "react-i18next";
import { EditableExerciseInputRow } from "./EditableExerciseInputRow";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedView } from "../Themed/ThemedView/View";
import { emptyExercise } from "../App/create/context";
import { ThemedDropdown } from "../Themed/Dropdown/ThemedDropdown";

export interface EditableExerciseProps {
    onConfirmEdit: (exercise: ExerciseMetaData) => void;
    editedExercise?: ExerciseMetaData;
    handleEditExercise?: (field: keyof ExerciseMetaData, value: string) => void;
}

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
                    <EditableExerciseInputRow
                        stretch
                        i18key="reps"
                        setValue={(reps) => handleEditExercise?.("reps", reps)}
                        errorKey={"create_reps"}
                        value={editedExercise?.reps}
                    />
                </HStack>
                <EditableExerciseInputRow
                    stretch
                    type="MINUTES_SECONDS"
                    i18key="pause"
                    setValue={(pause) => handleEditExercise?.("pause", pause)}
                    value={editedExercise?.pause}
                />
            </ThemedView>
        );
    }
    return (
        <ThemedView ghost style={styles.inputWrapper}>
            <EditableExerciseInputRow
                type="MINUTES_SECONDS"
                i18key="timePerSet"
                setValue={(timePerSet) => handleEditExercise?.("timePerSet", timePerSet)}
                errorKey={"create_timePerSet"}
                value={editedExercise?.weight}
            />
            <EditableExerciseInputRow
                i18key="sets"
                setValue={(sets) => handleEditExercise?.("sets", sets)}
                errorKey={"create_sets"}
                value={editedExercise?.sets}
            />
            <EditableExerciseInputRow
                stretch
                type="MINUTES_SECONDS"
                i18key="pause"
                setValue={(pause) => handleEditExercise?.("pause", pause)}
                value={editedExercise?.pause}
            />
        </ThemedView>
    );
};

export const EditableExercise = ({ editedExercise = emptyExercise, handleEditExercise }: EditableExerciseProps) => {
    const { t } = useTranslation();
    const inputRef = useRef<TextInput>(null);

    return (
        <ThemedView stretch ghost>
            <ThemedTextInput
                ghost
                stretch
                bottomSheet
                showClear
                errorKey="create_name"
                placeholder={t("exercise_name")}
                reference={inputRef}
                value={editedExercise?.name}
                onChangeText={(name) => handleEditExercise?.("name", name)}
                style={styles.title}
            />
            <ThemedView ghost>
                <Text behind ghost style={styles.label}>
                    {t("create_exercise_type_label")}
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
        </ThemedView>
    );
};
