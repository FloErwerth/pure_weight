import { useCallback, useEffect, useMemo, useState } from "react";
import { useTimer } from "react-use-precision-timer";
import { AppState, AppStateStatus } from "react-native";

const TIME_STEP = 1000;

type StopwatchConfig =
    | {
          onTimerDone?: (remainingTime?: number) => void;
      }
    | undefined;
export const useStopwatch = (totalDuration: number, config?: StopwatchConfig) => {
    const [remainingTime, setRemainingTime] = useState<number>(totalDuration);

    const update = useCallback(() => {
        setRemainingTime((remainingTime) => {
            if (remainingTime <= 0) {
                if (config?.onTimerDone) {
                    config.onTimerDone(remainingTime);
                }
                return 0;
            }
            return remainingTime - TIME_STEP;
        });
    }, [config]);

    const { start, stop, pause, resume, getElapsedStartedTime } = useTimer({ delay: 1000 }, update);
    const [timerStarted, setTimerStarted] = useState(false);

    const handleAppStateChange = useCallback(
        (nextAppState: AppStateStatus) => {
            if (nextAppState === "active") {
                setRemainingTime(totalDuration - getElapsedStartedTime());
                resume();
            } else {
                pause();
            }
        },
        [pause, resume, getElapsedStartedTime],
    );

    useEffect(() => {
        const listener = AppState.addEventListener("change", handleAppStateChange);
        return () => {
            listener.remove();
        };
    }, [AppState.currentState]);

    const pauseTimer = useCallback(() => {
        pause();
        setTimerStarted(false);
    }, [pause]);

    const stopTimer = useCallback(() => {
        stop();
        setTimerStarted(false);
    }, [stop]);

    const reset = useCallback(() => {
        stopTimer();
        setRemainingTime(totalDuration);
    }, [totalDuration, stopTimer]);

    useEffect(() => {
        if (remainingTime <= 0) {
            reset();
        }
    }, [remainingTime]);

    const rewind15Seconds = useCallback(() => {
        setRemainingTime((remainingTime) => {
            if (remainingTime <= 15000) {
                return remainingTime;
            }
            return remainingTime - 15000;
        });
    }, []);

    const fastForward15Seconds = useCallback(() => {
        setRemainingTime((remainingTime) => {
            if (remainingTime >= totalDuration - 15000) {
                return totalDuration;
            }
            return remainingTime + 15000;
        });
    }, [totalDuration]);

    const startTimer = useCallback(() => {
        setTimerStarted(true);
        start();
    }, [start]);

    useEffect(() => {
        if (!timerStarted) {
            setRemainingTime(totalDuration);
        }
    }, [totalDuration]);

    return useMemo(
        () => ({
            timerStarted,
            remainingTime,
            startTimer,
            stopTimer,
            pauseTimer,
            reset,
            rewind15Seconds,
            fastForward15Seconds,
        }),
        [timerStarted, remainingTime, startTimer, stopTimer, pauseTimer, reset, rewind15Seconds, fastForward15Seconds],
    );
};
