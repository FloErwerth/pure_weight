import { useAppSelector } from "../../store";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Pressable, View } from "react-native";
import { useTheme } from "../../theme/context";
import { HStack } from "../Stack/HStack/HStack";
import { styles } from "./styles";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { AnimatedView } from "../Themed/AnimatedView/AnimatedView";
import { getStopwatchSettings } from "../../store/reducers/settings/settingsSelectors";
import { emitter } from "../../utils/event";
import { StopwatchDisplay } from "./StopwatchDisplay/StopwatchDisplay";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ThemedView } from "../Themed/ThemedView/View";
import { getPauseTime } from "../../store/reducers/workout/workoutSelectors";
import { useStopwatch } from "../../hooks/useStopwatch";

export const StopwatchPopover = () => {
    const pauseTime = useAppSelector(getPauseTime);
    const opacity = useRef(new Animated.Value(0)).current;
    const iconOpacity = useRef(new Animated.Value(1)).current;
    const [showPopover, setShowPopover] = useState(false);
    const [buttonPos, setButtonPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const top = useRef(new Animated.Value(100)).current;
    const { timerStarted, reset, remainingTime, stopTimer, startTimer } = useStopwatch(pauseTime);
    const buttonRef = useRef<View>(null);
    const { inputFieldBackgroundColor } = useTheme();
    const { startOnDoneSet } = useAppSelector(getStopwatchSettings);

    const toggleTimer = useCallback(() => {
        if (timerStarted) {
            stopTimer();
        } else {
            startTimer();
        }
    }, [startTimer, stopTimer, timerStarted]);

    const handleDoneSetCallback = useCallback(() => {
        if (startOnDoneSet) {
            reset();
            startTimer();
        }
    }, [startOnDoneSet, timerStarted, toggleTimer]);

    useEffect(() => {
        emitter.addListener("workoutDoneSet", handleDoneSetCallback);

        return () => {
            emitter.removeListener("workoutDoneSet", handleDoneSetCallback);
        };
    }, [handleDoneSetCallback]);

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

    const handleClickOutside = useCallback(() => {
        if (showPopover) {
            togglePopover();
        }
    }, [showPopover, togglePopover]);

    if (remainingTime === -404) {
        return null;
    }

    return (
        <>
            <Pressable
                onPress={handleClickOutside}
                style={{
                    position: "absolute",
                    left: -10,
                    bottom: 0,
                    width: Dimensions.get("screen").width,
                    height: Dimensions.get("screen").height / 2,
                    pointerEvents: showPopover ? "auto" : "none",
                }}
            />
            <ThemedView ghost>
                <AnimatedView style={[styles.wrapper, animatedViewStyles]}>
                    <HStack input style={styles.hStack}>
                        <StopwatchDisplay textSize={50} remainingTime={remainingTime} />
                    </HStack>
                    <HStack input style={styles.buttons}>
                        <Pressable onPress={toggleTimer}>
                            <ThemedMaterialCommunityIcons ghost size={40} name={timerStarted ? "pause-circle" : "play-circle"} />
                        </Pressable>
                        <Pressable onPress={reset}>
                            <ThemedMaterialCommunityIcons ghost size={40} name="sync-circle" />
                        </Pressable>
                    </HStack>
                </AnimatedView>

                <ThemedPressable padding round secondary onLayout={getButtonPos} reference={buttonRef} onPress={togglePopover}>
                    <AnimatedView
                        ghost
                        style={{ opacity: iconOpacity, position: "absolute", left: 10, top: 10, alignItems: "center", width: "100%" }}>
                        <ThemedMaterialCommunityIcons secondary name="timer-outline" size={35} />
                    </AnimatedView>
                    <AnimatedView secondary style={{ opacity, width: 100 }}>
                        <StopwatchDisplay textSize={35} remainingTime={remainingTime} />
                    </AnimatedView>
                </ThemedPressable>
            </ThemedView>
        </>
    );
};
