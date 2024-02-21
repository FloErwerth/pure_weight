import { Keyboard, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import { HStack } from "../Stack/HStack/HStack";
import { Text } from "../Themed/ThemedText/Text";
import { borderRadius } from "../../theme/border";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useTheme } from "../../theme/context";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import * as Haptics from "expo-haptics";
import { handleMutateSet, markSetAsDone, setIsActiveSet } from "../../store/reducers/workout";
import { getExerciseById, getIsActiveSet, getSetData } from "../../store/reducers/workout/workoutSelectors";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ExerciseId } from "../../store/reducers/workout/types";
import { getUpdatePrefilledWorkoutValues } from "../../store/reducers/settings/settingsSelectors";
import { TimeInputRow } from "../EditableExercise/TimeInputRow";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";

interface SetInputRowProps {
    setIndex: number;
    exerciseId: ExerciseId;
}

export const SetInput = ({ setIndex, exerciseId }: SetInputRowProps) => {
    const {
        primaryColor,
        secondaryColor,
        mainColor,
        secondaryBackgroundColor,
        componentBackgroundColor,
        inputFieldBackgroundColor,
        textDisabled,
    } = useTheme();

    const data = useAppSelector((state: AppState) => getSetData(state, setIndex, exerciseId));

    const exercise = useAppSelector((state: AppState) => getExerciseById(state, exerciseId));
    const { isLatestSet, weight, reps, isEditable, isConfirmed, durationSeconds, durationMinutes } = data ?? {};
    const isActiveSet = useAppSelector((state: AppState) => getIsActiveSet(state, exerciseId, setIndex));
    const wantsUpdatePrefilledValues = useAppSelector(getUpdatePrefilledWorkoutValues);
    const dispatch = useAppDispatch();

    const handleSetActive = useCallback(() => {
        if (!isActiveSet) {
            dispatch(setIsActiveSet({ setIndex }));
        }
    }, [dispatch, isActiveSet, setIndex]);

    const handleSetWeight = useCallback(
        (value?: string) => {
            dispatch(
                handleMutateSet({
                    setIndex,
                    key: "weight",
                    value,
                    updatePrefilledValues: wantsUpdatePrefilledValues && isLatestSet,
                }),
            );
            if (!isActiveSet) {
                handleSetActive();
            }
        },
        [dispatch, handleSetActive, isActiveSet, isLatestSet, setIndex, wantsUpdatePrefilledValues],
    );

    const handleSetReps = useCallback(
        (value?: string) => {
            dispatch(
                handleMutateSet({
                    setIndex,
                    key: "reps",
                    value,
                    updatePrefilledValues: wantsUpdatePrefilledValues && isLatestSet,
                }),
            );
        },
        [dispatch, isLatestSet, setIndex, wantsUpdatePrefilledValues],
    );

    const handleSetSeconds = useCallback(
        (value?: string) => {
            dispatch(
                handleMutateSet({
                    setIndex,
                    key: "durationSeconds",
                    value,
                    updatePrefilledValues: wantsUpdatePrefilledValues && isLatestSet,
                }),
            );
        },
        [dispatch, isLatestSet, setIndex, wantsUpdatePrefilledValues],
    );

    const handleSetMinutes = useCallback(
        (value?: string) => {
            dispatch(
                handleMutateSet({
                    setIndex,
                    key: "durationMinutes",
                    value,
                    updatePrefilledValues: wantsUpdatePrefilledValues && isLatestSet,
                }),
            );
        },
        [dispatch, isLatestSet, setIndex, wantsUpdatePrefilledValues],
    );

    const handleSetDone = useCallback(() => {
        if (isActiveSet) {
            Keyboard.dismiss();
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            dispatch(markSetAsDone({ setIndex }));
        } else {
            handleSetActive();
        }
    }, [isActiveSet, dispatch, setIndex, handleSetActive]);

    const activeStackStyles = useMemo(() => {
        return { backgroundColor: isActiveSet ? inputFieldBackgroundColor : "transparent" };
    }, [inputFieldBackgroundColor, isActiveSet]);

    const computedTextfieldBackgroundColor = useMemo(() => {
        if (!isActiveSet) {
            if (isEditable) {
                return secondaryBackgroundColor;
            }
            return "transparent";
        }
        return secondaryBackgroundColor;
    }, [isActiveSet, isEditable, secondaryBackgroundColor]);

    const computedButtonBackgroundColor = useMemo(() => {
        if (!isActiveSet) {
            if (isEditable) {
                return componentBackgroundColor;
            }
            return "transparent";
        }
        return componentBackgroundColor;
    }, [componentBackgroundColor, isEditable, isActiveSet]);

    const computedColor = useMemo(() => {
        if (!isEditable) {
            if (isConfirmed) {
                return secondaryColor;
            }
            return textDisabled;
        }
        return mainColor;
    }, [isConfirmed, isEditable, mainColor, secondaryColor, textDisabled]);

    const textNumberStyles = useMemo(() => [styles.textNumber, { color: computedColor }], [computedColor]);
    const textInputStyles = useMemo(
        () => [styles.textInput, { backgroundColor: computedTextfieldBackgroundColor, color: computedColor }],
        [computedTextfieldBackgroundColor, computedColor],
    );
    const buttonStyles = useMemo(
        () => ({ width: 35, height: 35, paddingTop: 4, backgroundColor: computedButtonBackgroundColor }),
        [computedButtonBackgroundColor],
    );
    const iconStyle = useMemo(
        () => ({ color: isConfirmed ? "green" : isActiveSet ? primaryColor : textDisabled }),
        [isConfirmed, isActiveSet, primaryColor, textDisabled],
    );
    const playStyle = useMemo(
        () => ({ color: isConfirmed || isActiveSet || isLatestSet ? mainColor : textDisabled }),
        [isConfirmed, isActiveSet, isLatestSet, mainColor, textDisabled],
    );

    const confirmIcon = useMemo(() => {
        if (isActiveSet) {
            return "check";
        }
        if (isConfirmed) {
            return "restart";
        }
        if (isLatestSet && !isActiveSet) {
            return "arrow-left-bold";
        }
        return "check";
    }, [isActiveSet, isConfirmed, isLatestSet]);

    return (
        <HStack style={[styles.vStack, activeStackStyles]}>
            <View style={{ borderRadius, flex: 0.2, justifyContent: "center", alignItems: "center" }}>
                {isConfirmed && !isActiveSet ? (
                    <MaterialCommunityIcons size={24} style={iconStyle} name="check-bold" />
                ) : (
                    <Text ghost style={textNumberStyles}>
                        {setIndex + 1}
                    </Text>
                )}
            </View>
            <HStack stretch center gap ghost>
                {exercise?.type === "WEIGHT_BASED" ? (
                    <HStack stretch ghost gap>
                        <ThemedTextInput
                            editable={isEditable}
                            returnKeyType="done"
                            style={textInputStyles}
                            stretch
                            value={exercise?.type === "WEIGHT_BASED" ? weight : durationMinutes}
                            onChangeText={exercise?.type === "WEIGHT_BASED" ? handleSetWeight : handleSetMinutes}
                            textAlign="center"
                            inputMode="decimal"
                        />
                        <ThemedTextInput
                            editable={isEditable}
                            returnKeyType="done"
                            style={textInputStyles}
                            stretch
                            value={exercise?.type === "WEIGHT_BASED" ? reps : durationSeconds}
                            onChangeText={exercise?.type === "WEIGHT_BASED" ? handleSetReps : handleSetSeconds}
                            textAlign="center"
                            inputMode="decimal"
                        />
                    </HStack>
                ) : (
                    <TimeInputRow
                        background
                        hideSuffix
                        setMinutes={handleSetMinutes}
                        setSeconds={handleSetSeconds}
                        seconds={durationSeconds}
                        minutes={durationMinutes}
                    />
                )}
                <ThemedPressable center style={buttonStyles} round onPress={handleSetDone}>
                    <ThemedMaterialCommunityIcons ghost size={24} style={playStyle} name={confirmIcon} />
                </ThemedPressable>
            </HStack>
        </HStack>
    );
};
