import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text } from "../Themed/ThemedText/Text";
import { styles } from "./styles";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { borderRadius } from "../../theme/border";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { ThemedView } from "../Themed/ThemedView/View";
import { TextInput, View } from "react-native";
import { TimeInputRowProps } from "./types";
import { useTranslation } from "react-i18next";

export const TimeInputRow = ({ value, setValue, i18key, errorKey }: TimeInputRowProps) => {
    const secondsRef = useRef<TextInput>(null);
    const minutesRef = useRef<TextInput>(null);
    const { t } = useTranslation();
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<View>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.measure((_x, _y, width) => {
                setContainerWidth(width);
            });
        }
    }, [containerRef]);

    const secondsSuffix = useMemo(() => t("seconds"), [t]);
    const minutesSuffix = useMemo(() => t("minutes"), [t]);

    const handleChangeSeconds = useCallback(
        (seconds: string) => {
            const secondsNumber = seconds ? Math.min(parseInt(seconds, 10), 59).toString() : "";
            setValue({ timeInputKey: "seconds", value: secondsNumber });
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

    const minutesSuffixStyles = useMemo(() => {
        return {
            position: "absolute",
            width: containerWidth,
            left: Math.min(containerWidth / 2 - 40, containerWidth / 4 + -1 + (value?.minutes?.length || 1) * 5),
        } as const;
    }, [containerWidth, value]);

    const secondsSuffixStyles = useMemo(() => {
        return {
            position: "absolute",
            width: containerWidth,
            left: Math.min(containerWidth / 2 - 40, containerWidth / 4 + -1 + (value?.seconds?.length || 1) * 5),
        } as const;
    }, [containerWidth, value]);

    return (
        <ThemedView reference={containerRef} ghost>
            <Text style={styles.label} ghost>
                {t(i18key ?? "")}
            </Text>
            <HStack ghost style={styles.gap}>
                <ThemedPressable ghost stretch onPress={() => minutesRef.current?.focus()}>
                    <HStack style={{ borderRadius, alignItems: "center", justifyContent: "center" }}>
                        <ThemedTextInput
                            style={{ paddingHorizontal: 35 }}
                            reference={minutesRef}
                            errorKey={errorKey}
                            inputMode="decimal"
                            stretch
                            ghost
                            placeholder="0"
                            textAlign="center"
                            onChangeText={handleChangeMinutes}
                            maxLength={2}
                            value={value?.minutes}></ThemedTextInput>
                        <Text style={minutesSuffixStyles} ghost>
                            {minutesSuffix}
                        </Text>
                    </HStack>
                </ThemedPressable>
                <ThemedPressable stretch ghost onPress={() => secondsRef.current?.focus()}>
                    <HStack style={{ borderRadius, alignItems: "center", justifyContent: "center" }}>
                        <ThemedTextInput
                            style={{ paddingHorizontal: 35 }}
                            reference={secondsRef}
                            ghost
                            stretch
                            placeholder="0"
                            errorKey={errorKey}
                            inputMode="decimal"
                            textAlign="center"
                            onChangeText={handleChangeSeconds}
                            maxLength={2}
                            value={value?.seconds}></ThemedTextInput>
                        <Text style={secondsSuffixStyles} ghost>
                            {secondsSuffix}
                        </Text>
                    </HStack>
                </ThemedPressable>
            </HStack>
        </ThemedView>
    );
};
