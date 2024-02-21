import { styles } from "../styles";
import { HStack } from "../../Stack/HStack/HStack";
import { EditableExerciseInputRow } from "../EditableExerciseInputRow";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback, useMemo } from "react";
import { mutateEditedExercise } from "../../../store/reducers/workout";

import { getEditedExercise } from "../../../store/reducers/workout/workoutSelectors";
import { getLanguage, getWeightUnit } from "../../../store/reducers/settings/settingsSelectors";
import { TimeInputRow } from "../TimeInputRow";
import { getErrors } from "../../../store/reducers/errors/errorSelectors";
import { Text } from "../../Themed/ThemedText/Text";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { ErrorFields, ErrorTextConfig } from "../../../store/reducers/errors/types";
import { PageContent } from "../../PageContent/PageContent";

const weightBasedErrorKeys: ErrorFields[] = ["create_exercise_sets", "create_exercise_reps", "create_exercise_weight"];
const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

const useWeightBasedErrors = () => {
    const { t } = useTranslation();
    const language = useAppSelector(getLanguage);
    const errors = useAppSelector(getErrors);
    const weightBasedErrors = useMemo(() => errors.filter((key) => weightBasedErrorKeys.includes(key)), [errors]);

    return useMemo(() => {
        if (weightBasedErrors.length === 3) {
            return t("error_create_exercise_weight_reps_sets");
        }
        if (weightBasedErrors.length === 2) {
            const firstError = t(`error_${weightBasedErrors[0]}_single`);
            const secondError = t(`error_${weightBasedErrors[1]}_single`);
            const errors = [firstError, secondError].sort((a, b) => a.localeCompare(b)).reverse();
            if (language === "en") {
                return `${capitalizeFirstLetter(errors[0])} and ${errors[1]} are required`;
            } else {
                return `${capitalizeFirstLetter(errors[1])} und ${errors[0]} sind erforderlich`;
            }
        }
        if (weightBasedErrors.length === 1) {
            return t(`error_${weightBasedErrors[0]}`);
        }
    }, [weightBasedErrors, language, t]);
};

export const WeightBasedExercise = () => {
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();
    const weightUnit = useAppSelector(getWeightUnit);
    const weightBasedErrorText = useWeightBasedErrors();

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
                hideError: true,
            },
            reps: {
                errorKey: "create_exercise_reps",
                hideError: true,
            },
            weight: {
                errorKey: "create_exercise_weight",
                hideError: true,
            },
        }),
        [],
    );

    return (
        <PageContent scrollable ignorePadding ghost stretch style={styles.inputWrapper}>
            <View>
                <HStack style={styles.inputWrapper} ghost>
                    <EditableExerciseInputRow
                        suffix={weightUnit}
                        stretch
                        i18key="weight"
                        errorTextConfig={errorTextConfigs.weight}
                        setValue={handleSetWeight}
                        value={editedExercise?.exercise?.weight}
                        maxLength={7}
                    />
                    <EditableExerciseInputRow
                        suffix="x"
                        stretch
                        errorTextConfig={errorTextConfigs.sets}
                        i18key="sets"
                        setValue={handleSetSets}
                        value={editedExercise?.exercise.sets}
                        maxLength={7}
                    />
                    <EditableExerciseInputRow
                        suffix="x"
                        stretch
                        errorTextConfig={errorTextConfigs.reps}
                        i18key="reps"
                        setValue={handleSetReps}
                        value={editedExercise?.exercise.reps}
                        maxLength={7}
                    />
                </HStack>
                {weightBasedErrorText && (
                    <Text ghost error>
                        {weightBasedErrorText}
                    </Text>
                )}
            </View>
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
