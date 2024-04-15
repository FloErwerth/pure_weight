import { useAppSelector } from "../../store";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { HStack } from "../Stack/HStack/HStack";
import { styles } from "./styles";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { AnimatedView } from "../Themed/AnimatedView/AnimatedView";
import { getStopwatchSettings } from "../../store/selectors/settings/settingsSelectors";
import { emitter } from "../../utils/event";
import { StopwatchDisplay } from "./StopwatchDisplay/StopwatchDisplay";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ThemedView } from "../Themed/ThemedView/View";
import { getPauseTime } from "../../store/selectors/workout/workoutSelectors";
import { useStopwatch } from "../../hooks/useStopwatch";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";
import { SNAP_POINTS } from "../../constants/snapPoints";

export const StopwatchPopover = () => {
    const pauseTime = useAppSelector(getPauseTime);
    const opacity = useRef(new Animated.Value(0)).current;
    const iconOpacity = useRef(new Animated.Value(1)).current;
    const [showPopover, setShowPopover] = useState(false);
    const { ref: stopwatchRef, openBottomSheet, closeBottomSheet } = useBottomSheetRef();
    const { timerStarted, reset, remainingTime, stopTimer, startTimer, rewind15Seconds, fastForward15Seconds } = useStopwatch(pauseTime);
    const buttonRef = useRef<View>(null);
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
    }, [reset, startOnDoneSet, startTimer]);

    useEffect(() => {
        emitter.addListener("workoutDoneSet", handleDoneSetCallback);
        return () => {
            emitter.removeListener("workoutDoneSet", handleDoneSetCallback);
        };
    }, [handleDoneSetCallback]);

    const togglePopover = useCallback(() => {
        if (remainingTime === -404) {
            return;
        }

        setShowPopover(!showPopover);
        if (showPopover) {
            closeBottomSheet();
        } else {
            openBottomSheet();
        }
    }, [closeBottomSheet, openBottomSheet, remainingTime, showPopover]);

    useEffect(() => {
        if (showPopover) {
            Animated.parallel([
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
            ]).start();
        }
    }, [showPopover, opacity, iconOpacity, timerStarted]);

    const popoverStyle = useMemo(
        () =>
            ({
                opacity: iconOpacity,
                position: "absolute",
                left: 10,
                top: 7,
                alignItems: "center",
                width: "100%",
            }) as const,
        [iconOpacity],
    );

    const displayStyle = useMemo(() => ({ opacity, width: 100 }) as const, [opacity]);

    return (
        <>
            <ThemedView ghost>
                <ThemedBottomSheetModal snapPoints={SNAP_POINTS["25"]} onRequestClose={togglePopover} ref={stopwatchRef}>
                    <HStack ghost style={styles.hStack}>
                        <ThemedPressable style={styles.timeButton} disabled={remainingTime <= 15000} ghost center onPress={rewind15Seconds}>
                            <ThemedMaterialCommunityIcons disabled={remainingTime <= 15000} ghost name="rewind-15" size={40} />
                        </ThemedPressable>
                        <StopwatchDisplay textSize={50} remainingTime={remainingTime} />
                        <ThemedPressable style={styles.timeButton} ghost center onPress={fastForward15Seconds}>
                            <ThemedMaterialCommunityIcons ghost name="fast-forward-15" size={40} />
                        </ThemedPressable>
                    </HStack>
                    <HStack input style={styles.buttons}>
                        <Pressable onPress={toggleTimer}>
                            <ThemedMaterialCommunityIcons ghost size={40} name={timerStarted ? "pause-circle" : "play-circle"} />
                        </Pressable>
                        <Pressable onPress={reset}>
                            <ThemedMaterialCommunityIcons ghost size={40} name="sync-circle" />
                        </Pressable>
                    </HStack>
                </ThemedBottomSheetModal>

                <ThemedPressable padding round secondary reference={buttonRef} onPress={togglePopover}>
                    <AnimatedView ghost style={popoverStyle}>
                        <ThemedMaterialCommunityIcons disabled={remainingTime === -404} secondary name="timer-outline" size={35} />
                    </AnimatedView>
                    <AnimatedView secondary style={displayStyle}>
                        <StopwatchDisplay textSize={25} remainingTime={remainingTime} />
                    </AnimatedView>
                </ThemedPressable>
            </ThemedView>
        </>
    );
};
