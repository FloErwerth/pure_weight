import { EditableExerciseInputRow } from "../EditableExerciseInputRow";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback, useMemo } from "react";
import { mutateEditedExercise } from "../../../store/reducers/workout";

import { getEditedExercise } from "../../../store/selectors/workout/workoutSelectors";
import { TimeInputRow } from "../TimeInputRow";
import { ErrorTextConfig } from "../../../store/reducers/errors/types";
import { getWeightUnit } from "../../../store/selectors/settings/settingsSelectors";
import { HStack } from "../../Stack/HStack/HStack";
import { styles } from "../styles";
import { PageContent } from "../../PageContent/PageContent";
import { useTypedTranslation } from "../../../locales/i18next";
import { TranslationKeys } from "../../../locales/translationKeys";
import { toErrorTranslation } from "../../../store/mapper/error";

export const TimeBasedExercise = () => {
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();
    const { t } = useTypedTranslation();
    const weightUnit = useAppSelector(getWeightUnit);

    const handleSetSets = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExercise({ key: "sets", value: value }));
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

    const handleSetDurationMinutes = useCallback(
        (value?: string) => {
            dispatch(
                mutateEditedExercise({
                    key: "durationMinutes",
                    value,
                }),
            );
        },
        [dispatch],
    );

    const handleSetDurationSeconds = useCallback(
        (value?: string) => {
            dispatch(
                mutateEditedExercise({
                    key: "durationSeconds",
                    value,
                }),
            );
        },
        [dispatch],
    );

    const handleSetWeight = useCallback(
        (value?: string) => {
            dispatch(
                mutateEditedExercise({
                    key: "weight",
                    value,
                }),
            );
        },
        [dispatch],
    );

    const errorTextConfigs: Record<string, ErrorTextConfig> = useMemo(
        () => ({
            sets: {
                errorKey: "create_exercise_sets",
                errorText: t(toErrorTranslation("create_exercise_sets")),
            },
            duration: {
                errorKey: "create_exercise_duration",
                errorText: t(toErrorTranslation("create_exercise_duration")),
            },
        }),
        [t],
    );

    return (
        <PageContent ignorePadding ignoreGap ghost style={styles.inputWrapper}>
            <HStack gap ghost>
                <TimeInputRow
                    wrapperStyle={styles.input}
                    i18key={TranslationKeys.DURATION}
                    setMinutes={handleSetDurationMinutes}
                    setSeconds={handleSetDurationSeconds}
                    minutes={editedExercise?.exercise?.durationMinutes}
                    seconds={editedExercise?.exercise?.durationSeconds}
                    errorTextConfig={errorTextConfigs.duration}
                />
                <TimeInputRow
                    i18key={TranslationKeys.PAUSE}
                    wrapperStyle={styles.input}
                    setMinutes={handleSetPauseMinutes}
                    setSeconds={handleSetPauseSeconds}
                    minutes={editedExercise?.exercise?.pauseMinutes}
                    seconds={editedExercise?.exercise?.pauseSeconds}
                />
            </HStack>
            <HStack gap ghost>
                <EditableExerciseInputRow i18key={TranslationKeys.SETS} stretch setValue={handleSetSets} errorTextConfig={errorTextConfigs.sets} value={editedExercise?.exercise.sets} />
                <EditableExerciseInputRow stretch setValue={handleSetWeight} i18key={TranslationKeys.WEIGHT} suffix={weightUnit} value={editedExercise?.exercise.weight}></EditableExerciseInputRow>
            </HStack>
        </PageContent>
    );
};
