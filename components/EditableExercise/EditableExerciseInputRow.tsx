import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { useCallback, useMemo, useState } from "react";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import { AppState, ErrorFields } from "../../store/types";
import { useAppSelector } from "../../store";
import { getErrorByKey } from "../../store/selectors";
import { Center } from "../Center/Center";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedView } from "../Themed/ThemedView/View";

type ExerciseInputType = "NORMAL" | "TIME";
interface EditableExerciseInputRowProps {
    value?: string;
    type?: ExerciseInputType;
    setValue: (value: string) => void;
    errorKey?: ErrorFields;
    i18key?: string;
}
export const EditableExerciseInputRow = ({ value, setValue, errorKey, i18key, type = "NORMAL" }: EditableExerciseInputRowProps) => {
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
            <ThemedView stretch ghost style={styles.center}>
                <HStack ghost style={styles.time}>
                    <ThemedTextInput
                        bottomSheet
                        stretch
                        errorKey={errorKey}
                        inputMode="decimal"
                        textAlign="center"
                        style={inputStyles}
                        placeholder={t("minutes")}
                        onChangeText={(val) => handleSetValue(val, "min")}
                        value={minutes}
                    ></ThemedTextInput>
                    <ThemedTextInput
                        bottomSheet
                        stretch
                        errorKey={errorKey}
                        inputMode="decimal"
                        textAlign="center"
                        placeholder={t("seconds")}
                        style={inputStyles}
                        onChangeText={(val) => handleSetValue(val, "sec")}
                        value={seconds}
                    ></ThemedTextInput>
                </HStack>
                <Text ghost>{t(i18key ?? "")}</Text>
            </ThemedView>
        );
    }

    return (
        <Center style={styles.wrapper}>
            <ThemedTextInput
                bottomSheet
                errorKey={errorKey}
                inputMode="decimal"
                textAlign="center"
                style={inputStyles}
                onChangeText={handleSetValue}
                value={value}
            ></ThemedTextInput>
            <Text ghost>{t(i18key ?? "")}</Text>
        </Center>
    );
};
