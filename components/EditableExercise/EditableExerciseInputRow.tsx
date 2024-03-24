import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useCallback, useMemo, useRef } from "react";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { HStack } from "../Stack/HStack/HStack";
import { getErrorByKey } from "../../store/selectors/errors/errorSelectors";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { TextInput, View } from "react-native";
import { EditableExerciseInputRowProps } from "./types";
import { cleanError } from "../../store/reducers/errors";

export const EditableExerciseInputRow = ({
    value = "",
    setValue,
    errorTextConfig,
    i18key,
    stretch,
    background,
    suffix,
    placeholder = "0",
    helpTextConfig,
    maxLength,
    bottomSheet,
}: EditableExerciseInputRowProps) => {
    const { t } = useTranslation();
    const { errorColor } = useTheme();
    const hasError = useAppSelector((state: AppState) =>
        getErrorByKey(state, errorTextConfig?.errorKey),
    );
    const textInputRef = useRef<TextInput>(null);
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

    const inputStyles = useMemo(
        () => [{ borderColor: hasError ? errorColor : "transparent" }, styles.input],
        [errorColor, hasError],
    );

    const handleFocusInput = useCallback(() => {
        textInputRef.current?.focus();
    }, [textInputRef]);

    return (
        <ThemedPressable
            reference={containerRef}
            onPress={handleFocusInput}
            behind
            ghost
            stretch={stretch}>
            {(Boolean(i18key) || helpTextConfig) && (
                <HStack ghost center style={styles.labelWrapper}>
                    <Text behind style={styles.label} ghost>
                        {t(i18key ?? " ")}
                    </Text>
                    {suffix && (
                        <Text ghost placeholder style={styles.suffix}>
                            {suffix}
                        </Text>
                    )}
                </HStack>
            )}
            <ThemedTextInput
                input={!background}
                errorKey={errorTextConfig?.errorKey}
                background={background}
                bottomSheet={bottomSheet}
                reference={textInputRef}
                inputMode="decimal"
                textAlign="center"
                style={inputStyles}
                onChangeText={handleSetValue}
                value={value}
                maxLength={maxLength}
                placeholder={placeholder}
            />
        </ThemedPressable>
    );
};
