import { useAppSelector } from "../../store";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Pressable, View } from "react-native";
import { useTheme } from "../../theme/context";
import { HStack } from "../Stack/HStack/HStack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { AnimatedView } from "../Themed/AnimatedView/AnimatedView";
import { getStopwatchSettings } from "../../store/reducers/settings/settingsSelectors";
import { emitter } from "../../utils/event";
import BackgroundTimer from "react-native-background-timer";
import { StopwatchDisplay } from "./StopwatchDisplay/StopwatchDisplay";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ThemedView } from "../Themed/ThemedView/View";
import { useScheduleNotification } from "../../hooks/useScheduleNotification";
import { useTranslation } from "react-i18next";

const UPDATE_INTERVAL = 1000;
let id: number = 0;

const useStopwatch = () => {
    const currentPauseTime = 1000;
    const [remainingTime, setRemainingTime] = useState<number>(currentPauseTime);
    const [timerStarted, setTimerStarted] = useState(false);
    const { t } = useTranslation();
    const showNotification = useScheduleNotification({ title: t("stopwatch_pause_notification_title"), body: t("stopwatch_pause_notification_text") });

    const startTimer = useCallback(() => {
        setTimerStarted(true);
        id = BackgroundTimer.setInterval(update, UPDATE_INTERVAL);
    }, []);

    const stopTimer = useCallback(() => {
        BackgroundTimer.clearInterval(id);
        setTimerStarted(false);
    }, []);

    const reset = useCallback(() => {
        stopTimer();
        setRemainingTime(currentPauseTime);
    }, []);

    const update = useCallback(() => {
        setRemainingTime((remainingTime) => {
            if (remainingTime <= 0) {
                reset();
                void showNotification();
                return 0;
            }
            return remainingTime - UPDATE_INTERVAL;
        });
    }, [remainingTime]);

    useEffect(() => {
        if (!timerStarted) {
            setRemainingTime(currentPauseTime);
        }
    }, [currentPauseTime]);

    return useMemo(
        () => ({
            timerStarted,
            remainingTime,
            startTimer,
            stopTimer,
            reset,
        }),
        [timerStarted, remainingTime, reset],
    );
};

export const StopwatchPopover = () => {
    const opacity = useRef(new Animated.Value(0)).current;
    const iconOpacity = useRef(new Animated.Value(1)).current;
    const [showPopover, setShowPopover] = useState(false);
    const [buttonPos, setButtonPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const top = useRef(new Animated.Value(200)).current;
    const { timerStarted, reset, remainingTime, stopTimer, startTimer } = useStopwatch();
    const buttonRef = useRef<View>(null);
    const { mainColor, inputFieldBackgroundColor, textDisabled } = useTheme();
    const { startOnDoneSet, startOnLastSet } = useAppSelector(getStopwatchSettings);

    const toggleTimer = useCallback(() => {
        if (timerStarted) {
            stopTimer();
        } else {
            startTimer();
        }
    }, [timerStarted]);

    const handleDoneSetCallback = useCallback(() => {
        if (startOnDoneSet && !timerStarted) {
            toggleTimer();
        }
    }, [startOnDoneSet, timerStarted, toggleTimer]);

    const handleLastSetCallback = useCallback(() => {
        if (startOnLastSet && !timerStarted) {
            toggleTimer();
        }
    }, [startOnLastSet, timerStarted, toggleTimer]);

    useEffect(() => {
        emitter.addListener("workoutDoneSet", handleDoneSetCallback);
        emitter.addListener("workoutLastSet", handleLastSetCallback);

        return () => {
            emitter.removeListener("workoutDoneSet", handleDoneSetCallback);
            emitter.removeListener("workoutLastSet", handleLastSetCallback);
        };
    }, [handleDoneSetCallback, handleLastSetCallback]);

    const togglePopover = useCallback(() => {
        setShowPopover(!showPopover);
    }, [showPopover]);

    const getButtonPos = useCallback(() => {
        buttonRef.current?.measureInWindow((x, y) => {
            setButtonPos({ x, y });
        });
    }, []);

    useLayoutEffect(() => {
        if (showPopover) {
            getButtonPos();
            Animated.parallel([
                Animated.timing(top, {
                    toValue: buttonPos.y - Dimensions.get("screen").height - 50,
                    useNativeDriver: false,
                    easing: Easing.inOut(Easing.ease),
                    duration: 400,
                }),
                Animated.timing(iconOpacity, {
                    toValue: 1,
                    useNativeDriver: true,

                    duration: 200,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    useNativeDriver: true,
                    duration: 200,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: !timerStarted ? 0 : 1,
                    useNativeDriver: true,
                    delay: 200,
                    duration: 200,
                }),
                Animated.timing(iconOpacity, {
                    toValue: !timerStarted ? 1 : 0,
                    useNativeDriver: true,
                    delay: 200,
                    duration: 200,
                }),
                Animated.timing(top, {
                    toValue: Dimensions.get("screen").height - buttonPos.y,
                    useNativeDriver: false,
                    easing: Easing.inOut(Easing.ease),
                    duration: 300,
                }),
            ]).start();
        }
    }, [buttonPos.y, getButtonPos, showPopover, top, buttonPos.x, opacity, iconOpacity, timerStarted]);

    const animatedViewStyles = useMemo(
        () => ({
            backgroundColor: inputFieldBackgroundColor,
            height: 300,
            top,
            left: -buttonPos.x,
        }),
        [buttonPos.x, inputFieldBackgroundColor, top],
    );

    if (remainingTime === -404) {
        return null;
    }

    return (
        <ThemedView ghost>
            <AnimatedView style={[styles.wrapper, animatedViewStyles]}>
                <HStack input style={styles.hStack}>
                    <StopwatchDisplay textSize={50} remainingTime={remainingTime} />
                </HStack>
                <HStack input style={styles.buttons}>
                    <Pressable onPress={toggleTimer}>
                        <MaterialCommunityIcons size={40} color={mainColor} name={timerStarted ? "pause-circle" : "play-circle"} />
                    </Pressable>
                    <Pressable onPress={reset}>
                        <MaterialCommunityIcons size={40} color={mainColor} name="sync-circle" />
                    </Pressable>
                </HStack>
            </AnimatedView>

            <ThemedPressable padding round secondary onLayout={getButtonPos} reference={buttonRef} onPress={togglePopover}>
                <AnimatedView ghost style={{ opacity: iconOpacity, position: "absolute", left: 10, top: 10, alignItems: "center", width: "100%" }}>
                    <ThemedMaterialCommunityIcons secondary name="timer-outline" size={35} />
                </AnimatedView>
                <AnimatedView secondary style={{ opacity, width: 100 }}>
                    <StopwatchDisplay textSize={35} remainingTime={remainingTime} />
                </AnimatedView>
            </ThemedPressable>
        </ThemedView>
    );
};
