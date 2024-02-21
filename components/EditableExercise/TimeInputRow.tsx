import { useCallback, useMemo } from "react";
import { styles } from "./styles";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedView } from "../Themed/ThemedView/View";
import { TimeInputRowProps } from "./types";
import { useTranslation } from "react-i18next";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { AppState, useAppSelector } from "../../store";
import { getErrorByKey } from "../../store/reducers/errors/errorSelectors";
import { ErrorText } from "../ErrorText/ErrorText";
import { HelpText } from "../HelpText/HelpText";

export const TimeInputRow = ({ seconds, minutes, setMinutes, setSeconds, i18key, helpTextConfig, errorTextConfig }: TimeInputRowProps) => {
    const { t } = useTranslation();
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state, errorTextConfig?.errorKey));
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

    return (
        <ThemedView stretch ghost>
            <HStack ghost center style={{ justifyContent: "space-between" }}>
                <HStack ghost center>
                    {i18key && (
                        <Text ghost style={styles.label}>
                            {t(i18key)}
                        </Text>
                    )}
                    <Text ghost placeholder style={styles.suffix}>
                        {minutesSuffix}:{secondsSuffix}
                    </Text>
                </HStack>
                {helpTextConfig && <HelpText helpTextConfig={helpTextConfig} />}
            </HStack>
            <HStack
                hasError={hasError}
                input
                style={{
                    borderWidth: 1,
                    gap: 0,
                    justifyContent: "center",
                    alignItems: "center",
                }}
                round>
                <ThemedTextInput
                    onChangeText={handleChangeMinutes}
                    style={{ paddingHorizontal: 3 }}
                    placeholder="00"
                    value={minutes}
                    input
                    ghost
                    textAlign="right"
                    stretch></ThemedTextInput>
                <Text ghost>:</Text>
                <ThemedTextInput
                    onChangeText={handleChangeSeconds}
                    style={{ paddingHorizontal: 3 }}
                    placeholder="00"
                    value={seconds}
                    input
                    ghost
                    textAlign="left"
                    stretch></ThemedTextInput>
            </HStack>
            {hasError && <ErrorText errorKey={errorTextConfig?.errorKey}>{errorTextConfig?.errorText}</ErrorText>}
        </ThemedView>
    );
};
