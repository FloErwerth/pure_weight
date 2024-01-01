import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useCallback, useMemo, useRef } from "react";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import { AppState, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";
import { getErrorByKey } from "../../store/reducers/errors/errorSelectors";
import { borderRadius } from "../../theme/border";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { TextInput } from "react-native";
import { EditableExerciseInputRowProps } from "./types";

export const EditableExerciseInputRow = ({ value = "0", setValue, errorKey, i18key, stretch, suffix }: EditableExerciseInputRowProps) => {
    const { t } = useTranslation();
    const { errorColor } = useTheme();
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state)(errorKey));
    const inputStyles = useMemo(() => [{ borderColor: hasError ? errorColor : "transparent" }, styles.input], [errorColor, hasError]);
    const textInputRef = useRef<TextInput>(null);

    const handleSetValue = useCallback(
        (val: string) => {
            setValue(val);
        },
        [setValue],
    );

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
                {suffix && (
                    <ThemedView ghost>
                        <Text ghost>{suffix}</Text>
                    </ThemedView>
                )}
            </HStack>
        </ThemedPressable>
    );
};
