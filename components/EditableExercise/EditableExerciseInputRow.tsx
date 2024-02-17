import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";
import { getErrorByKey } from "../../store/reducers/errors/errorSelectors";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { TextInput, View } from "react-native";
import { EditableExerciseInputRowProps } from "./types";
import { cleanError } from "../../store/reducers/errors";
import { HelpText } from "../HelpText/HelpText";
import { ErrorText } from "../ErrorText/ErrorText";

export const EditableExerciseInputRow = ({
    value = "",
    setValue,
    errorTextConfig,
    i18key,
    stretch,
    suffix,
    placeholder = "0",
    helpTextConfig,
    maxLength,
}: EditableExerciseInputRowProps) => {
    const { t } = useTranslation();
    const { errorColor } = useTheme();
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state, errorTextConfig?.errorKey));
    const inputStyles = useMemo(() => [{ borderColor: hasError ? errorColor : "transparent" }, styles.input], [errorColor, hasError]);
    const textInputRef = useRef<TextInput>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<View>(null);
    const dispatch = useAppDispatch();

    const handleSetValue = useCallback(
        (val: string) => {
            if (hasError && errorTextConfig?.errorKey) {
                dispatch(cleanError([errorTextConfig?.errorKey]));
            }
            setValue(val);
        },
        [dispatch, errorTextConfig?.errorKey, hasError, setValue],
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
            left: Math.min(containerWidth - 20, containerWidth / 2 + (value?.length || 1) * 6.5),
        } as const;
    }, [containerWidth, value]);

    const handleFocusInput = useCallback(() => {
        textInputRef.current?.focus();
    }, [textInputRef]);

    return (
        <ThemedPressable reference={containerRef} onPress={handleFocusInput} behind ghost stretch={stretch}>
            {(Boolean(i18key) || helpTextConfig) && (
                <HStack ghost style={styles.labelWrapper}>
                    <Text behind style={styles.label} ghost>
                        {t(i18key ?? " ")}
                    </Text>
                    <View style={styles.label}></View>
                    {helpTextConfig && <HelpText helpTextConfig={helpTextConfig} />}
                </HStack>
            )}
            <HStack round center style={{ justifyContent: "center" }}>
                <ThemedTextInput
                    ghost
                    stretch
                    reference={textInputRef}
                    inputMode="decimal"
                    textAlign="center"
                    style={inputStyles}
                    onChangeText={handleSetValue}
                    value={value}
                    maxLength={maxLength}
                    placeholder={placeholder}></ThemedTextInput>
                {suffix && (
                    <ThemedView style={suffixContainerStyles} ghost>
                        <Text ghost>{suffix}</Text>
                    </ThemedView>
                )}
            </HStack>
            {!errorTextConfig?.hideError && hasError && <ErrorText>{errorTextConfig?.errorText}</ErrorText>}
        </ThemedPressable>
    );
};
