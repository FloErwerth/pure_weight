import { TextInput } from "react-native";
import { ReactElement, useMemo, useRef } from "react";
import { ExerciseMetaData, ExerciseType, exerciseTypeOptions } from "../../store/types";
import { styles } from "./styles";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../Themed/ThemedView/View";
import { emptyWeightbasedExercise } from "../App/create/context";
import { SlidingSwitch, SlidingSwitchOption } from "../SlidingSwitch/SlidingSwitch";
import { Text } from "../Themed/ThemedText/Text";
import { WeightBasedExercise } from "./Content/WeightBasedExercise";
import { TimeBasedExercise } from "./Content/TimeBasedExercise";

export interface EditableExerciseProps {
    onConfirmEdit: (exercise: ExerciseMetaData) => void;
    editedExercise: ExerciseMetaData;
    handleEditExercise?: (field: keyof ExerciseMetaData, value: string) => void;
    isEditingExercise?: boolean;
}

const getContent = ({ editedExercise, handleEditExercise }: Omit<EditableExerciseProps, "onConfirmEdit">): Record<ExerciseType, ReactElement> => {
    return {
        ["WEIGHT_BASED"]: <WeightBasedExercise />,
        ["TIME_BASED"]: <TimeBasedExercise />,
    };
};

export const EditableExercise = ({ editedExercise = emptyWeightbasedExercise, handleEditExercise }: EditableExerciseProps) => {
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
            <SlidingSwitch
                value={editedExercise.type}
                hasComponents={true}
                options={mappedExerciseOptions}
                onSelectValue={(value) => handleEditExercise?.("type", value)}
            />
        </ThemedView>
    );
};
