import { ExerciseData, ExerciseId, ExerciseType, WorkoutId } from "../../../../store/reducers/workout/types";
import { useTheme } from "../../../../theme/context";
import { AppState, useAppSelector } from "../../../../store";
import { getDoneExerciseById } from "../../../../store/reducers/workout/workoutSelectors";
import { Dispatch, SetStateAction, useCallback, useContext, useMemo, useState } from "react";
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

interface SetInputRowProps {
    setIndex: number;
    doneWorkoutId: WorkoutId;
    exerciseId: ExerciseId;
}
const getIsZeroOrNullish = (values: Array<string | undefined>) => values.some((value) => !value || value === "0");
const useGetIsValid = (
    type: ExerciseType,
    setError: Dispatch<SetStateAction<{ left: boolean; right: boolean }>>,
    doneExerciseData?: ExerciseData,
    hasWeight?: boolean,
) => {
    return useCallback(() => {
        let isValid = true;
        if (!doneExerciseData) {
            setError({ left: true, right: true });
            return false;
        }

        if (type === "TIME_BASED" && hasWeight && getIsZeroOrNullish([doneExerciseData.weight])) {
            setError((errors) => ({ ...errors, right: true }));
            isValid = false;
        }
        if (type === "TIME_BASED") {
            if (
                !doneExerciseData.durationMinutes ||
                !doneExerciseData.durationSeconds ||
                (doneExerciseData.durationMinutes === "0" && doneExerciseData.durationSeconds === "0")
            ) {
                setError((errors) => ({ ...errors, left: true }));
                isValid = false;
            }
        } else {
            if (getIsZeroOrNullish([doneExerciseData.weight])) {
                setError((errors) => ({ ...errors, left: true }));
                isValid = false;
            }
            if (getIsZeroOrNullish([doneExerciseData.reps])) {
                setError((errors) => ({ ...errors, right: true }));
                isValid = false;
            }
        }
        return isValid;
    }, [doneExerciseData, hasWeight, setError, type]);
};

export const HistorySetInput = ({ doneWorkoutId, setIndex, exerciseId }: SetInputRowProps) => {
    const { activeSet, requestActive } = useContext(HistoryContext);
    const doneExercise = useAppSelector((state: AppState) => getDoneExerciseById(state, doneWorkoutId, exerciseId));
    const set = useMemo(() => doneExercise?.sets?.[setIndex], [doneExercise?.sets, setIndex]);
    const active = activeSet === setIndex;
    const [doneExerciseData, setDoneExerciseData] = useState<ExerciseData | undefined>(set);
    const hasWeight = doneExercise?.type === "TIME_BASED" && !isNaN(parseFloat(set?.weight ?? "0"));

    const [errors, setErrors] = useState<{ left: boolean; right: boolean }>({ left: false, right: false });
    const getIsValid = useGetIsValid(doneExercise?.type ?? "WEIGHT_BASED", setErrors, doneExerciseData, hasWeight);

    const { secondaryColor, mainColor, secondaryBackgroundColor, componentBackgroundColor, inputFieldBackgroundColor } =
        useTheme();

    const handleSetWeight = useCallback(
        (value?: string) => {
            if (doneExercise?.type === "TIME_BASED") {
                setErrors((prev) => ({ ...prev, right: false }));
            } else {
                setErrors((prev) => ({ ...prev, left: false }));
            }
            setDoneExerciseData((prev) => ({ ...prev, weight: value }));
        },
        [doneExercise?.type],
    );

    const handleSetReps = useCallback((value?: string) => {
        setErrors((prev) => ({ ...prev, right: false }));
        setDoneExerciseData((prev) => ({ ...prev, reps: value }));
    }, []);

    const handleSetSeconds = useCallback((value?: string) => {
        setErrors((prev) => ({ ...prev, left: false }));
        setDoneExerciseData((prev) => ({ ...prev, durationSeconds: value }));
    }, []);

    const handleSetMinutes = useCallback((value?: string) => {
        setErrors((prev) => ({ ...prev, left: false }));
        setDoneExerciseData((prev) => ({ ...prev, durationMinutes: value }));
    }, []);

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
            Keyboard.dismiss();
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            requestActive(undefined);
        } else {
            handleSetActive();
        }
    }, [active, getIsValid, handleSetActive, requestActive]);

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
        return componentBackgroundColor;
    }, [active, componentBackgroundColor]);

    const computedColor = useMemo(() => {
        if (!active) {
            return secondaryColor;
        }
        return mainColor;
    }, [active, mainColor, secondaryColor]);

    const textNumberStyles = useMemo(() => [{ color: computedColor }], [computedColor]);
    const wrapperStyle = useMemo(
        () => ({ backgroundColor: computedTextfieldBackgroundColor }),
        [computedTextfieldBackgroundColor],
    );
    const textStyle = useMemo(() => ({ color: computedColor }), [computedColor]);
    const textInputStyles = useMemo(() => [styles.textInput, wrapperStyle, textStyle], [wrapperStyle, textStyle]);

    const buttonStyles = useMemo(
        () => ({ flex: 0.18, backgroundColor: computedButtonBackgroundColor, justifyContent: "center" }) as const,
        [computedButtonBackgroundColor],
    );

    const confirmIcon = useMemo(() => {
        if (active) {
            return "check";
        }
        return "restart";
    }, [active]);

    return (
        <HStack ghost style={[styles.vStack, activeStackStyles]}>
            <View style={{ borderRadius, flex: 0.2, justifyContent: "center", alignItems: "center" }}>
                <Text ghost style={textNumberStyles}>
                    {setIndex + 1}
                </Text>
            </View>
            <HStack stretch center gap ghost>
                {doneExercise?.type === "WEIGHT_BASED" ? (
                    <HStack gap stretch ghost>
                        <HStack hasError={errors.left} stretch round style={wrapperStyle}>
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
                        <HStack stretch hasError={errors.right} round style={wrapperStyle}>
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
                        <HStack stretch hasError={errors.left} ghost round>
                            <TimeInputRow
                                wrapperStyle={wrapperStyle}
                                textStyle={textStyle}
                                errorTextConfig={errors.left ? {} : undefined}
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
                            <HStack hasError={errors.right} stretch style={wrapperStyle} round>
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
    );
};
