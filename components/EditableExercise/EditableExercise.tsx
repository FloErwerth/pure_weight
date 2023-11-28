import { TextInput } from "react-native";
import { ReactElement, useCallback, useMemo, useRef } from "react";
import { ExerciseMetaData, ExerciseType, exerciseTypeOptions } from "../../store/types";
import { styles } from "./styles";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../Themed/ThemedView/View";
import { SlidingSwitch, SlidingSwitchOption } from "../SlidingSwitch/SlidingSwitch";
import { Text } from "../Themed/ThemedText/Text";
import { WeightBasedExercise } from "./Content/WeightBasedExercise";
import { TimeBasedExercise } from "./Content/TimeBasedExercise";
import { useAppDispatch, useAppSelector } from "../../store";
import { getEditedExercise } from "../../store/reducers/workout/workoutSelectors";
import { mutateEditedExercise } from "../../store/reducers/workout";

const getContent = (): Record<ExerciseType, ReactElement> => {
    return {
        ["WEIGHT_BASED"]: <WeightBasedExercise />,
        ["TIME_BASED"]: <TimeBasedExercise />,
    };
};

export const EditableExercise = () => {
    const { t } = useTranslation();
    const inputRef = useRef<TextInput>(null);
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();

    const mappedExerciseOptions: SlidingSwitchOption[] = useMemo(
        () =>
            exerciseTypeOptions.map((option) => ({
                value: option,
                label: t(`create_exercise_${option}`),
                Component: getContent()[option],
            })),

        [t],
    );

    const handleChange = useCallback(
        (key: keyof ExerciseMetaData, value: string) => {
            dispatch(mutateEditedExercise({ key, value }));
        },
        [dispatch],
    );

    const handleChangeSlidingSwitch = useCallback(
        (value: string) => {
            handleChange("type", value);
        },
        [handleChange],
    );

    const handleChangeName = useCallback(
        (value: string) => {
            handleChange("name", value);
        },
        [handleChange],
    );

    return (
        <ThemedView stretch ghost>
            <ThemedTextInput
                ghost
                showClear
                errorKey="create_name"
                placeholder={t("exercise_name")}
                reference={inputRef}
                value={editedExercise?.exercise.name}
                onChangeText={handleChangeName}
                style={styles.title}
            />
            <Text ghost style={styles.label}>
                {t("create_exercise_type_label")}
            </Text>
            <SlidingSwitch value={editedExercise?.exercise.type} hasComponents={true} options={mappedExerciseOptions} onSelectValue={handleChangeSlidingSwitch} />
        </ThemedView>
    );
};
