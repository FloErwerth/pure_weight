import { styles } from "../styles";
import { HStack } from "../../Stack/HStack/HStack";
import { EditableExerciseInputRow } from "../EditableExerciseInputRow";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback, useMemo } from "react";
import { mutateEditedExercise } from "../../../store/reducers/workout";

import { getEditedExercise } from "../../../store/selectors/workout/workoutSelectors";
import { getWeightUnit } from "../../../store/selectors/settings/settingsSelectors";
import { TimeInputRow } from "../TimeInputRow";
import { ErrorTextConfig } from "../../../store/reducers/errors/types";
import { PageContent } from "../../PageContent/PageContent";
import { ThemedView } from "../../Themed/ThemedView/View";
import { TranslationKeys } from "../../../locales/translationKeys";

export const WeightBasedExercise = () => {
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();
    const weightUnit = useAppSelector(getWeightUnit);

    const handleSetSets = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExercise({ key: "sets", value: value ?? "0" }));
        },
        [dispatch],
    );

    const handleSetReps = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExercise({ key: "reps", value: value ?? "0" }));
        },
        [dispatch],
    );

    const handleSetWeight = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExercise({ key: "weight", value: value ?? "0" }));
        },
        [dispatch],
    );

    const handleSetPauseMinutes = useCallback(
        (value?: string) => {
            dispatch(
                mutateEditedExercise({
                    key: "pauseMinutes",
                    value,
                }),
            );
        },
        [dispatch],
    );
    const handleSetPauseSeconds = useCallback(
        (value?: string) => {
            dispatch(
                mutateEditedExercise({
                    key: "pauseSeconds",
                    value,
                }),
            );
        },
        [dispatch],
    );

    const errorTextConfigs: Record<"sets" | "reps" | "weight", ErrorTextConfig> = useMemo(
        () => ({
            sets: {
                errorKey: "create_exercise_sets",
            },
            reps: {
                errorKey: "create_exercise_reps",
            },
            weight: {
                errorKey: "create_exercise_weight",
            },
        }),
        [],
    );

    return (
        <PageContent ignoreGap ignorePadding ghost stretch style={styles.inputWrapper}>
            <ThemedView ghost>
                <HStack ghost gap>
                    <EditableExerciseInputRow
                        suffix={weightUnit}
                        i18key={TranslationKeys.WEIGHT}
                        stretch
                        errorTextConfig={errorTextConfigs.weight}
                        setValue={handleSetWeight}
                        value={editedExercise?.exercise?.weight}
                        maxLength={7}
                    />
                    <EditableExerciseInputRow
                        errorTextConfig={errorTextConfigs.sets}
                        i18key={TranslationKeys.SETS}
                        stretch
                        setValue={handleSetSets}
                        value={editedExercise?.exercise.sets}
                        maxLength={7}
                    />
                </HStack>
                <HStack ghost gap>
                    <EditableExerciseInputRow
                        stretch
                        errorTextConfig={errorTextConfigs.reps}
                        i18key={TranslationKeys.REPS}
                        setValue={handleSetReps}
                        value={editedExercise?.exercise.reps}
                        maxLength={7}
                    />
                    <TimeInputRow
                        wrapperStyle={styles.input}
                        i18key={TranslationKeys.PAUSE}
                        setMinutes={handleSetPauseMinutes}
                        setSeconds={handleSetPauseSeconds}
                        minutes={editedExercise?.exercise?.pauseMinutes}
                        seconds={editedExercise?.exercise?.pauseSeconds}
                    />
                </HStack>
            </ThemedView>
        </PageContent>
    );
};
