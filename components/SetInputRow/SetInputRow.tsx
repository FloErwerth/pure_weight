import { Keyboard, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HStack } from "../Stack/HStack/HStack";
import { Center } from "../Center/Center";
import { Text } from "../Themed/ThemedText/Text";
import { borderRadius } from "../../theme/border";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useTheme } from "../../theme/context";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import * as Haptics from "expo-haptics";
import { handleMutateSet, markSetAsDone } from "../../store/reducers/workout";
import { getSetData } from "../../store/reducers/workout/workoutSelectors";
import { ThemedPressable } from "../Themed/Pressable/Pressable";

interface SetInputRowProps {
    setIndex: number;
    exerciseIndex: number;
}

export const SetInputRow = ({ setIndex, exerciseIndex }: SetInputRowProps) => {
    const { primaryColor, mainColor, secondaryInputFieldBackgroundColor, secondaryBackgroundColor, componentBackgroundColor, inputFieldBackgroundColor, textDisabled } = useTheme();
    const { isConfirmed, isEditable, weight, isActiveSet, reps } = useAppSelector((state: AppState) => getSetData(state, setIndex, exerciseIndex));
    const dispatch = useAppDispatch();
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (setIndex === 0) {
            setIsFocused(true);
        }
    }, []);

    const handleSetWeight = useCallback(
        (newWeight?: string) => {
            dispatch(handleMutateSet({ setIndex, key: "weight", value: newWeight }));
        },
        [dispatch, setIndex],
    );

    const handleSetReps = useCallback(
        (newReps?: string) => {
            dispatch(handleMutateSet({ setIndex, key: "reps", value: newReps }));
        },
        [dispatch, setIndex],
    );

    const handleSetDone = useCallback(() => {
        Keyboard.dismiss();
        if (weight && reps) {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            dispatch(handleMutateSet({ setIndex, key: "weight", value: weight }));
            dispatch(handleMutateSet({ setIndex, key: "reps", value: reps }));
            dispatch(markSetAsDone({ setIndex }));
            setIsFocused(false);
        }
    }, [dispatch, reps, setIndex, weight]);

    const activeStackStyles = useMemo(() => {
        const getBackgroundColor = () => {
            if (isFocused && isActiveSet) {
                return inputFieldBackgroundColor;
            }
            if (isFocused && !isActiveSet) {
                return secondaryInputFieldBackgroundColor;
            }
            return "transparent";
        };
        const getBorderColor = () => {
            if (isActiveSet && !isFocused) {
                return secondaryInputFieldBackgroundColor;
            }
            return "transparent";
        };
        return { backgroundColor: getBackgroundColor(), borderColor: getBorderColor(), borderWidth: 2 };
    }, [inputFieldBackgroundColor, isActiveSet, isFocused, secondaryInputFieldBackgroundColor]);

    const computedTextfieldBackgroundColor = useMemo(() => {
        if (!isFocused) {
            if (isEditable) {
                return secondaryBackgroundColor;
            }
            return "transparent";
        }
        return secondaryBackgroundColor;
    }, [isEditable, isFocused, secondaryBackgroundColor]);

    const computedButtonBackgroundColor = useMemo(() => {
        if (!isFocused) {
            if (isEditable) {
                return componentBackgroundColor;
            }
            return "transparent";
        }
        return componentBackgroundColor;
    }, [componentBackgroundColor, isEditable, isFocused]);

    const computedColor = useMemo(() => {
        if (!isEditable) {
            return textDisabled;
        }
        return mainColor;
    }, [isEditable, mainColor, textDisabled]);

    const textNumberStyles = useMemo(() => [styles.textNumber, { color: computedColor }], [computedColor]);
    const textInputStyles = useMemo(() => [styles.textInput, { backgroundColor: computedTextfieldBackgroundColor, color: computedColor }], [computedTextfieldBackgroundColor, computedColor]);
    const buttonStyles = useMemo(() => ({ ...styles.button, ...{ backgroundColor: computedButtonBackgroundColor } }), [computedButtonBackgroundColor]);
    const iconStyle = useMemo(() => ({ color: isConfirmed ? "green" : isFocused ? primaryColor : textDisabled }), [isConfirmed, isFocused, primaryColor, textDisabled]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    return (
        <HStack style={[styles.vStack, activeStackStyles]}>
            <Center style={styles.numberCenter}>
                <View style={{ borderRadius }}>
                    <Text ghost style={textNumberStyles}>
                        {setIndex + 1}
                    </Text>
                </View>
            </Center>
            <HStack ghost stretch style={styles.inputStack}>
                <Center style={styles.center}>
                    <ThemedTextInput
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onStartShouldSetResponder={() => true}
                        editable={isEditable}
                        returnKeyType="done"
                        style={textInputStyles}
                        value={weight}
                        onChangeText={handleSetWeight}
                        textAlign="center"
                        inputMode="decimal"
                    />
                </Center>
                <Center style={styles.center}>
                    <ThemedTextInput
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        editable={isEditable}
                        returnKeyType="done"
                        style={textInputStyles}
                        value={reps}
                        onChangeText={handleSetReps}
                        textAlign="center"
                        inputMode="decimal"
                    />
                </Center>
                <Center style={styles.center}>
                    <ThemedPressable disabled={!isEditable} style={buttonStyles} onPress={handleSetDone}>
                        <MaterialCommunityIcons size={24} style={iconStyle} name="check-bold" />
                    </ThemedPressable>
                </Center>
            </HStack>
        </HStack>
    );
};
