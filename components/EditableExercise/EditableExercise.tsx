import { TextInput } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { styles } from "./styles";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../Themed/ThemedView/View";
import { WeightBasedExercise } from "./Content/WeightBasedExercise";
import { useAppDispatch, useAppSelector } from "../../store";
import { getEditedExercise } from "../../store/reducers/workout/workoutSelectors";
import { mutateEditedExercise } from "../../store/reducers/workout";
import { ExerciseMetaData } from "../../store/reducers/workout/types";
import { SlidingSwitch } from "../SlidingSwitch/SlidingSwitch";
import { TimeBasedExercise } from "./Content/TimeBasedExercise";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { Text } from "../Themed/ThemedText/Text";

const useOptions = () => {
    const { t } = useTranslation();

    return useMemo(
        () => [
            { value: "WEIGHT_BASED", label: t("weight_based_label"), Component: <WeightBasedExercise /> },
            { value: "TIME_BASED", label: t("time_based_label"), Component: <TimeBasedExercise /> },
        ],
        [t],
    );
};

export const EditableExercise = () => {
    const { t } = useTranslation();
    const inputRef = useRef<TextInput>(null);
    const editedExercise = useAppSelector(getEditedExercise);
    const dispatch = useAppDispatch();
    const options = useOptions();

    const initialIndex = useMemo(() => {
        if (editedExercise?.exercise.type === "WEIGHT_BASED") {
            return 0;
        }
        if (editedExercise?.exercise.type === "TIME_BASED") {
            return 1;
        }
        return 0;
    }, [editedExercise?.exercise.type]);

    const handleChange = useCallback(
        (key: keyof ExerciseMetaData, value: string) => {
            dispatch(mutateEditedExercise({ key, value }));
        },
        [dispatch],
    );

    const handleSelectExerciseType = useCallback(
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
            <ThemedPressable round ghost style={{ alignSelf: "flex-end", marginTop: 10 }}>
                <Text style={{ fontSize: 18 }} ghost cta>
                    Aus Vorlage wählen
                </Text>
            </ThemedPressable>
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
            <SlidingSwitch initialIndex={initialIndex} options={options} onSelectValue={handleSelectExerciseType} />
        </ThemedView>
    );
};
