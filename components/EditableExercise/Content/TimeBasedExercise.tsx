import { styles } from "../styles";
import { EditableExerciseInputRow } from "../EditableExerciseInputRow";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback, useMemo } from "react";
import { mutateEditedExercise } from "../../../store/reducers/workout";

import { getEditedExercise } from "../../../store/reducers/workout/workoutSelectors";
import { TimeInputRow } from "../TimeInputRow";
import { useTranslation } from "react-i18next";
import { ErrorTextConfig } from "../../../store/reducers/errors/types";
import { PageContent } from "../../PageContent/PageContent";

export const TimeBasedExercise = () => {
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const handleSetSets = useCallback(
        (value: string | undefined) => {
            dispatch(mutateEditedExercise({ key: "sets", value: value ?? "0" }));
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

    const errorTextConfigs: Record<string, ErrorTextConfig> = useMemo(
        () => ({
            sets: {
                errorKey: "create_exercise_sets",
                errorText: t("error_create_exercise_sets"),
            },
            duration: {
                errorKey: "create_exercise_duration",
                errorText: t("error_create_exercise_duration"),
            },
        }),
        [t],
    );

    return (
        <PageContent ignorePadding scrollable ghost style={styles.inputWrapper}>
            <EditableExerciseInputRow
                i18key="sets"
                suffix="x"
                stretch
                setValue={handleSetSets}
                errorTextConfig={errorTextConfigs.sets}
                value={editedExercise?.exercise.sets}
            />
            <TimeInputRow
                i18key="duration"
                stretch
                setMinutes={handleSetDurationMinutes}
                setSeconds={handleSetDurationSeconds}
                minutes={editedExercise?.exercise?.durationMinutes}
                seconds={editedExercise?.exercise?.durationSeconds}
                errorTextConfig={errorTextConfigs.duration}
            />
            <TimeInputRow
                i18key="pause"
                stretch
                setMinutes={handleSetPauseMinutes}
                setSeconds={handleSetPauseSeconds}
                minutes={editedExercise?.exercise?.pauseMinutes}
                seconds={editedExercise?.exercise?.pauseSeconds}
            />
        </PageContent>
    );
};
