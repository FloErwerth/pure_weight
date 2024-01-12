import { Animated, Keyboard, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { HStack } from "../../Stack/HStack/HStack";
import { Center } from "../../Center/Center";
import { Text } from "../../Themed/ThemedText/Text";
import { borderRadius } from "../../../theme/border";
import { useTheme } from "../../../theme/context";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import * as Haptics from "expo-haptics";
import { handleMutateSet, markSetAsDone, setIsActiveSet } from "../../../store/reducers/workout";
import { getIsActiveSet, getIsLastSet, getSetData } from "../../../store/reducers/workout/workoutSelectors";
import { ThemedPressable } from "../../Themed/Pressable/Pressable";
import { emitter } from "../../../utils/event";
import { useTimeDisplay } from "../../../hooks/useTimeDisplay";
import { useStopwatch } from "../../../hooks/useStopwatch";
import { TimeInput } from "../../../store/reducers/workout/types";
import { ThemedView } from "../../Themed/ThemedView/View";
import { AnimatedView } from "../../Themed/AnimatedView/AnimatedView";

interface SetInputRowProps {
    setIndex: number;
    exerciseIndex: number;
}

const getMillisecondsFromDuration = (duration?: TimeInput) => {
    if (duration) {
        const { minutes, seconds } = duration;
        const minutesInt = parseInt(minutes ?? "0");
        const secondsInt = parseInt(seconds ?? "0");
        return (minutesInt * 60 + secondsInt) * 1000;
    }
    return 0;
};

export const TimeBasedSetInput = ({ setIndex, exerciseIndex }: SetInputRowProps) => {
    const { mainColor, warningColor, primaryColor, secondaryBackgroundColor, componentBackgroundColor, inputFieldBackgroundColor, textDisabled } = useTheme();
    const data = useAppSelector((state: AppState) => getSetData(state, setIndex))?.[exerciseIndex];
    const isLastSetGetter = useAppSelector((state: AppState) => getIsLastSet(state, exerciseIndex));
    const { isLatestSet, reps, isEditable, isConfirmed, duration, preparation } = data ?? {};
    const dispatch = useAppDispatch();
    const isActiveSet = useAppSelector((state: AppState) => getIsActiveSet(state, exerciseIndex, setIndex));

    const handleSetDone = useCallback(() => {
        Keyboard.dismiss();
        if (duration && reps) {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            dispatch(markSetAsDone({ setIndex }));
            dispatch(handleMutateSet({ setIndex, key: "duration", value: getMillisecondsFromDuration(duration).toString() }));

            if (isLastSetGetter(setIndex)) {
                emitter.emit("workoutLastSet");
            } else {
                emitter.emit("workoutDoneSet");
            }
        }
    }, [duration, reps, dispatch, setIndex, isLastSetGetter]);

    const { timerStarted, remainingTime, startTimer, reset } = useStopwatch(getMillisecondsFromDuration(duration) + getMillisecondsFromDuration(preparation), {
        onTimerDone: handleSetDone,
    });

    const isInPreparation = useMemo(() => remainingTime > getMillisecondsFromDuration(duration), [duration, remainingTime]);

    const timeDisplay = useTimeDisplay(getMillisecondsFromDuration(duration));
    const prepartionDisplay = useTimeDisplay(getMillisecondsFromDuration(preparation));
    const overallTimeDisplay = useTimeDisplay(isInPreparation ? remainingTime - getMillisecondsFromDuration(duration) : remainingTime);

    const handleReset = useCallback(() => {
        dispatch(handleMutateSet({ setIndex, key: "duration", value: undefined }));
        dispatch(setIsActiveSet({ setIndex }));
        reset();
    }, [dispatch, reset, setIndex]);

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

    const textColor = useMemo(() => {
        if (isConfirmed) {
            return "green";
        }
        if (!isEditable) {
            return textDisabled;
        }
        return mainColor;
    }, [isConfirmed, isEditable, mainColor, textDisabled]);

    const setNumberColor = useMemo(() => {
        if (!isEditable) {
            return textDisabled;
        }
        return mainColor;
    }, [isEditable, mainColor, textDisabled]);

    const textNumberStyles = useMemo(() => [styles.textNumber, { color: setNumberColor }], [textColor]);
    const textInputStyles = useMemo(() => [styles.textInput, { backgroundColor: computedTextfieldBackgroundColor, color: textColor }], [computedTextfieldBackgroundColor, textColor]);
    const buttonStyles = useMemo(() => [styles.button, { backgroundColor: computedButtonBackgroundColor }], [computedButtonBackgroundColor]);
    const playStyle = useMemo(() => ({ color: isConfirmed || isActiveSet || isLatestSet ? mainColor : textDisabled }), [isConfirmed, mainColor, isActiveSet, textDisabled]);
    const preparationTop = useRef(new Animated.Value(9)).current;
    const durationTop = useRef(new Animated.Value(5)).current;
    const preparationFontSize = useRef(new Animated.Value(20)).current;
    const durationFontSize = useRef(new Animated.Value(16)).current;

    const preparationValue = useMemo(() => {
        if (preparation) {
            if (timerStarted && isInPreparation) {
                return `${overallTimeDisplay}`;
            }
            return `${prepartionDisplay}`;
        }
        return undefined;
    }, [isInPreparation, overallTimeDisplay, preparation, prepartionDisplay, timerStarted]);

    const durationValue = useMemo(() => {
        if (duration) {
            if (timerStarted && !isInPreparation) {
                return `${overallTimeDisplay}`;
            }
            return `${timeDisplay}`;
        }
    }, [duration, isInPreparation, overallTimeDisplay, timeDisplay, timerStarted]);

    const playIcon = useMemo(() => {
        if (timerStarted) {
            return "stop";
        } else {
            if (isActiveSet) {
                return "play";
            }
            if (isLatestSet) {
                return "arrow-left-bold";
            }
            if (isConfirmed && !isActiveSet) {
                return "restart";
            }
        }
        return "play";
    }, [isActiveSet, isLatestSet, isConfirmed, timerStarted]);

    useEffect(() => {
        if (isInPreparation) {
            Animated.parallel([
                Animated.timing(preparationTop, {
                    toValue: 8,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(durationTop, {
                    toValue: 8,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(preparationFontSize, {
                    toValue: 20,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(durationFontSize, {
                    toValue: 16,
                    duration: 200,
                    useNativeDriver: false,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(preparationTop, {
                    toValue: -8,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(durationTop, {
                    toValue: -8,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(preparationFontSize, {
                    toValue: 16,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(durationFontSize, {
                    toValue: 20,
                    duration: 200,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [isInPreparation]);

    const animatedPreparationStyles = useMemo(() => ({ top: preparationTop }), [preparationTop]);
    const animatedDurationStyles = useMemo(() => ({ top: durationTop }), [durationTop]);
    const prepareColorAnimation = useMemo(() => preparationTop.interpolate({ inputRange: [0, 9], outputRange: ["black", mainColor] }), [preparationTop, warningColor]);
    const durationColorAnimation = useMemo(() => durationTop.interpolate({ inputRange: [-5, 5], outputRange: [mainColor, "black"] }), [durationTop, mainColor]);

    const preparationTextStyles = useMemo(
        () =>
            ({
                textAlign: "center",
                color: isEditable ? prepareColorAnimation : textDisabled,
                fontSize: preparationFontSize,
            }) as const,
        [isEditable, preparationFontSize, prepareColorAnimation, textDisabled],
    );

    const trainTextStyles = useMemo(
        () =>
            ({
                fontSize: durationFontSize,
                textAlign: "center",
                color: isEditable ? durationColorAnimation : textDisabled,
            }) as const,
        [durationColorAnimation, durationFontSize, isEditable, textDisabled],
    );

    const handleToggleTimer = useCallback(() => {
        if (!isActiveSet) {
            handleReset();
            return;
        }
        if (timerStarted) {
            reset();
        } else {
            startTimer();
        }
    }, [isActiveSet, handleReset, reset, startTimer, timerStarted]);

    const iconStyle = useMemo(() => ({ color: isConfirmed ? "green" : isActiveSet ? primaryColor : textDisabled }), [isConfirmed, isActiveSet, primaryColor, textDisabled]);

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
                <ThemedView stretch round style={textInputStyles}>
                    <AnimatedView style={animatedPreparationStyles} ghost>
                        <Animated.Text style={preparationTextStyles}>{preparationValue}</Animated.Text>
                    </AnimatedView>
                    <AnimatedView style={animatedDurationStyles} ghost>
                        <Animated.Text style={trainTextStyles}>{durationValue}</Animated.Text>
                    </AnimatedView>
                </ThemedView>
                <HStack ghost style={styles.controlsWrapper}>
                    <ThemedPressable disabled={!isEditable} style={buttonStyles} onPress={handleToggleTimer}>
                        <MaterialCommunityIcons size={24} style={playStyle} name={playIcon} />
                    </ThemedPressable>
                </HStack>
            </HStack>
        </HStack>
    );
};
