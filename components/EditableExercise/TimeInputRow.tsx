import { useCallback, useMemo } from "react";
import { styles } from "./styles";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedView } from "../Themed/ThemedView/View";
import { TimeInputRowProps } from "./types";
import { useTranslation } from "react-i18next";
import { EditableExerciseInputRow } from "./EditableExerciseInputRow";
import { ErrorTextConfig } from "../../store/reducers/errors/types";

export const TimeInputRow = ({
    seconds,
    minutes,
    setMinutes,
    setSeconds,
    i18key,
    helpTextConfig,
    errorTextConfig,
    stretch,
}: TimeInputRowProps) => {
    const { t } = useTranslation();

    const secondsSuffix = useMemo(() => t("seconds"), [t]);
    const minutesSuffix = useMemo(() => t("minutes"), [t]);

    const handleChangeSeconds = useCallback(
        (seconds: string) => {
            const secondsNumber = parseFloat(seconds);
            let validatedValue = seconds;
            if (secondsNumber > 59) {
                validatedValue = "59";
            }
            setSeconds(validatedValue);
        },
        [setSeconds],
    );

    const handleChangeMinutes = useCallback(
        (minutes: string) => {
            const minutesNumber = minutes ? Math.min(parseInt(minutes, 10), 59).toString() : "";
            setMinutes(minutesNumber);
        },
        [setMinutes],
    );

    const secondInputErrorTextConfig: ErrorTextConfig = useMemo(
        () => ({ errorKey: errorTextConfig?.errorKey, hideError: true }),
        [errorTextConfig],
    );

    return (
        <ThemedView stretch={stretch} ghost>
            <HStack stretch={stretch} ghost style={styles.gap}>
                <EditableExerciseInputRow
                    errorTextConfig={errorTextConfig}
                    suffix={minutesSuffix}
                    stretch={stretch}
                    i18key={i18key}
                    value={minutes}
                    setValue={handleChangeMinutes}
                    maxLength={4}
                    placeholder="0"
                />
                <EditableExerciseInputRow
                    errorTextConfig={secondInputErrorTextConfig}
                    suffix={secondsSuffix}
                    stretch={stretch}
                    i18key=" "
                    value={seconds}
                    setValue={handleChangeSeconds}
                    maxLength={4}
                    placeholder="0"
                    helpTextConfig={helpTextConfig}
                />
            </HStack>
        </ThemedView>
    );
};
