export const getTimeDisplayFromMilliseconds = (milliseconds: number) => {
    const { minutes, seconds } = getMinutesSecondsFromMilliseconds(milliseconds);

    const minutesString = minutes.toString().padStart(2, "0");
    const secondsString = seconds.toString().padStart(2, "0");

    return `${minutesString}:${secondsString}`;
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
