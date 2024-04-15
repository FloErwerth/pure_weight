import { ExerciseData, ExerciseId, ExerciseType, WorkoutId } from "../../../../store/reducers/workout/types";
import { useTheme } from "../../../../theme/context";
import { AppState, useAppDispatch, useAppSelector } from "../../../../store";
import { getDoneExerciseById } from "../../../../store/selectors/workout/workoutSelectors";
import { useCallback, useContext, useMemo, useState } from "react";
import { Keyboard, View } from "react-native";
import { styles } from "./styles";
import { HStack } from "../../../Stack/HStack/HStack";
import { borderRadius } from "../../../../theme/border";
import { ThemedTextInput } from "../../../Themed/ThemedTextInput/ThemedTextInput";
import { Text } from "../../../Themed/ThemedText/Text";
import { TimeInputRow } from "../../../EditableExercise/TimeInputRow";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { HistoryContext } from "../HistoryContext/HistoryContext";
import { cleanError, setError } from "../../../../store/reducers/errors";
import { ErrorFields } from "../../../../store/reducers/errors/types";
import { getErrorByKey } from "../../../../store/selectors/errors/errorSelectors";
import { getLanguage } from "../../../../store/selectors/settings/settingsSelectors";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { replaceDoneExerciseSet } from "../../../../store/reducers/workout";

interface SetInputRowProps {
    setIndex: number;
    doneWorkoutId: WorkoutId;
    exerciseId: ExerciseId;
}
const getIsZeroOrNullish = (values: Array<string | undefined>) => values.some((value) => !value || value === "0");
const useGetIsValid = (type: ExerciseType, doneExerciseData?: ExerciseData, hasWeight?: boolean) => {
    const dispatch = useAppDispatch();

    return useCallback(() => {
        const errors: ErrorFields[] = [];
        if (!doneExerciseData) {
            if (type === "TIME_BASED") {
                errors.push("edit_history_duration");
                if (hasWeight) {
                    errors.push("edit_history_exercise_timebased_weight");
                }
            } else {
                errors.push("edit_history_reps");
            }
            return false;
        }

        if (type === "TIME_BASED") {
            if (hasWeight && getIsZeroOrNullish([doneExerciseData.weight])) {
                errors.push("edit_history_exercise_timebased_weight");
            }
            if (!doneExerciseData.durationMinutes || !doneExerciseData.durationSeconds || (doneExerciseData.durationMinutes === "0" && doneExerciseData.durationSeconds === "0")) {
                errors.push("edit_history_duration");
            }
        } else {
            if (getIsZeroOrNullish([doneExerciseData.weight])) {
                errors.push("edit_history_exercise_weightbased_weight");
            }
            if (getIsZeroOrNullish([doneExerciseData.reps])) {
                errors.push("edit_history_reps");
            }
        }
        dispatch(setError(errors));
        return errors.length === 0;
    }, [dispatch, doneExerciseData, hasWeight, type]);
};

const useErrors = (type: ExerciseType) => {
    const language = useAppSelector(getLanguage);
    const hasTimeBasedWeightError = useAppSelector((state: AppState) => getErrorByKey(state, "edit_history_exercise_timebased_weight"));
    const hasWeightBasedWeightError = useAppSelector((state: AppState) => getErrorByKey(state, "edit_history_exercise_weightbased_weight"));
    const hasRepsError = useAppSelector((state: AppState) => getErrorByKey(state, "edit_history_reps"));
    const hasDurationError = useAppSelector((state: AppState) => getErrorByKey(state, "edit_history_duration"));

    const text = useMemo(() => {
        if (type === "TIME_BASED") {
            if (language === "en") {
                if (hasDurationError && hasTimeBasedWeightError) {
                    return "Duration and weight is required";
                }
                if (hasDurationError) {
                    return "Duration is required";
                }
                if (hasTimeBasedWeightError) {
                    return "Weight is required";
                }
                return undefined;
            }
            if (language === "de") {
                if (hasDurationError && hasTimeBasedWeightError) {
                    return "Dauer und Gewicht sind erforderlich";
                }
                if (hasDurationError) {
                    return "Dauer ist erforderlich";
                }
                if (hasTimeBasedWeightError) {
                    return "Gewicht ist erforderlich";
                }
                return undefined;
            }
        }
        if (language === "en") {
            if (hasWeightBasedWeightError && hasRepsError) {
                return "Weight and reps are required";
            }
            if (hasWeightBasedWeightError) {
                return "Weight is required";
            }
            if (hasRepsError) {
                return "Reps are required";
            }
            return undefined;
        }
        if (hasWeightBasedWeightError && hasRepsError) {
            return "Gewicht und Wiederholungen sind erforderlich";
        }
        if (hasWeightBasedWeightError) {
            return "Gewicht ist erforderlich";
        }
        if (hasRepsError) {
            return "Wiederholungen sind erforderlich";
        }
    }, [hasDurationError, hasRepsError, hasTimeBasedWeightError, hasWeightBasedWeightError, language, type]);

    return useMemo(() => {
        if (type === "TIME_BASED") {
            return {
                left: hasDurationError,
                right: hasTimeBasedWeightError,
                text,
            };
        }
        return {
            left: hasWeightBasedWeightError,
            right: hasRepsError,
            text,
        };
    }, [type, hasWeightBasedWeightError, hasRepsError, text, hasDurationError, hasTimeBasedWeightError]);
};

export const HistorySetInput = ({ doneWorkoutId, setIndex, exerciseId }: SetInputRowProps) => {
    const { activeSet, requestActive } = useContext(HistoryContext);
    const doneExercise = useAppSelector((state: AppState) => getDoneExerciseById(state, doneWorkoutId, exerciseId));
    const set = useMemo(() => doneExercise?.sets?.[setIndex], [doneExercise?.sets, setIndex]);
    const active = activeSet === setIndex;
    const [doneExerciseData, setDoneExerciseData] = useState<ExerciseData | undefined>(set);
    const hasWeight = doneExercise?.type === "TIME_BASED" && !isNaN(parseFloat(set?.weight ?? "0"));
    const dispatch = useAppDispatch();
    const getIsValid = useGetIsValid(doneExercise?.type ?? "WEIGHT_BASED", doneExerciseData, hasWeight);
    const { left, right, text } = useErrors(doneExercise?.type ?? "WEIGHT_BASED");
    const { secondaryColor, mainColor, secondaryBackgroundColor, inputFieldBackgroundColor } = useTheme();

    const handleSetWeight = useCallback(
        (value?: string) => {
            if (doneExercise?.type === "TIME_BASED") {
                dispatch(cleanError(["edit_history_exercise_timebased_weight"]));
            } else {
                dispatch(cleanError(["edit_history_exercise_weightbased_weight"]));
            }
            setDoneExerciseData((prev) => ({ ...prev, weight: value }));
        },
        [dispatch, doneExercise?.type],
    );

    const handleSetReps = useCallback(
        (value?: string) => {
            dispatch(cleanError(["edit_history_reps"]));
            setDoneExerciseData((prev) => ({ ...prev, reps: value }));
        },
        [dispatch],
    );

    const handleSetSeconds = useCallback(
        (value?: string) => {
            dispatch(cleanError(["edit_history_duration"]));
            setDoneExerciseData((prev) => ({ ...prev, durationSeconds: value }));
        },
        [dispatch],
    );

    const handleSetMinutes = useCallback(
        (value?: string) => {
            dispatch(cleanError(["edit_history_duration"]));
            setDoneExerciseData((prev) => ({ ...prev, durationMinutes: value }));
        },
        [dispatch],
    );

    const handleSetActive = useCallback(() => {
        if (!active) {
            requestActive(setIndex);
        }
    }, [active, requestActive, setIndex]);

    const handleSetDone = useCallback(() => {
        if (active) {
            if (!getIsValid()) {
                return;
            }
            dispatch(
                replaceDoneExerciseSet({
                    workoutId: doneWorkoutId,
                    exerciseId,
                    setIndex,
                    data: doneExerciseData,
                }),
            );
            Keyboard.dismiss();
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            requestActive(undefined);
        } else {
            handleSetActive();
        }
    }, [active, dispatch, doneExerciseData, doneWorkoutId, exerciseId, getIsValid, handleSetActive, requestActive, setIndex]);

    const activeStackStyles = useMemo(() => {
        return { backgroundColor: active ? inputFieldBackgroundColor : "transparent" };
    }, [active, inputFieldBackgroundColor]);

    const computedTextfieldBackgroundColor = useMemo(() => {
        if (!active) {
            return "transparent";
        }
        return secondaryBackgroundColor;
    }, [active, secondaryBackgroundColor]);

    const computedButtonBackgroundColor = useMemo(() => {
        if (!active) {
            return "transparent";
        }
        return secondaryBackgroundColor;
    }, [active, secondaryBackgroundColor]);

    const computedColor = useMemo(() => {
        if (!active) {
            return secondaryColor;
        }
        return mainColor;
    }, [active, mainColor, secondaryColor]);

    const textNumberStyles = useMemo(() => [{ color: computedColor }], [computedColor]);
    const wrapperStyle = useMemo(() => ({ backgroundColor: computedTextfieldBackgroundColor }), [computedTextfieldBackgroundColor]);
    const textStyle = useMemo(() => ({ color: computedColor }), [computedColor]);
    const textInputStyles = useMemo(() => [styles.textInput, wrapperStyle, textStyle], [wrapperStyle, textStyle]);

    const buttonStyles = useMemo(
        () =>
            ({
                flex: 0.18,
                backgroundColor: computedButtonBackgroundColor,
                justifyContent: "center",
            }) as const,
        [computedButtonBackgroundColor],
    );

    const confirmIcon = useMemo(() => {
        if (active) {
            return "check";
        }
        return "restart";
    }, [active]);

    return (
        <ThemedView ghost>
            <HStack ghost style={[styles.vStack, activeStackStyles]}>
                <View
                    style={{
                        borderRadius,
                        flex: 0.2,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Text ghost style={textNumberStyles}>
                        {setIndex + 1}
                    </Text>
                </View>

                <HStack stretch center gap ghost>
                    {doneExercise?.type === "WEIGHT_BASED" ? (
                        <HStack gap stretch ghost>
                            <HStack hasError={active && left} stretch round style={wrapperStyle}>
                                <ThemedTextInput
                                    editable={active}
                                    returnKeyType="done"
                                    style={textInputStyles}
                                    stretch
                                    value={doneExerciseData?.weight}
                                    onChangeText={handleSetWeight}
                                    textAlign="center"
                                    inputMode="decimal"
                                />
                            </HStack>
                            <HStack stretch hasError={active && right} round style={wrapperStyle}>
                                <ThemedTextInput
                                    editable={active}
                                    returnKeyType="done"
                                    style={textInputStyles}
                                    stretch
                                    value={doneExerciseData?.reps}
                                    onChangeText={handleSetReps}
                                    textAlign="center"
                                    inputMode="decimal"
                                />
                            </HStack>
                        </HStack>
                    ) : (
                        <HStack gap stretch ghost>
                            <HStack stretch hasError={active && left} ghost round style={{ height: 45 }}>
                                <TimeInputRow
                                    wrapperStyle={wrapperStyle}
                                    textStyle={textStyle}
                                    placeholderColor={active ? undefined : computedColor}
                                    background
                                    hideSuffix
                                    setMinutes={handleSetMinutes}
                                    setSeconds={handleSetSeconds}
                                    seconds={doneExerciseData?.durationSeconds}
                                    minutes={doneExerciseData?.durationMinutes}
                                />
                            </HStack>
                            {hasWeight && (
                                <HStack hasError={active && right} stretch style={wrapperStyle} round>
                                    <ThemedTextInput
                                        editable={active}
                                        returnKeyType="done"
                                        style={textInputStyles}
                                        value={doneExerciseData?.weight}
                                        stretch
                                        onChangeText={handleSetWeight}
                                        textAlign="center"
                                        inputMode="decimal"
                                    />
                                </HStack>
                            )}
                        </HStack>
                    )}
                    <ThemedPressable center style={buttonStyles} round onPress={handleSetDone}>
                        <ThemedMaterialCommunityIcons ghost size={24} name={confirmIcon} />
                    </ThemedPressable>
                </HStack>
            </HStack>
            {active && text && (
                <Text style={styles.text} ghost error>
                    {text}
                </Text>
            )}
        </ThemedView>
    );
};
