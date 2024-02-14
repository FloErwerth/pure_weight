import { useMemo } from "react";

export const useTimeDisplay = (remainingTime: number | string) => {
    const remainingTimeParsed = useMemo(() => {
        if (typeof remainingTime === "string") {
            return parseInt(remainingTime, 10);
        }
        return remainingTime;
    }, [remainingTime]);

    const hours = useMemo(() => Math.floor(remainingTimeParsed / 3600000), [remainingTimeParsed]);
    const minutes = useMemo(() => Math.floor((remainingTimeParsed % 3600000) / 60000), [remainingTimeParsed]);
    const seconds = useMemo(() => Math.floor((remainingTimeParsed % 60000) / 1000), [remainingTimeParsed]);

    const hoursText = useMemo(() => (hours > 0 ? `${hours < 10 ? "0" : 0}${hours}:` : ""), [hours]);
    const minutesText = useMemo(() => (minutes > 0 ? `${minutes < 10 ? "0" : ""}${minutes}:` : "00:"), [minutes]);
    const secondsText = useMemo(() => (seconds < 10 ? `0${seconds}` : `${seconds}`), [seconds]);

    return useMemo(() => `${hoursText}${minutesText}${secondsText}`, [hoursText, minutesText, secondsText]);
};
