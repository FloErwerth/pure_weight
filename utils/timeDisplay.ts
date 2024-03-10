import { trunicateToNthSignificantDigit } from "./number";

export const getTimeDisplayFromMilliseconds = (milliseconds: number) => {
    const { minutes, seconds } = getMinutesSecondsFromMilliseconds(milliseconds);

    const minutesString = minutes.toString().padStart(2, "0");
    const secondsString = seconds.toString().padStart(2, "0");

    return `${minutesString}:${secondsString}`;
};
export const getDurationInSecondsMinutesOrHours = (duration: string) => {
    const parsedDurationSeconds = parseFloat(duration) / 1000;
    const hours = parsedDurationSeconds / 3600;
    const minutes = parsedDurationSeconds / 60;
    if (parsedDurationSeconds < 60) {
        return {
            value: trunicateToNthSignificantDigit(parsedDurationSeconds, true),
            unit: "s",
        };
    }

    if (minutes < 60) {
        return {
            value: trunicateToNthSignificantDigit(minutes, true),
            unit: "min",
        };
    }

    return {
        value: trunicateToNthSignificantDigit(hours, true),
        unit: "h",
    };
};
export const getMinutesSecondsFromMilliseconds = (milliseconds: number) => {
    const seconds = milliseconds / 1000;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return {
        minutes: minutes,
        seconds: remainingSeconds,
    };
};

export const getMillisecondsFromTimeInput = (timeMinutes?: string, timeSeconds?: string) => {
    const minutes = parseFloat(timeMinutes ?? "0");
    const seconds = parseFloat(timeSeconds ?? "0");

    return (minutes * 60 + seconds) * 1000;
};
