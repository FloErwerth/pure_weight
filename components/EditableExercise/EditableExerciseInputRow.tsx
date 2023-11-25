import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useCallback, useMemo, useState } from "react";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import { AppState, ErrorFields } from "../../store/types";
import { useAppSelector } from "../../store";
import { getErrorByKey } from "../../store/selectors";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";

type ExerciseInputType = "NORMAL" | "TIME";
interface EditableExerciseInputRowProps {
    value?: string;
    type?: ExerciseInputType;
    setValue: (value: string) => void;
    errorKey?: ErrorFields;
    i18key?: string;
    stretch?: boolean;
}
export const EditableExerciseInputRow = ({ value, setValue, errorKey, i18key, type = "NORMAL", stretch }: EditableExerciseInputRowProps) => {
    const { t } = useTranslation();
    const { errorColor } = useTheme();
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state)(errorKey));
    const inputStyles = useMemo(() => [{ borderColor: hasError ? errorColor : "transparent" }, styles.input], [errorColor, hasError]);
    const [seconds, setSeconds] = useState<string | undefined>(undefined);
    const [minutes, setMinutes] = useState<string | undefined>(undefined);

    const handleSetValue = useCallback(
        (val: string, type?: "min" | "sec") => {
            if (type === "min") {
                setMinutes(val);
                setValue((parseFloat(val) * 60 + parseFloat(seconds ?? "0")).toString());
            }
            if (type === "sec") {
                setSeconds(val);
                setValue((parseFloat(minutes ?? "0") ?? 0) * 60 + parseFloat(val).toString());
            }
            setValue(val);
        },
        [minutes, seconds, setValue],
    );

    if (type === "TIME") {
        return (
            <ThemedView ghost>
                <Text style={styles.label} ghost>
                    {t(i18key ?? "")}
                </Text>
                <HStack ghost style={{ gap: 10 }}>
                    <ThemedTextInput
                        background
                        bottomSheet
                        style={{ flex: 1 }}
                        errorKey={errorKey}
                        inputMode="decimal"
                        textAlign="center"
                        placeholder={t("minutes")}
                        onChangeText={(val) => handleSetValue(val, "min")}
                        value={minutes}
                        suffix={t("minutes")}
                    ></ThemedTextInput>
                    <ThemedTextInput
                        background
                        bottomSheet
                        style={{ flex: 1 }}
                        errorKey={errorKey}
                        inputMode="decimal"
                        textAlign="center"
                        placeholder={t("seconds")}
                        suffix={t("seconds")}
                        onChangeText={(val) => handleSetValue(val, "sec")}
                        value={seconds}
                    ></ThemedTextInput>
                </HStack>
            </ThemedView>
        );
    }

    return (
        <ThemedView ghost stretch={stretch}>
            <Text style={styles.label} ghost>
                {t(i18key ?? "")}
            </Text>
            <ThemedTextInput
                bottomSheet
                errorKey={errorKey}
                inputMode="decimal"
                textAlign="center"
                style={inputStyles}
                onChangeText={handleSetValue}
                value={value}
            ></ThemedTextInput>
        </ThemedView>
    );
};
