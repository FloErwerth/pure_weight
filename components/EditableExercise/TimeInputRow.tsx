import { useCallback, useMemo } from "react";
import { styles } from "./styles";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedView } from "../Themed/ThemedView/View";
import { TimeInputRowProps } from "./types";
import { useTranslation } from "react-i18next";
import { EditableExerciseInputRow } from "./EditableExerciseInputRow";
import { ErrorTextConfig } from "../../store/reducers/errors/types";

export const TimeInputRow = ({ value, setValue, i18key, helpTextConfig, errorTextConfig }: TimeInputRowProps) => {
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
            setValue({ timeInputKey: "seconds", value: validatedValue });
        },
        [setValue],
    );

    const handleChangeMinutes = useCallback(
        (minutes: string) => {
            const minutesNumber = minutes ? Math.min(parseInt(minutes, 10), 59).toString() : "";
            setValue({ timeInputKey: "minutes", value: minutesNumber });
        },
        [setValue],
    );

    const secondInputErrorTextConfig: ErrorTextConfig = useMemo(
        () => ({ errorKey: errorTextConfig?.errorKey, hideError: true }),
        [errorTextConfig],
    );

    return (
        <ThemedView style={{ alignSelf: "stretch" }} ghost>
            <HStack ghost style={styles.gap}>
                <EditableExerciseInputRow
                    errorTextConfig={errorTextConfig}
                    suffix={minutesSuffix}
                    stretch
                    i18key={i18key}
                    value={value?.minutes}
                    setValue={handleChangeMinutes}
                    maxLength={4}
                    placeholder="0"
                />
                <EditableExerciseInputRow
                    errorTextConfig={secondInputErrorTextConfig}
                    suffix={secondsSuffix}
                    stretch
                    value={value?.seconds}
                    setValue={handleChangeSeconds}
                    maxLength={4}
                    placeholder="0"
                    helpTextConfig={helpTextConfig}
                />
            </HStack>
        </ThemedView>
    );
};
