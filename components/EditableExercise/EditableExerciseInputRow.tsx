import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import { AppState, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";
import { ErrorFields } from "../../store/reducers/errors";
import { getErrorByKey } from "../../store/reducers/errors/errorSelectors";
import { borderRadius } from "../../theme/border";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { TextInput } from "react-native";

type ExerciseInputType = "NORMAL" | "MINUTES_SECONDS";
interface EditableExerciseInputRowProps {
    value?: string;
    type?: ExerciseInputType;
    setValue: (value: string) => void;
    errorKey?: ErrorFields;
    i18key?: string;
    stretch?: boolean;
    suffix?: string;
}

const getMinutesFromValue = (value?: string) => {
    if (!value) {
        return "";
    }
    return Math.floor((parseFloat(value) * 60) / 60).toString();
};

const getSecondsFromValue = (value?: string) => {
    if (!value) {
        return "";
    }
    return Math.floor((parseFloat(value) * 60) % 60).toString();
};

export const EditableExerciseInputRow = ({ value, setValue, errorKey, i18key, type = "NORMAL", stretch, suffix }: EditableExerciseInputRowProps) => {
    const { t } = useTranslation();
    const { errorColor } = useTheme();
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state)(errorKey));
    const inputStyles = useMemo(() => [{ borderColor: hasError ? errorColor : "transparent" }, styles.input], [errorColor, hasError]);
    const [seconds, setSeconds] = useState<string>(getSecondsFromValue(value));
    const [minutes, setMinutes] = useState<string>(getMinutesFromValue(value));
    const textInputRef = useRef<TextInput>(null);
    const secondsRef = useRef<TextInput>(null);
    const minutesRef = useRef<TextInput>(null);

    const handleSetValue = useCallback(
        (val: string, inputType?: "min" | "sec") => {
            if (type === "NORMAL") {
                setValue(val);
            } else {
                if (inputType === "min") {
                    setMinutes(val || "");
                }
                if (inputType === "sec") {
                    setSeconds(val || "");
                }
            }
        },
        [setValue, type],
    );

    useEffect(() => {
        if (type === "MINUTES_SECONDS") {
            const parsedSeconds = parseFloat(seconds || "0");
            const parsedMinutes = parseFloat(minutes || "0");
            setValue((parsedMinutes * 60 + parsedSeconds).toString());
        }
    }, [seconds, minutes]);

    const secondsSuffix = useMemo(() => t("seconds"), [t]);
    const minutesSuffix = useMemo(() => t("minutes"), [t]);

    const handleChangeSeconds = useCallback(
        (seconds: string) => {
            handleSetValue(seconds, "sec");
        },
        [handleSetValue],
    );

    const handleChangeMinutes = useCallback(
        (minutes: string) => {
            handleSetValue(minutes, "min");
        },
        [handleSetValue],
    );

    if (type === "MINUTES_SECONDS") {
        return (
            <ThemedView ghost>
                <Text style={styles.label} ghost>
                    {t(i18key ?? "")}
                </Text>
                <HStack ghost style={styles.gap}>
                    <ThemedPressable ghost stretch onPress={() => minutesRef.current?.focus()}>
                        <HStack ghost background style={{ borderRadius, alignItems: "center", justifyContent: "center" }}>
                            <ThemedTextInput
                                reference={minutesRef}
                                ghost
                                errorKey={errorKey}
                                inputMode="decimal"
                                textAlign="center"
                                onChangeText={handleChangeMinutes}
                                value={minutes}
                            ></ThemedTextInput>
                            {minutes && (
                                <ThemedView ghost>
                                    <Text ghost>{minutesSuffix}</Text>
                                </ThemedView>
                            )}
                        </HStack>
                    </ThemedPressable>
                    <ThemedPressable stretch ghost onPress={() => secondsRef.current?.focus()}>
                        <HStack ghost background style={{ borderRadius, alignItems: "center", justifyContent: "center" }}>
                            <ThemedTextInput
                                reference={secondsRef}
                                background
                                errorKey={errorKey}
                                inputMode="decimal"
                                textAlign="center"
                                onChangeText={handleChangeSeconds}
                                value={seconds}
                            ></ThemedTextInput>
                            {seconds && (
                                <ThemedView ghost>
                                    <Text ghost>{secondsSuffix}</Text>
                                </ThemedView>
                            )}
                        </HStack>
                    </ThemedPressable>
                </HStack>
            </ThemedView>
        );
    }

    return (
        <ThemedPressable onPress={() => textInputRef.current?.focus()} behind ghost stretch={stretch}>
            <Text behind style={styles.label} ghost>
                {t(i18key ?? "")}
            </Text>
            <HStack background style={{ borderRadius, alignItems: "center", justifyContent: "center" }}>
                <ThemedTextInput
                    reference={textInputRef}
                    ghost
                    errorKey={errorKey}
                    inputMode="decimal"
                    textAlign="center"
                    style={inputStyles}
                    onChangeText={handleSetValue}
                    value={value}
                ></ThemedTextInput>
                {value && suffix && (
                    <ThemedView ghost>
                        <Text ghost>{suffix}</Text>
                    </ThemedView>
                )}
            </HStack>
        </ThemedPressable>
    );
};
