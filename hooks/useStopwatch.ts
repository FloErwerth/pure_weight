import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useScheduleNotification } from "./useScheduleNotification";
import BackgroundTimer from "react-native-background-timer";

const UPDATE_INTERVAL = 975;
const TIME_STEP = 1000;
let id: number = 0;

type StopwatchConfig =
    | {
          showNotification?: boolean;
          onTimerDone?: (remainingTime?: number) => void;
      }
    | undefined;
export const useStopwatch = (totalDuration: number, config: StopwatchConfig = { showNotification: true }) => {
    const [remainingTime, setRemainingTime] = useState<number>(totalDuration);
    const [timerStarted, setTimerStarted] = useState(false);
    const { t } = useTranslation();
    const showNotification = useScheduleNotification({
        title: t("stopwatch_pause_notification_title"),
        body: t("stopwatch_pause_notification_text"),
    });

    const stopTimer = useCallback(() => {
        BackgroundTimer.clearInterval(id);
        setTimerStarted(false);
    }, []);

    const pauseTimer = useCallback(() => {
        BackgroundTimer.clearInterval(id);
    }, []);

    const reset = useCallback(() => {
        stopTimer();
        setRemainingTime(totalDuration);
    }, [totalDuration, stopTimer]);

    const update = useCallback(() => {
        setRemainingTime((remainingTime) => {
            if (remainingTime <= 0) {
                reset();
                if (config?.onTimerDone) {
                    config.onTimerDone(remainingTime);
                }
                if (config?.showNotification) {
                    void showNotification();
                }
                return 0;
            }
            return remainingTime - TIME_STEP;
        });
    }, [config, reset, showNotification]);

    const startTimer = useCallback(() => {
        setTimerStarted(true);
        id = BackgroundTimer.setInterval(update, UPDATE_INTERVAL);
    }, [update]);

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
        }),
        [timerStarted, remainingTime, startTimer, stopTimer, pauseTimer, reset],
    );
};
