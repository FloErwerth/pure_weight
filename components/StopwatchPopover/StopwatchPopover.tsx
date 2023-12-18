import { useAppSelector } from "../../store";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Animated, AppState, Dimensions, Easing, Pressable, View } from "react-native";
import StopWatch, { StopwatchTimerMethods } from "react-native-animated-stopwatch-timer";
import { useTheme } from "../../theme/context";
import { HStack } from "../Stack/HStack/HStack";
import { Button } from "../Themed/Button/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { stopWatchStyles, styles } from "./styles";
import { Temporal } from "@js-temporal/polyfill";
import { noop } from "lodash";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { AnimatedView } from "../Themed/AnimatedView/AnimatedView";
import { getPauseTime } from "../../store/reducers/workout/workoutSelectors";
import { getStopwatchSettings } from "../../store/reducers/settings/settingsSelectors";
import { emitter } from "../../utils/event";

const interval = setInterval(noop);

const useStopwatchRefs = () => {
    const fullStopwatchRef = useRef<StopwatchTimerMethods>(null);
    const smallStopwatchRef = useRef<StopwatchTimerMethods>(null);

    const start = useCallback(() => {
        fullStopwatchRef.current?.play();
        smallStopwatchRef.current?.play();
    }, []);

    const pause = useCallback(() => {
        fullStopwatchRef.current?.pause();
        smallStopwatchRef.current?.pause();
    }, []);

    const stop = useCallback(() => {
        fullStopwatchRef.current?.reset();
        smallStopwatchRef.current?.reset();
    }, []);

    const reset = useCallback(() => {
        fullStopwatchRef.current?.reset();
        smallStopwatchRef.current?.reset();
    }, []);

    const getSnapshot = useCallback(() => {
        return fullStopwatchRef.current?.getSnapshot() ?? 0;
    }, []);

    return useMemo(() => ({ fullStopwatchRef, smallStopwatchRef, start, pause, stop, getSnapshot, reset }), []);
};

export const StopwatchPopover = () => {
    const currentPauseTime = useAppSelector(getPauseTime);
    const opacity = useRef(new Animated.Value(0)).current;
    const iconOpacity = useRef(new Animated.Value(1)).current;
    const [timerStarted, setTimerStarted] = useState(false);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [timerPaused, setTimerPaused] = useState(false);
    const [timestamp, setTimestamp] = useState<number>(0);
    const [unmountTime, setUnmountTime] = useState<number>(0);
    const [showPopover, setShowPopover] = useState(false);
    const [buttonPos, setButtonPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const top = useRef(new Animated.Value(200)).current;
    const { fullStopwatchRef, smallStopwatchRef, start, pause, getSnapshot, reset } = useStopwatchRefs();
    const buttonRef = useRef<View>(null);
    const { mainColor, inputFieldBackgroundColor, textDisabled } = useTheme();
    const { startOnDoneSet, startOnLastSet } = useAppSelector(getStopwatchSettings);

    const handleTimerFinished = useCallback(() => {
        if ((getSnapshot() ?? 0) <= 30) {
            clearInterval(interval);
            setTimerStarted(false);
            setTimerPaused(false);
        }
    }, [getSnapshot]);

    useEffect(() => {
        if (!timerStarted && !timerPaused) {
            setRemainingTime(currentPauseTime);
        }
    }, [timerPaused, timerStarted, currentPauseTime]);

    const handleAppStateChange = useCallback(
        (state: AppState["currentState"]) => {
            if (timerStarted) {
                if (state === "inactive") {
                    setTimestamp(Temporal.Now.instant().epochMilliseconds);
                    setUnmountTime(getSnapshot() ?? 0);
                    pause();
                }
                if (state === "active") {
                    const timeDifference = Temporal.Now.instant().epochMilliseconds - timestamp;
                    const newTime = unmountTime - timeDifference;
                    if (unmountTime <= 0 || newTime <= 250) {
                        handleTimerFinished();
                        return;
                    }
                    setRemainingTime(newTime);
                }
            }
        },
        [getSnapshot, handleTimerFinished, pause, timerStarted, timestamp, unmountTime],
    );

    useEffect(() => {
        if (!timerStarted && showPopover && (getSnapshot() ?? 0) <= 5) {
            setRemainingTime(currentPauseTime);
            reset();
        }
    }, [currentPauseTime, getSnapshot, reset, showPopover, timerStarted]);

    useEffect(() => {
        if (timerStarted) {
            start();
        }
    }, [remainingTime, start, timerStarted]);

    const handleDoneSetCallback = useCallback(() => {
        if (startOnDoneSet && !timerStarted) {
            toggleTimer();
        }
    }, [startOnDoneSet]);

    const handleLastSetCallback = useCallback(() => {
        if (startOnLastSet) {
            reset();
            start();
        }
    }, [startOnLastSet]);

    useEffect(() => {
        emitter.addListener("workoutDoneSet", handleDoneSetCallback);
        emitter.addListener("workoutLastSet", handleLastSetCallback);

        return () => {
            emitter.removeListener("workoutDoneSet", handleDoneSetCallback);
            emitter.removeListener("workoutLastSet", handleLastSetCallback);
        };
    }, [handleDoneSetCallback, handleLastSetCallback]);

    useEffect(() => {
        AppState.addEventListener("change", handleAppStateChange);
    }, [handleAppStateChange]);

    useEffect(() => {
        if (showPopover) {
            if (!timerStarted && timestamp && timestamp <= 0) {
                setRemainingTime(currentPauseTime);
            }
        }
    }, [currentPauseTime, timestamp, showPopover, remainingTime, timerStarted]);

    const toggleTimer = useCallback(() => {
        if (timerStarted) {
            setTimestamp(getSnapshot() ?? 0);
            setTimerStarted(false);
            pause();
            clearInterval(interval);
            setTimerPaused(true);
        } else {
            setTimerPaused(false);
            setTimerStarted(true);
            start();
        }
    }, [getSnapshot, pause, start, timerStarted]);

    const togglePopover = useCallback(() => {
        setShowPopover(!showPopover);
    }, [showPopover]);

    const resetTimer = useCallback(() => {
        reset();
        setRemainingTime(currentPauseTime);
        setTimerStarted(false);
        setTimerPaused(false);
        clearInterval(interval);
    }, [currentPauseTime, reset]);

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

    const handleRewind15 = useCallback(() => {
        const currentTimeMilliseconds = getSnapshot();
        if (currentTimeMilliseconds !== undefined) {
            reset();
            setRemainingTime(currentTimeMilliseconds + 15 * 1000);
        }
    }, [getSnapshot, reset]);

    const handleFastForward15 = useCallback(() => {
        const currentTimeMilliseconds = getSnapshot();
        if (currentTimeMilliseconds !== undefined) {
            reset();
            setRemainingTime(currentTimeMilliseconds - 15 * 1000);
        }
    }, [getSnapshot, reset]);

    const animatedViewStyles = useMemo(
        () => ({
            backgroundColor: inputFieldBackgroundColor,
            height: 300,
            top,
            left: -buttonPos.x,
        }),
        [buttonPos.x, inputFieldBackgroundColor, top],
    );

    const separatorStyle = useMemo(
        () => ({
            color: mainColor,
        }),
        [mainColor],
    );

    const digitStyle = useMemo(() => [stopWatchStyles.digit, { color: mainColor }], [mainColor]);

    const fastForwardDisabled = (remainingTime ?? 0) <= 15000;
    const fastForwardColor = fastForwardDisabled ? textDisabled : mainColor;

    if (currentPauseTime === -404 || remainingTime === -404) {
        return null;
    }

    return (
        <View>
            <AnimatedView style={[styles.wrapper, animatedViewStyles]}>
                <HStack input style={styles.hStack}>
                    <Pressable disabled={fastForwardDisabled} onPress={handleFastForward15}>
                        <MaterialCommunityIcons size={40} color={fastForwardColor} name="rewind-15" />
                    </Pressable>
                    <StopWatch
                        animationDuration={0}
                        separatorStyle={separatorStyle}
                        containerStyle={stopWatchStyles.container}
                        digitStyle={digitStyle}
                        onFinish={handleTimerFinished}
                        mode="timer"
                        leadingZeros={2}
                        trailingZeros={0}
                        initialTimeInMs={remainingTime}
                        ref={fullStopwatchRef}
                    />
                    <Pressable onPress={handleRewind15}>
                        <MaterialCommunityIcons size={40} color={mainColor} name="fast-forward-15" />
                    </Pressable>
                </HStack>
                <HStack input style={styles.buttons}>
                    <Pressable onPress={toggleTimer}>
                        <MaterialCommunityIcons size={40} color={mainColor} name={timerStarted ? "pause-circle" : "play-circle"} />
                    </Pressable>
                    <Pressable onPress={resetTimer}>
                        <MaterialCommunityIcons size={40} color={mainColor} name="sync-circle" />
                    </Pressable>
                </HStack>
            </AnimatedView>

            <Button theme="secondary" onLayout={getButtonPos} reference={buttonRef} onPress={togglePopover}>
                <AnimatedView secondary style={{ opacity: iconOpacity, position: "absolute", alignItems: "center", width: "100%" }}>
                    <ThemedMaterialCommunityIcons secondary name="timer-outline" size={35} />
                </AnimatedView>
                <AnimatedView secondary style={{ opacity }}>
                    <StopWatch
                        animationDuration={0}
                        separatorStyle={separatorStyle}
                        containerStyle={stopWatchStyles.container}
                        digitStyle={{ fontSize: 35, textAlign: "center", color: mainColor }}
                        mode="timer"
                        leadingZeros={2}
                        trailingZeros={0}
                        initialTimeInMs={remainingTime}
                        ref={smallStopwatchRef}
                    />
                </AnimatedView>
            </Button>
        </View>
    );
};
