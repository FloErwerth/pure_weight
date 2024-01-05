import { Text } from "../../Themed/ThemedText/Text";
import { useMemo } from "react";
import { styles } from "./styles";

type StopwatchDisplayProps = {
    remainingTime: number;
    textSize: number;
};

const useHourMinutesSecondsTextFromRemainingTimeMilliseconds = (remainingTime: number) => {
    const hours = useMemo(() => Math.floor(remainingTime / 3600000), [remainingTime]);
    const minutes = useMemo(() => Math.floor((remainingTime % 3600000) / 60000), [remainingTime]);
    const seconds = useMemo(() => Math.floor((remainingTime % 60000) / 1000), [remainingTime]);

    const hoursText = useMemo(() => (hours > 0 ? `${hours < 10 ? "0" : 0}${hours}:` : ""), [hours]);
    const minutesText = useMemo(() => (minutes > 0 ? `${minutes < 10 ? "0" : ""}${minutes}:` : "00:"), [minutes]);
    const secondsText = useMemo(() => (seconds < 10 ? `0${seconds}` : `${seconds}`), [seconds]);
    return useMemo(() => `${hoursText}${minutesText}${secondsText}`, [hoursText, minutesText, secondsText]);
};

export const StopwatchDisplay = ({ remainingTime, textSize }: StopwatchDisplayProps) => {
    const remainingTimeText = useHourMinutesSecondsTextFromRemainingTimeMilliseconds(remainingTime);
    const digitStyles = useMemo(() => [styles.digit, { fontSize: textSize }], [textSize]);
    return (
        <Text ghost style={digitStyles}>
            {remainingTimeText}
        </Text>
    );
};
