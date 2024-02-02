import { ThemedView } from "../../Themed/ThemedView/View";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback } from "react";
import { mutateEditedExercise, mutateEditedExerciseTemplate } from "../../../store/reducers/workout";
import { TimeInput } from "../../../store/reducers/workout/types";
import { styles } from "./styles";
import { EditableExerciseInputRow } from "../../EditableExercise/EditableExerciseInputRow";
import { TimeInputRow } from "../../EditableExercise/TimeInputRow";
import { getEditedExerciseTemplate } from "../../../store/reducers/workout/workoutSelectors";
import { ThemedTextInput } from "../../Themed/ThemedTextInput/ThemedTextInput";

export const TimeBasedEditableTemplate = () => {
    const template = useAppSelector(getEditedExerciseTemplate);
    const dispatch = useAppDispatch();

    const handleSetSets = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExercise({ key: "sets", value: value ?? "0" }));
        },
        [dispatch],
    );

    const handleSetName = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExerciseTemplate({ key: "name", value: value ?? "" }));
        },
        [dispatch],
    );

    const handleSetPause = useCallback(
        (value: { timeInputKey: keyof TimeInput; value: string }) => {
            dispatch(mutateEditedExerciseTemplate({ key: "pause", value: { ...template?.exerciseMetaData.pause, [value.timeInputKey]: value.value } }));
        },
        [dispatch, template?.exerciseMetaData.pause],
    );

    const handleSetDuration = useCallback(
        (value: { timeInputKey: keyof TimeInput; value: string }) => {
            dispatch(mutateEditedExerciseTemplate({ key: "duration", value: { ...template?.exerciseMetaData.duration, [value.timeInputKey]: value.value } }));
        },
        [dispatch, template?.exerciseMetaData.duration],
    );

    const handleSetPreperation = useCallback(
        (value: { timeInputKey: keyof TimeInput; value: string }) => {
            dispatch(mutateEditedExerciseTemplate({ key: "preparation", value: { ...template?.exerciseMetaData.preparation, [value.timeInputKey]: value.value } }));
        },
        [dispatch, template?.exerciseMetaData.preparation],
    );

    return (
        <ThemedView ghost stretch style={styles.inputWrapper}>
            <ThemedTextInput showClear onChangeText={handleSetName} value={template?.exerciseMetaData.name} />
            <EditableExerciseInputRow i18key="sets" setValue={handleSetSets} errorKey={"create_sets"} value={template?.exerciseMetaData.sets} />
            <TimeInputRow i18key="preparation" setValue={handleSetPreperation} value={template?.exerciseMetaData.preparation} />
            <TimeInputRow i18key="duration" setValue={handleSetDuration} value={template?.exerciseMetaData.duration} />
            <TimeInputRow i18key="pause" setValue={handleSetPause} value={template?.exerciseMetaData.pause} />
        </ThemedView>
    );
};
