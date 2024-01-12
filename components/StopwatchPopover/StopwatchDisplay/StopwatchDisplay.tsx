import { Text } from "../../Themed/ThemedText/Text";
import { useMemo } from "react";
import { styles } from "./styles";
import { useTimeDisplay } from "../../../hooks/useTimeDisplay";

type StopwatchDisplayProps = {
    remainingTime: number;
    textSize: number;
};

export const StopwatchDisplay = ({ remainingTime, textSize }: StopwatchDisplayProps) => {
    const remainingTimeText = useTimeDisplay(remainingTime);
    const digitStyles = useMemo(() => [styles.digit, { fontSize: textSize }], [textSize]);
    return (
        <Text ghost style={digitStyles}>
            {remainingTimeText}
        </Text>
    );
};
