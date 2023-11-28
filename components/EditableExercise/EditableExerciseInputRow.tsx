import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useCallback, useEffect, useMemo, useState } from "react";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import { AppState, useAppSelector } from "../../store";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";
import { ErrorFields } from "../../store/reducers/errors";
import { getErrorByKey } from "../../store/reducers/errors/errorSelectors";

type ExerciseInputType = "NORMAL" | "MINUTES_SECONDS";
interface EditableExerciseInputRowProps {
    value?: string;
    type?: ExerciseInputType;
    setValue: (value: string) => void;
    errorKey?: ErrorFields;
    i18key?: string;
    stretch?: boolean;
}

const getMinutesFromValue = (value?: string) => {
    if (!value) {
        return "";
    }
    return Math.floor(parseFloat(value) / 60).toString();
};

const getSecondsFromValue = (value?: string) => {
    if (!value) {
        return "";
    }
    return Math.floor(parseFloat(value) % 60).toString();
};

export const EditableExerciseInputRow = ({ value, setValue, errorKey, i18key, type = "NORMAL", stretch }: EditableExerciseInputRowProps) => {
    const { t } = useTranslation();
    const { errorColor } = useTheme();
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state)(errorKey));
    const inputStyles = useMemo(() => [{ borderColor: hasError ? errorColor : "transparent" }, styles.input], [errorColor, hasError]);
    const [seconds, setSeconds] = useState<string>(getSecondsFromValue(value));
    const [minutes, setMinutes] = useState<string>(getMinutesFromValue(value));

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
                    <ThemedTextInput
                        background
                        stretch
                        errorKey={errorKey}
                        inputMode="decimal"
                        textAlign="center"
                        placeholder={minutesSuffix}
                        onChangeText={handleChangeMinutes}
                        value={minutes}
                        suffix={minutesSuffix}
                    ></ThemedTextInput>
                    <ThemedTextInput
                        background
                        errorKey={errorKey}
                        stretch
                        inputMode="decimal"
                        textAlign="center"
                        placeholder={secondsSuffix}
                        suffix={secondsSuffix}
                        onChangeText={handleChangeSeconds}
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
