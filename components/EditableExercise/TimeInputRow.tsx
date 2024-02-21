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
import { borderRadius } from "../../theme/border";

export const TimeInputRow = ({
    hideSuffix,
    seconds,
    minutes,
    setMinutes,
    setSeconds,
    i18key,
    helpTextConfig,
    errorTextConfig,
    stretch,
    ghost,
    background,
    input = !ghost && !background,
}: TimeInputRowProps) => {
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
            const minutesNumber = parseFloat(minutes);
            let validatedValue = minutes;
            if (minutesNumber > 59) {
                validatedValue = "59";
            }
            setMinutes(validatedValue);
        },
        [setMinutes],
    );

    const hasValuesInTopBar = Boolean(i18key || !hideSuffix || helpTextConfig);

    const handleBlurMinutes = useCallback(() => {
        if (minutes === "") {
            return;
        }
        handleChangeMinutes(minutes?.padStart(2, "0") ?? "");
    }, [handleChangeMinutes, minutes]);

    const handleFocusMinutes = useCallback(() => {
        const removeLeadingZero = minutes?.replace(/^0+/, "");
        handleChangeMinutes(removeLeadingZero ?? "");
    }, [handleChangeMinutes, minutes]);

    const handleBlurSeconds = useCallback(() => {
        if (seconds === "") {
            return;
        }
        handleChangeSeconds(seconds?.padStart(2, "0") ?? "");
    }, [handleChangeSeconds, seconds]);

    const handleFocusSeconds = useCallback(() => {
        const removeLeadingZero = seconds?.replace(/^0+/, "");
        handleChangeSeconds(removeLeadingZero ?? "");
    }, [handleChangeSeconds, seconds]);

    return (
        <ThemedView stretch ghost>
            {hasValuesInTopBar && (
                <HStack ghost center style={{ justifyContent: "space-between" }}>
                    <HStack ghost center>
                        {i18key && (
                            <Text ghost style={styles.label}>
                                {t(i18key)}
                            </Text>
                        )}
                        {!hideSuffix && (
                            <Text ghost placeholder style={styles.suffix}>
                                {minutesSuffix}:{secondsSuffix}
                            </Text>
                        )}
                    </HStack>
                    {helpTextConfig && <HelpText helpTextConfig={helpTextConfig} />}
                </HStack>
            )}
            <HStack hasError={hasError} input={input} background={background} stretch={stretch} center round>
                <ThemedTextInput
                    onChangeText={handleChangeMinutes}
                    style={{ paddingHorizontal: 3, borderRadius }}
                    placeholder="00"
                    onBlur={handleBlurMinutes}
                    onFocus={handleFocusMinutes}
                    value={minutes}
                    ghost
                    textAlign="right"
                    stretch></ThemedTextInput>
                <Text ghost>:</Text>
                <ThemedTextInput
                    onChangeText={handleChangeSeconds}
                    style={{ paddingHorizontal: 3, borderRadius }}
                    placeholder="00"
                    onBlur={handleBlurSeconds}
                    onFocus={handleFocusSeconds}
                    value={seconds}
                    ghost
                    textAlign="left"
                    stretch></ThemedTextInput>
            </HStack>
            {hasError && <ErrorText errorKey={errorTextConfig?.errorKey}>{errorTextConfig?.errorText}</ErrorText>}
        </ThemedView>
    );
};
