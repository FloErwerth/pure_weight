import { styles } from "./styles";
import { HStack } from "../../Stack/HStack/HStack";
import { ThemedView } from "../../Themed/ThemedView/View";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback } from "react";
import { mutateEditedExerciseTemplate, mutateEditedExerciseTimeValue } from "../../../store/reducers/workout";
import { getWeightUnit } from "../../../store/reducers/settings/settingsSelectors";
import { TimeInput } from "../../../store/reducers/workout/types";
import { EditableExerciseInputRow } from "../../EditableExercise/EditableExerciseInputRow";
import { TimeInputRow } from "../../EditableExercise/TimeInputRow";
import { getEditedExerciseTemplate } from "../../../store/reducers/workout/workoutSelectors";
import { ThemedTextInput } from "../../Themed/ThemedTextInput/ThemedTextInput";

export const WeightBasedEditableTemplate = () => {
    const template = useAppSelector(getEditedExerciseTemplate);
    const dispatch = useAppDispatch();
    const weightUnit = useAppSelector(getWeightUnit);

    const handleSetSets = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExerciseTemplate({ key: "sets", value: value ?? "0" }));
        },
        [dispatch],
    );

    const handleSetName = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExerciseTemplate({ key: "name", value: value ?? "" }));
        },
        [dispatch],
    );

    const handleSetReps = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExerciseTemplate({ key: "reps", value: value ?? "0" }));
        },
        [dispatch],
    );

    const handleSetWeight = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExerciseTemplate({ key: "weight", value: value ?? "0" }));
        },
        [dispatch],
    );

    const handleSetPause = useCallback(
        (value: { timeInputKey: keyof TimeInput; value: string }) => {
            dispatch(mutateEditedExerciseTimeValue({ key: "pause", value: { ...template?.exerciseMetaData?.pause, [value.timeInputKey]: value.value } }));
        },
        [dispatch, template?.exerciseMetaData?.pause],
    );

    return (
        <ThemedView ghost stretch style={styles.inputWrapper}>
            <ThemedTextInput showClear onChangeText={handleSetName} value={template?.exerciseMetaData?.name} />
            <HStack style={styles.inputWrapper} ghost>
                <EditableExerciseInputRow suffix={weightUnit} stretch i18key="weight" setValue={handleSetWeight} errorKey={"create_weight"} value={template?.exerciseMetaData?.weight} />
                <EditableExerciseInputRow stretch i18key="sets" setValue={handleSetSets} errorKey={"create_sets"} value={template?.exerciseMetaData?.sets} />
                <EditableExerciseInputRow stretch i18key="reps" setValue={handleSetReps} errorKey={"create_reps"} value={template?.exerciseMetaData?.reps} />
            </HStack>
            <TimeInputRow i18key="pause" setValue={handleSetPause} value={template?.exerciseMetaData?.pause} />
        </ThemedView>
    );
};
