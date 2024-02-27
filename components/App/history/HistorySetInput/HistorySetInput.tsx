import { ExerciseId, WorkoutId } from "../../../../store/reducers/workout/types";
import { useTheme } from "../../../../theme/context";
import { AppState, useAppDispatch, useAppSelector } from "../../../../store";
import { getDoneExerciseById } from "../../../../store/reducers/workout/workoutSelectors";
import { useCallback, useContext, useMemo } from "react";
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
import { mutateDoneExercise } from "../../../../store/reducers/workout";
import { HistoryContext } from "../HistoryContext/HistoryContext";

interface SetInputRowProps {
    setIndex: number;
    doneWorkoutId: WorkoutId;
    exerciseId: ExerciseId;
}

export const HistorySetInput = ({ doneWorkoutId, setIndex, exerciseId }: SetInputRowProps) => {
    const { activeSet, requestActive } = useContext(HistoryContext);
    const doneExercise = useAppSelector((state: AppState) => getDoneExerciseById(state, doneWorkoutId, exerciseId));
    const set = useMemo(() => doneExercise?.sets?.[setIndex], [doneExercise?.sets, setIndex]);
    const active = activeSet === setIndex;

    const hasWeight =
        doneExercise?.type === "TIME_BASED" && set?.weight !== undefined && set.weight !== "" && set.weight !== "0";

    const dispatch = useAppDispatch();

    const {
        secondaryColor,
        mainColor,
        secondaryBackgroundColor,
        componentBackgroundColor,
        inputFieldBackgroundColor,
        textDisabled,
    } = useTheme();

    const handleSetWeight = useCallback(
        (value?: string) => {
            dispatch(
                mutateDoneExercise({
                    doneExerciseId: exerciseId,
                    doneWorkoutId,
                    setIndex,
                    key: "weight",
                    value,
                }),
            );
        },
        [dispatch, doneWorkoutId, exerciseId, setIndex],
    );

    const handleSetReps = useCallback(
        (value?: string) => {
            dispatch(
                mutateDoneExercise({
                    doneExerciseId: exerciseId,
                    doneWorkoutId,
                    setIndex,
                    key: "reps",
                    value,
                }),
            );
        },
        [dispatch, doneWorkoutId, exerciseId, setIndex],
    );

    const handleSetSeconds = useCallback(
        (value?: string) => {
            mutateDoneExercise({
                doneExerciseId: exerciseId,
                doneWorkoutId,
                setIndex,
                key: "durationSeconds",
                value,
            });
        },
        [doneWorkoutId, exerciseId, setIndex],
    );

    const handleSetMinutes = useCallback(
        (value?: string) => {
            dispatch(
                mutateDoneExercise({
                    doneExerciseId: exerciseId,
                    doneWorkoutId,
                    setIndex,
                    key: "durationMinutes",
                    value,
                }),
            );
        },
        [dispatch, doneWorkoutId, exerciseId, setIndex],
    );

    const handleSetActive = useCallback(() => {
        if (!active) {
            requestActive(setIndex);
        }
    }, [active, requestActive, setIndex]);

    const handleSetDone = useCallback(() => {
        if (active) {
            Keyboard.dismiss();
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            requestActive(undefined);
        } else {
            handleSetActive();
        }
    }, [active, handleSetActive, requestActive]);

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

    const playStyle = useMemo(() => ({ color: active ? mainColor : textDisabled }), [active, mainColor, textDisabled]);
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
                        <HStack stretch round style={wrapperStyle}>
                            <ThemedTextInput
                                editable={active}
                                returnKeyType="done"
                                style={textInputStyles}
                                stretch
                                value={set?.weight}
                                onChangeText={handleSetWeight}
                                textAlign="center"
                                inputMode="decimal"
                            />
                        </HStack>
                        <HStack stretch round style={wrapperStyle}>
                            <ThemedTextInput
                                editable={active}
                                returnKeyType="done"
                                style={textInputStyles}
                                stretch
                                value={set?.reps}
                                onChangeText={handleSetReps}
                                textAlign="center"
                                inputMode="decimal"
                            />
                        </HStack>
                    </HStack>
                ) : (
                    <HStack gap stretch ghost>
                        <TimeInputRow
                            wrapperStyle={wrapperStyle}
                            textStyle={textStyle}
                            placeholderColor={active ? undefined : computedColor}
                            background
                            stretch
                            hideSuffix
                            setMinutes={handleSetMinutes}
                            setSeconds={handleSetSeconds}
                            seconds={set?.durationSeconds}
                            minutes={set?.durationMinutes}
                        />
                        {hasWeight && (
                            <HStack stretch style={wrapperStyle} round>
                                <ThemedTextInput
                                    editable={active}
                                    returnKeyType="done"
                                    style={textInputStyles}
                                    value={set?.weight}
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
