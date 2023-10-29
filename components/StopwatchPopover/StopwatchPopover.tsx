import { useAppSelector } from "../../store";
import { getPauseTime } from "../../store/selectors";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { z } from "zod/lib/index";
import { Animated, AppState, Dimensions, Easing, Pressable, View } from "react-native";
import StopWatch, { StopwatchTimerMethods } from "react-native-animated-stopwatch-timer";
import { useTheme } from "../../theme/context";
import { HStack } from "../HStack/HStack";
import { Button } from "../Themed/Button/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { stopWatchStyles, styles } from "./styles";
import { Temporal } from "@js-temporal/polyfill";
import { noop } from "lodash";

const pauseTimeDecoder = z
  .string()
  .transform((pauseTime) => {
    return parseFloat(pauseTime.replace(",", ".")) * 60 * 1000;
  })
  .catch(() => -404);

let interval = setInterval(noop);

export const StopwatchPopover = () => {
  const currentPauseTime = useAppSelector(getPauseTime);
  const opacity = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(1)).current;
  const [trackedTime, setTrackedTime] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [startingTime, setStartingTime] = useState<number>(0);
  const [timestamp, setTimestamp] = useState<number>(0);
  const [unmountTime, setUnmountTime] = useState<number>(0);
  const [showPopover, setShowPopover] = useState(false);
  const [buttonPos, setButtonPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const top = useRef(new Animated.Value(200)).current;
  const stopwatchRef = useRef<StopwatchTimerMethods>(null);

  const buttonRef = useRef<View>(null);
  const { mainColor, inputFieldBackgroundColor, textDisabled } = useTheme();

  const handleTimerFinished = useCallback(() => {
    if ((stopwatchRef.current?.getSnapshot() ?? 0) <= 30) {
      clearInterval(interval);
      setTimerStarted(false);
    }
  }, []);

  useEffect(() => {
    if (!timerStarted && showPopover) {
      setStartingTime(pauseTimeDecoder.parse(currentPauseTime));
    }
  }, [currentPauseTime]);

  useEffect(() => {
    if (timerStarted && !showPopover) {
      const currentTime = stopwatchRef.current?.getSnapshot();
      if (currentTime !== undefined) {
        setTrackedTime(currentTime);
        const timeToStartCount = parseInt((currentTime / 1000).toString().split(".")[1]);
        setTimeout(() => {
          setTrackedTime(stopwatchRef.current?.getSnapshot() ?? 0);
          interval = setInterval(() => {
            setTrackedTime(stopwatchRef.current?.getSnapshot() ?? 0);
          }, 1000);
        }, timeToStartCount);
      }
    }
  }, [showPopover, timerStarted]);

  const handleAppStateChange = useCallback(
    (state: AppState["currentState"]) => {
      if (timerStarted) {
        if (state === "inactive") {
          setTimestamp(Temporal.Now.instant().epochMilliseconds);
          setUnmountTime(stopwatchRef.current?.getSnapshot() ?? 0);
          stopwatchRef.current?.pause();
        }
      }
      if (state === "active") {
        const timeDifference = Temporal.Now.instant().epochMilliseconds - timestamp;
        const newTime = unmountTime - timeDifference;
        if (unmountTime <= 0 || newTime <= 250) {
          handleTimerFinished();
          return;
        }
        setStartingTime(newTime);
      }
    },
    [handleTimerFinished, timerStarted, timestamp, unmountTime],
  );

  useEffect(() => {
    if (!timerStarted && showPopover && (stopwatchRef.current?.getSnapshot() ?? 0) <= 5) {
      setStartingTime(pauseTimeDecoder.parse(currentPauseTime));
      stopwatchRef.current?.reset();
    }
  }, [currentPauseTime, showPopover, timerStarted]);

  useEffect(() => {
    if (timerStarted) {
      stopwatchRef.current?.play();
    }
  }, [startingTime, timerStarted]);

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
  }, [handleAppStateChange]);

  useEffect(() => {
    if (showPopover) {
      if (!timerStarted && timestamp && timestamp <= 0) {
        setStartingTime(pauseTimeDecoder.parse(currentPauseTime));
      }
    }
  }, [currentPauseTime, timestamp, showPopover, startingTime, timerStarted]);

  const toggleTimer = useCallback(() => {
    if (timerStarted) {
      setTimestamp(stopwatchRef.current?.getSnapshot() ?? 0);
      setTimerStarted(false);
      stopwatchRef.current?.pause();
      clearInterval(interval);
    } else {
      setTimerStarted(true);
      stopwatchRef.current?.play();
    }
  }, [timerStarted]);

  const togglePopover = useCallback(() => {
    setShowPopover(!showPopover);
  }, [showPopover]);

  const resetTimer = useCallback(() => {
    stopwatchRef.current?.reset();
    setStartingTime(pauseTimeDecoder.parse(currentPauseTime));
    setTimerStarted(false);
    clearInterval(interval);
  }, [currentPauseTime]);

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
    const currentTimeMilliseconds = stopwatchRef.current?.getSnapshot();
    if (currentTimeMilliseconds !== undefined) {
      stopwatchRef.current?.reset();
      setStartingTime(currentTimeMilliseconds + 15 * 1000);
    }
  }, []);

  const handleFastForward15 = useCallback(() => {
    const currentTimeMilliseconds = stopwatchRef.current?.getSnapshot();
    if (currentTimeMilliseconds !== undefined) {
      stopwatchRef.current?.reset();
      setStartingTime(currentTimeMilliseconds - 15 * 1000);
    }
  }, []);

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

  const fastForwardDisabled = (startingTime ?? 0) <= 15000;
  const fastForwardColor = fastForwardDisabled ? textDisabled : mainColor;

  if (startingTime === -404) {
    return null;
  }

  return (
    <View>
      <Animated.View style={[styles.wrapper, animatedViewStyles]}>
        <HStack style={styles.hStack}>
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
            initialTimeInMs={startingTime}
            ref={stopwatchRef}
          />
          <Pressable onPress={handleRewind15}>
            <MaterialCommunityIcons size={40} color={mainColor} name="fast-forward-15" />
          </Pressable>
        </HStack>
        <HStack style={styles.buttons}>
          <Pressable onPress={toggleTimer}>
            <MaterialCommunityIcons size={40} color={mainColor} name={timerStarted ? "pause-circle" : "play-circle"} />
          </Pressable>
          <Pressable onPress={resetTimer}>
            <MaterialCommunityIcons size={40} color={mainColor} name="sync-circle" />
          </Pressable>
        </HStack>
      </Animated.View>

      <Button theme="secondary" onLayout={getButtonPos} reference={buttonRef} onPress={togglePopover}>
        <Animated.View style={{ opacity: iconOpacity, position: "absolute", alignItems: "center", width: "100%" }}>
          <MaterialCommunityIcons name="timer-outline" color={mainColor} size={40} />
        </Animated.View>
        <Animated.View style={{ opacity }}>
          <StopWatch
            animationDuration={0}
            separatorStyle={separatorStyle}
            containerStyle={[stopWatchStyles.container]}
            digitStyle={{ fontSize: 35, textAlign: "center", color: mainColor }}
            mode="timer"
            leadingZeros={2}
            trailingZeros={0}
            initialTimeInMs={trackedTime}
          />
        </Animated.View>
      </Button>
    </View>
  );
};
