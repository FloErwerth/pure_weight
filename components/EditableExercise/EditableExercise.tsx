import { TextInput } from "react-native";
import { useMemo, useRef } from "react";
import { ExerciseMetaData, exerciseTypeOptions } from "../../store/types";
import { styles } from "./styles";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useTranslation } from "react-i18next";
import { EditableExerciseInputRow } from "./EditableExerciseInputRow";
import { ThemedView } from "../Themed/ThemedView/View";
import { emptyExercise } from "../App/create/context";
import { SlidingSwitch, SlidingSwitchOption } from "../SlidingSwitch/SlidingSwitch";
import { Text } from "../Themed/ThemedText/Text";

export interface EditableExerciseProps {
    onConfirmEdit: (exercise: ExerciseMetaData) => void;
    editedExercise?: ExerciseMetaData;
    handleEditExercise?: (field: keyof ExerciseMetaData, value: string) => void;
}

const getContent = ({ editedExercise, handleEditExercise }: Omit<EditableExerciseProps, "onConfirmEdit">) => ({
    ["CLASSIC"]: (
        <ThemedView ghost stretch style={styles.inputWrapper}>
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
    ),
    ["TIME_BASED"]: (
        <ThemedView ghost stretch style={styles.inputWrapper}>
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
    ),
});

export const EditableExercise = ({ editedExercise = emptyExercise, handleEditExercise }: EditableExerciseProps) => {
    const { t } = useTranslation();
    const inputRef = useRef<TextInput>(null);

    const mappedExerciseOptions: SlidingSwitchOption[] = useMemo(
        () =>
            exerciseTypeOptions.map((option) => ({
                value: option,
                label: t(`create_exercise_${option}`),
                Component: getContent({ editedExercise, handleEditExercise })[option],
            })),
        [editedExercise, handleEditExercise, t],
    );

    return (
        <ThemedView stretch ghost>
            <ThemedTextInput
                ghost
                stretch
                showClear
                errorKey="create_name"
                placeholder={t("exercise_name")}
                reference={inputRef}
                value={editedExercise?.name}
                onChangeText={(name) => handleEditExercise?.("name", name)}
                style={styles.title}
            />
            <Text ghost style={styles.label}>
                {t("create_exercise_type_label")}
            </Text>
            <SlidingSwitch options={mappedExerciseOptions} onSelectValue={(value) => handleEditExercise?.("type", value)} />
        </ThemedView>
    );
};
