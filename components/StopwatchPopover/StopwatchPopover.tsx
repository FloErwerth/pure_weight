import { useAppSelector } from "../../store";
import { getPauseTime } from "../../store/selectors";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { z } from "zod/lib/index";
import { Animated, Dimensions, Pressable, View } from "react-native";
import StopWatch, { StopwatchTimerMethods } from "react-native-animated-stopwatch-timer";
import { useTheme } from "../../theme/context";
import { HStack } from "../HStack/HStack";
import { Button } from "../Themed/Button/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "./styles";

const pauseTimeDecoder = z
  .string()
  .transform((pauseTime) => {
    return parseFloat(pauseTime.replace(",", ".")) * 60 * 1000;
  })
  .catch(() => -404);

export const StopwatchPopover = () => {
  const currentPauseTime = useAppSelector(getPauseTime);

  const [timerStarted, setTimerStarted] = useState(false);
  const [time, setTime] = useState<number>();
  const [showPopover, setShowPopover] = useState(false);
  const [buttonPos, setButtonPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const left = useRef(new Animated.Value(2000)).current;

  const buttonRef = useRef<View>(null);
  const { mainColor } = useTheme();

  useEffect(() => {
    if (currentPauseTime && !timerStarted) {
      setTime(pauseTimeDecoder.parse(currentPauseTime));
    }
  }, [currentPauseTime]);

  const toggleTimer = useCallback(() => {
    if (timerStarted) {
      setTimerStarted(false);
      stopwatchRef.current?.pause();
    } else {
      setTimerStarted(true);
      stopwatchRef.current?.play();
    }
  }, [timerStarted]);

  const stopwatchRef = useRef<StopwatchTimerMethods>(null);

  const handleTimerFinished = useCallback(() => {
    setTimerStarted(false);
    setShowPopover(false);
  }, []);

  const togglePopover = useCallback(() => {
    setShowPopover(!showPopover);
    if (!timerStarted && showPopover) {
      stopwatchRef.current?.reset();
    }
  }, [showPopover, timerStarted]);

  const resetTimer = useCallback(() => {
    stopwatchRef.current?.reset();
    setTime(pauseTimeDecoder.parse(currentPauseTime));
    setTimerStarted(false);
  }, [currentPauseTime]);

  const getButtonPos = useCallback(() => {
    buttonRef.current?.measureInWindow((x, y) => {
      setButtonPos({ x, y });
    });
  }, []);

  useLayoutEffect(() => {
    if (showPopover) {
      getButtonPos();
      Animated.timing(left, {
        toValue: -buttonPos.x,
        useNativeDriver: false,
        duration: 100,
      }).start();
    } else {
      Animated.timing(left, {
        toValue: -Dimensions.get("window").width * 2,
        useNativeDriver: false,
        duration: 100,
      }).start(() =>
        Animated.timing(left, {
          toValue: Dimensions.get("window").width,
          useNativeDriver: false,
          duration: 0,
        }).start(),
      );
    }
  }, [buttonPos.y, getButtonPos, showPopover, left, buttonPos.x]);

  if (time === -404) {
    return null;
  }

  return (
    <View>
      <Animated.View
        style={[
          styles.wrapper,
          {
            backgroundColor: "#ccc",
            top: buttonPos.y - Dimensions.get("screen").height - 50,
            left,
          },
        ]}
      >
        <StopWatch
          containerStyle={{ justifyContent: "center" }}
          digitStyle={{ color: mainColor, fontSize: 50, textAlign: "center", alignItems: "center", alignSelf: "center", width: 30 }}
          onFinish={handleTimerFinished}
          mode="timer"
          leadingZeros={2}
          trailingZeros={0}
          initialTimeInMs={time}
          ref={stopwatchRef}
        />
        <HStack style={{ flex: 1, gap: 20, justifyContent: "center" }}>
          <Pressable onPress={toggleTimer}>
            <MaterialCommunityIcons size={40} name={timerStarted ? "pause-circle" : "play-circle"} />
          </Pressable>
          <Pressable onPress={resetTimer}>
            <MaterialCommunityIcons size={40} name="sync-circle" />
          </Pressable>
        </HStack>
      </Animated.View>

      <Button onLayout={getButtonPos} reference={buttonRef} onPress={togglePopover} title="Show popover" />
    </View>
  );
};
