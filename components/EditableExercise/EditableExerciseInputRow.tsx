import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useCallback, useEffect, useMemo, useState } from "react";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import { AppState, ErrorFields } from "../../store/types";
import { useAppSelector } from "../../store";
import { getErrorByKey } from "../../store/selectors";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";

type ExerciseInputType = "NORMAL" | "MINUTES_SECONDS";
interface EditableExerciseInputRowProps {
    value?: string;
    type?: ExerciseInputType;
    setValue: (value: string) => void;
    errorKey?: ErrorFields;
    i18key?: string;
    stretch?: boolean;
    behind?: boolean;
}
export const EditableExerciseInputRow = ({ value, setValue, errorKey, i18key, type = "NORMAL", stretch, behind }: EditableExerciseInputRowProps) => {
    const { t } = useTranslation();
    const { errorColor } = useTheme();
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state)(errorKey));
    const inputStyles = useMemo(() => [{ borderColor: hasError ? errorColor : "transparent" }, styles.input], [errorColor, hasError]);
    const [seconds, setSeconds] = useState<string>("");
    const [minutes, setMinutes] = useState<string>("");

    const handleSetValue = useCallback(
        (val: string, inputType?: "min" | "sec") => {
            if (type === "NORMAL") {
                console.log(val);
                setValue(val);
            } else {
                if (inputType === "min") {
                    setMinutes(val || "0");
                }
                if (inputType === "sec") {
                    setSeconds(val || "0");
                }
            }
        },
        [setValue, type],
    );

    useEffect(() => {
        if (type === "MINUTES_SECONDS") {
            const parsedSeconds = parseFloat(seconds ?? "0");
            const parsedMinutes = parseFloat(minutes ?? "0");
            setValue((parsedMinutes * 60 + parsedSeconds).toString());
        }
    }, [seconds, minutes]);

    if (type === "MINUTES_SECONDS") {
        return (
            <ThemedView ghost>
                <Text behind style={styles.label} ghost>
                    {t(i18key ?? "")}
                </Text>
                <HStack behind ghost style={{ gap: 10 }}>
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
        <ThemedView behind ghost stretch={stretch}>
            <Text behind style={styles.label} ghost>
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
