import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import { AppState, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";
import { getErrorByKey } from "../../store/reducers/errors/errorSelectors";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { TextInput, View } from "react-native";
import { EditableExerciseInputRowProps } from "./types";

export const EditableExerciseInputRow = ({
    value = "",
    setValue,
    errorKey,
    i18key,
    stretch,
    suffix,
    placeholder = "0",
}: EditableExerciseInputRowProps) => {
    const { t } = useTranslation();
    const { errorColor } = useTheme();
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state)(errorKey));
    const inputStyles = useMemo(() => [{ borderColor: hasError ? errorColor : "transparent" }, styles.input], [errorColor, hasError]);
    const textInputRef = useRef<TextInput>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<View>(null);

    const handleSetValue = useCallback(
        (val: string) => {
            const parsedValue = val ? parseFloat(val) : "";
            setValue(parsedValue.toString());
        },
        [setValue],
    );

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.measure((_x, _y, width) => {
                setContainerWidth(width);
            });
        }
    }, [containerRef]);

    const suffixContainerStyles = useMemo(() => {
        return {
            position: "absolute",
            width: containerWidth,
            left: Math.min(containerWidth - 20, containerWidth / 2 + (value?.length || 1) * 5),
        } as const;
    }, [containerWidth, value]);

    const handleFocusInput = useCallback(() => {
        textInputRef.current?.focus();
    }, [textInputRef]);

    return (
        <ThemedPressable reference={containerRef} onPress={handleFocusInput} behind ghost stretch={stretch}>
            {i18key && (
                <Text behind style={styles.label} ghost>
                    {t(i18key ?? "")}
                </Text>
            )}
            <HStack round center style={{ justifyContent: "center" }}>
                <ThemedTextInput
                    ghost
                    stretch
                    reference={textInputRef}
                    errorKey={errorKey}
                    inputMode="decimal"
                    textAlign="center"
                    style={inputStyles}
                    onChangeText={handleSetValue}
                    value={value}
                    maxLength={7}
                    placeholder={placeholder}></ThemedTextInput>
                {suffix && (
                    <ThemedView style={suffixContainerStyles} ghost>
                        <Text ghost>{suffix}</Text>
                    </ThemedView>
                )}
            </HStack>
        </ThemedPressable>
    );
};
