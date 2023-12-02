import { Keyboard, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import { HStack } from "../Stack/HStack/HStack";
import { Button } from "../Themed/Button/Button";
import { Center } from "../Center/Center";
import { Text } from "../Themed/ThemedText/Text";
import { borderRadius } from "../../theme/border";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useTheme } from "../../theme/context";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import * as Haptics from "expo-haptics";
import { handleMutateSet, markSetAsDone } from "../../store/reducers/workout";
import { getSetData } from "../../store/reducers/workout/workoutSelectors";

interface SetInputRowProps {
    setIndex: number;
    exerciseIndex: number;
}

export const SetInputRow = ({ setIndex, exerciseIndex }: SetInputRowProps) => {
    const { primaryColor, mainColor, secondaryBackgroundColor, componentBackgroundColor, inputFieldBackgroundColor, textDisabled } = useTheme();
    const { isEditable, isActiveSet, hasData, weight, reps } = useAppSelector((state: AppState) => getSetData(state, setIndex, exerciseIndex));
    const dispatch = useAppDispatch();
    const handleSetWeight = useCallback(
        (weight?: string) => {
            dispatch(handleMutateSet({ setIndex, key: "weight", value: weight }));
        },
        [dispatch, setIndex],
    );

    const handleSetReps = useCallback(
        (reps?: string) => {
            dispatch(handleMutateSet({ setIndex, key: "reps", value: reps }));
        },
        [dispatch, setIndex],
    );

    const handleSetDone = useCallback(() => {
        if (isActiveSet) {
            Keyboard.dismiss();
            if (weight && reps) {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                dispatch(markSetAsDone({ setIndex }));
            }
        }
    }, [dispatch, isActiveSet, reps, setIndex, weight]);

    const activeStackStyles = useMemo(() => ({ backgroundColor: isActiveSet ? inputFieldBackgroundColor : "transparent" }), [inputFieldBackgroundColor, isActiveSet]);

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
    }, [componentBackgroundColor, isActiveSet, isEditable]);

    const computedColor = useMemo(() => {
        if (!isEditable) {
            return textDisabled;
        }
        return mainColor;
    }, [isEditable, mainColor, textDisabled]);

    const textNumberStyles = useMemo(() => [styles.textNumber, { color: computedColor }], [computedColor]);
    const textInputStyles = useMemo(() => [styles.textInput, { backgroundColor: computedTextfieldBackgroundColor, color: computedColor }], [computedTextfieldBackgroundColor, computedColor]);
    const buttonStyles = useMemo(() => ({ button: { ...styles.button, ...{ backgroundColor: computedButtonBackgroundColor } } }), [computedButtonBackgroundColor]);
    const iconStyle = useMemo(() => ({ color: hasData ? "green" : isActiveSet ? primaryColor : textDisabled }), [hasData, isActiveSet, primaryColor, textDisabled]);

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
                    <ThemedTextInput editable={isEditable} returnKeyType="done" style={textInputStyles} value={reps} onChangeText={handleSetReps} textAlign="center" inputMode="decimal" />
                </Center>
                <Center style={styles.center}>
                    <Button disabled={!isEditable} style={buttonStyles} onPress={handleSetDone}>
                        <MaterialCommunityIcons size={24} style={iconStyle} name="check-bold" />
                    </Button>
                </Center>
            </HStack>
        </HStack>
    );
};
