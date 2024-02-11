import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import { AppState, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";
import { getErrorByKey } from "../../store/reducers/errors/errorSelectors";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { TextInput } from "react-native";
import { EditableExerciseInputRowProps } from "./types";
import { borderRadius } from "../../theme/border";

export const EditableExerciseInputRow = (props: EditableExerciseInputRowProps) => {
    const { t } = useTranslation();
    const { type, value, setValue, errorKey, i18key, placeholder, stretch } = props;
    const { errorColor } = useTheme();
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state)(errorKey));
    const inputStyles = useMemo(
        () => [{ paddingHorizontal: type === "WEIGHT_BASED" ? 20 : 30, borderColor: hasError ? errorColor : "transparent" }, styles.input],
        [errorColor, hasError, type],
    );
    const textInputRef = useRef<TextInput>(null);
    const containerRef = useRef<TextInput>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const secondsRef = useRef<TextInput>(null);
    const minutesRef = useRef<TextInput>(null);

    const secondsSuffix = useMemo(() => t("seconds"), [t]);
    const minutesSuffix = useMemo(() => t("minutes"), [t]);

    const weightBasedSuffix = useMemo(() => {
        if (type === "WEIGHT_BASED") {
            return props?.suffix;
        }
    }, [props, type]);

    const timeBasedSuffix = useMemo(() => {
        if (type === "TIME_BASED" && !props?.hideSuffix) {
            return { minutesSuffix, secondsSuffix };
        }
    }, [minutesSuffix, props, secondsSuffix, type]);

    const handleSetValue = useCallback(
        (val: string) => {
            if (type === "WEIGHT_BASED") {
                setValue(val);
            }
        },
        [setValue, type],
    );

    const handleFocus = useCallback(() => {
        textInputRef.current?.focus();
    }, [textInputRef]);

    useLayoutEffect(() => {
        if (containerRef.current) {
            containerRef.current.measure((x, y, width) => {
                setContainerWidth(width);
            });
        }
    }, []);

    const handleChangeSeconds = useCallback(
        (seconds: string) => {
            if (type === "TIME_BASED") {
                setValue({ timeInputKey: "seconds", value: seconds });
            }
        },
        [setValue, type],
    );

    const handleChangeMinutes = useCallback(
        (minutes: string) => {
            if (type === "TIME_BASED") {
                setValue({ timeInputKey: "minutes", value: minutes });
            }
        },
        [setValue, type],
    );

    const minutesSuffixStyles = useMemo(() => {
        if (type === "TIME_BASED") {
            return {
                position: "absolute",
                width: containerWidth,
                left: Math.min(containerWidth / 2 - 40, containerWidth / 4 + (value?.minutes?.length ?? 0) * 5 + 2),
            } as const;
        }
    }, [containerWidth, type, value]);

    const secondsSuffixStyles = useMemo(() => {
        if (type === "TIME_BASED") {
            return {
                position: "absolute",
                width: containerWidth,
                left: Math.min(containerWidth / 2 - 40, containerWidth / 4 + (value?.seconds?.length ?? 0) * 5 + 2),
            } as const;
        }
    }, [containerWidth, type, value]);

    const suffixContainerStyles = useMemo(() => {
        if (type === "WEIGHT_BASED") {
            return {
                position: "absolute",
                width: containerWidth,
                left: Math.min(containerWidth - 20, containerWidth / 2 + (value?.length ?? 0) * 5 + 2),
            } as const;
        }
    }, [containerWidth, type, value]);

    return (
        <ThemedPressable reference={containerRef} onPress={handleFocus} behind ghost stretch={stretch}>
            {i18key && (
                <Text behind style={styles.label} ghost>
                    {t(i18key ?? "")}
                </Text>
            )}
            {type === "WEIGHT_BASED" ? (
                <HStack round center style={styles.inputStack}>
                    <ThemedTextInput
                        ghost
                        reference={textInputRef}
                        errorKey={errorKey}
                        inputMode="decimal"
                        textAlign="center"
                        stretch
                        style={inputStyles}
                        onChangeText={handleSetValue}
                        value={value}
                        placeholder={placeholder}
                    />
                    {weightBasedSuffix && value && (
                        <ThemedView style={suffixContainerStyles} ghost>
                            <Text ghost>{weightBasedSuffix}</Text>
                        </ThemedView>
                    )}
                </HStack>
            ) : (
                <HStack ghost style={styles.gap}>
                    <ThemedPressable ghost stretch onPress={() => minutesRef.current?.focus()}>
                        <HStack style={{ borderRadius, alignItems: "center", justifyContent: "center" }}>
                            <ThemedTextInput
                                reference={minutesRef}
                                ghost
                                stretch
                                errorKey={errorKey}
                                inputMode="decimal"
                                textAlign="center"
                                onChangeText={handleChangeMinutes}
                                value={value?.minutes ?? "0"}></ThemedTextInput>
                            {timeBasedSuffix?.minutesSuffix && value?.minutes && (
                                <Text ghost style={minutesSuffixStyles}>
                                    {minutesSuffix}
                                </Text>
                            )}
                        </HStack>
                    </ThemedPressable>
                    <ThemedPressable stretch ghost onPress={() => secondsRef.current?.focus()}>
                        <HStack style={{ borderRadius, alignItems: "center", justifyContent: "center" }}>
                            <ThemedTextInput
                                reference={secondsRef}
                                ghost
                                stretch
                                errorKey={errorKey}
                                style={inputStyles}
                                inputMode="decimal"
                                textAlign="center"
                                onChangeText={handleChangeSeconds}
                                value={value?.seconds ?? "0"}></ThemedTextInput>
                            {timeBasedSuffix?.secondsSuffix && value?.seconds && (
                                <Text ghost style={secondsSuffixStyles}>
                                    {secondsSuffix}
                                </Text>
                            )}
                        </HStack>
                    </ThemedPressable>
                </HStack>
            )}
        </ThemedPressable>
    );
};
