import { Keyboard, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import { HStack } from "../../Stack/HStack/HStack";
import { Center } from "../../Center/Center";
import { Text } from "../../Themed/ThemedText/Text";
import { borderRadius } from "../../../theme/border";
import { ThemedTextInput } from "../../Themed/ThemedTextInput/ThemedTextInput";
import { useTheme } from "../../../theme/context";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import * as Haptics from "expo-haptics";
import { handleMutateSet, markSetAsDone, setIsActiveSet } from "../../../store/reducers/workout";
import { getIsActiveSet, getIsLastSet, getSetData } from "../../../store/reducers/workout/workoutSelectors";
import { ThemedPressable } from "../../Themed/Pressable/Pressable";
import { emitter } from "../../../utils/event";

interface SetInputRowProps {
    setIndex: number;
    exerciseIndex: number;
}

export const WeightBasedSetInput = ({ setIndex, exerciseIndex }: SetInputRowProps) => {
    const { primaryColor, mainColor, secondaryBackgroundColor, componentBackgroundColor, inputFieldBackgroundColor, textDisabled } = useTheme();
    const data = useAppSelector((state: AppState) => getSetData(state, setIndex))?.[exerciseIndex];
    const isLastSetGetter = useAppSelector((state: AppState) => getIsLastSet(state, exerciseIndex));
    const { isLatestSet, weight, reps, isEditable, isConfirmed } = data ?? {};
    const isActiveSet = useAppSelector((state: AppState) => getIsActiveSet(state, exerciseIndex, setIndex));

    const dispatch = useAppDispatch();
    const handleSetActive = useCallback(() => {
        if (!isActiveSet) {
            dispatch(setIsActiveSet({ setIndex }));
        }
    }, [dispatch, isActiveSet, setIndex]);

    const handleSetWeight = useCallback(
        (newWeight?: string) => {
            dispatch(handleMutateSet({ setIndex, key: "weight", value: newWeight, type: "WEIGHT_BASED" }));
            if (!isActiveSet) {
                handleSetActive();
            }
        },
        [dispatch, handleSetActive, isActiveSet, setIndex],
    );

    const handleSetReps = useCallback(
        (newReps?: string) => {
            dispatch(handleMutateSet({ setIndex, key: "reps", value: newReps, type: "WEIGHT_BASED" }));
            if (!isActiveSet) {
                dispatch(setIsActiveSet({ setIndex }));
            }
        },
        [dispatch, isActiveSet, setIndex],
    );

    const handleToggle = useCallback(() => {
        if (isActiveSet) {
            Keyboard.dismiss();
            if (weight && reps) {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                dispatch(handleMutateSet({ setIndex, key: "weight", value: weight, type: "WEIGHT_BASED" }));
                dispatch(handleMutateSet({ setIndex, key: "reps", value: reps, type: "WEIGHT_BASED" }));
                dispatch(markSetAsDone({ setIndex }));

                if (isLastSetGetter(setIndex)) {
                    emitter.emit("workoutLastSet");
                } else {
                    emitter.emit("workoutDoneSet");
                }
            }
        } else {
            handleSetActive();
        }
    }, [isActiveSet, weight, reps, dispatch, setIndex, isLastSetGetter, handleSetActive]);

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
            return textDisabled;
        }
        return mainColor;
    }, [isEditable, mainColor, textDisabled]);

    const textNumberStyles = useMemo(() => [styles.textNumber, { color: computedColor }], [computedColor]);
    const textInputStyles = useMemo(() => [styles.textInput, { backgroundColor: computedTextfieldBackgroundColor, color: computedColor }], [computedTextfieldBackgroundColor, computedColor]);
    const buttonStyles = useMemo(() => [styles.button, { backgroundColor: computedButtonBackgroundColor }], [computedButtonBackgroundColor]);
    const iconStyle = useMemo(() => ({ color: isConfirmed ? "green" : isActiveSet ? primaryColor : textDisabled }), [isConfirmed, isActiveSet, primaryColor, textDisabled]);
    const playStyle = useMemo(() => ({ color: isConfirmed || isActiveSet || isLatestSet ? mainColor : textDisabled }), [isConfirmed, mainColor, isActiveSet, textDisabled]);

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
    }, [isActiveSet, isConfirmed]);

    return (
        <HStack style={[styles.vStack, activeStackStyles]}>
            <Center style={styles.numberCenter}>
                <View style={{ borderRadius }}>
                    {isConfirmed && !isActiveSet ? (
                        <MaterialCommunityIcons size={24} style={iconStyle} name="check-bold" />
                    ) : (
                        <Text ghost style={textNumberStyles}>
                            {setIndex + 1}
                        </Text>
                    )}
                </View>
            </Center>
            <HStack ghost stretch style={styles.inputStack}>
                <Center style={styles.center}>
                    <ThemedTextInput editable={isEditable} returnKeyType="done" style={textInputStyles} value={weight} onChangeText={handleSetWeight} textAlign="center" inputMode="decimal" />
                </Center>
                <Center style={styles.center}>
                    <ThemedTextInput editable={isEditable} returnKeyType="done" style={textInputStyles} value={reps} onChangeText={handleSetReps} textAlign="center" inputMode="decimal" />
                </Center>
                <Center style={styles.center}>
                    <ThemedPressable disabled={!isEditable} style={buttonStyles} onPress={handleToggle}>
                        <MaterialCommunityIcons size={24} style={playStyle} name={confirmIcon} />
                    </ThemedPressable>
                </Center>
            </HStack>
        </HStack>
    );
};
