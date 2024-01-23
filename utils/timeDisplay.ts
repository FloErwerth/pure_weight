import { TimeInput } from "../store/reducers/workout/types";

export const getTimeDisplayFromMilliseconds = (milliseconds: number) => {
    const { minutes, seconds } = getMinutesSecondsFromMilliseconds(milliseconds);

    const minutesString = minutes.toString().padStart(2, "0");
    const secondsString = seconds.toString().padStart(2, "0");

    return `${minutesString}:${secondsString}`;
};

export const getMinutesSecondsFromSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return {
        minutes: minutes.toString(),
        seconds: remainingSeconds.toString(),
    };
};

export const getMinutesSecondsFromMinutes = (minutes: number) => {
    const remainingMinutes = minutes % 60;
    const hours = Math.floor(minutes / 60);

    return {
        hours: hours.toString(),
        minutes: remainingMinutes.toString(),
    };
};

export const getMinutesSecondsFromMilliseconds = (milliseconds: number) => {
    const seconds = milliseconds / 1000;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return {
        minutes,
        seconds: remainingSeconds,
    };
};

export const getTimeInputFromMilliseconds = (milliseconds: number): TimeInput => {
    const seconds = milliseconds / 1000;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return {
        minutes: minutes.toString(),
        seconds: remainingSeconds.toString(),
    };
};

export const getMillisecondsFromTimeInput = (timeInput?: TimeInput) => {
    const minutes = parseFloat(timeInput?.minutes ?? "0");
    const seconds = parseFloat(timeInput?.seconds ?? "0");

    return (minutes * 60 + seconds) * 1000;
};
