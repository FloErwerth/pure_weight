import { useCallback, useMemo, useRef } from "react";
import { Text } from "../Themed/ThemedText/Text";
import { styles } from "./styles";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { borderRadius } from "../../theme/border";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { ThemedView } from "../Themed/ThemedView/View";
import { TextInput } from "react-native";
import { TimeInputRowProps } from "./types";
import { useTranslation } from "react-i18next";

export const TimeInputRow = ({ value, setValue, i18key, errorKey }: TimeInputRowProps) => {
    const secondsRef = useRef<TextInput>(null);
    const minutesRef = useRef<TextInput>(null);
    const { t } = useTranslation();

    const secondsSuffix = useMemo(() => t("seconds"), [t]);
    const minutesSuffix = useMemo(() => t("minutes"), [t]);

    const handleChangeSeconds = useCallback(
        (seconds: string) => {
            setValue({ timeInputKey: "seconds", value: seconds });
        },
        [setValue],
    );

    const handleChangeMinutes = useCallback(
        (minutes: string) => {
            setValue({ timeInputKey: "minutes", value: minutes });
        },
        [setValue],
    );

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
                            value={value?.minutes}
                        ></ThemedTextInput>
                        <ThemedView ghost>
                            <Text ghost>{minutesSuffix}</Text>
                        </ThemedView>
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
                            value={value?.seconds}
                        ></ThemedTextInput>
                        <ThemedView ghost>
                            <Text ghost>{secondsSuffix}</Text>
                        </ThemedView>
                    </HStack>
                </ThemedPressable>
            </HStack>
        </ThemedView>
    );
};
