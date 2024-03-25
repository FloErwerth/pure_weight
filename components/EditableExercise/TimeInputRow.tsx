import { useCallback, useMemo } from "react";
import { styles } from "./styles";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedView } from "../Themed/ThemedView/View";
import { TimeInputRowProps } from "./types";
import { useTranslation } from "react-i18next";
import { Text } from "../Themed/ThemedText/Text";
import { AppState, useAppSelector } from "../../store";
import { getErrorByKey } from "../../store/selectors/errors/errorSelectors";
import { ErrorText } from "../ErrorText/ErrorText";
import { HelpText } from "../HelpText/HelpText";
import { Picker } from "@react-native-picker/picker";
import {
    ThemedBottomSheetModal,
    useBottomSheetRef,
} from "../BottomSheetModal/ThemedBottomSheetModal";
import { PageContent } from "../PageContent/PageContent";
import { ThemedPressable } from "../Themed/Pressable/Pressable";

const numberSteps5 = Array.from({ length: 13 }, (_, i) => (i * 5).toString().padStart(2, "0")).map(
    (i) => {
        const label = i === "60" ? "59" : i;
        return <Picker.Item color="white" key={`minutes-${i}`} label={label} value={label} />;
    },
);
const numberArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map((i) => (
    <Picker.Item color="white" key={`seconds-${i}`} label={i} value={i} />
));

const isFalsy = (value: string | undefined) => !value || value === "0" || value === "00";

export const TimeInputRow = ({
    editable = true,
    hideSuffix,
    seconds,
    minutes,
    setMinutes,
    setSeconds,
    i18key,
    helpTextConfig,
    errorTextConfig,
    ghost,
    background,
    input = !ghost && !background,
    wrapperStyle,
    textStyle,
}: TimeInputRowProps) => {
    const { t } = useTranslation();
    const hasError = useAppSelector((state: AppState) =>
        getErrorByKey(state, errorTextConfig?.errorKey),
    );
    const secondsSuffix = useMemo(() => t("seconds"), [t]);
    const minutesSuffix = useMemo(() => t("minutes"), [t]);
    const { ref, openBottomSheet } = useBottomSheetRef();

    const handleChangeSeconds = useCallback(
        (seconds: string) => {
            const secondsNumber = parseFloat(seconds);
            let validatedValue = seconds;
            if (secondsNumber > 59) {
                validatedValue = "59";
            }
            setSeconds(validatedValue);
        },
        [setSeconds],
    );

    const handleChangeMinutes = useCallback(
        (minutes: string) => {
            const minutesNumber = parseFloat(minutes);
            let validatedValue = minutes;
            if (minutesNumber > 59) {
                validatedValue = "59";
            }
            setMinutes(validatedValue);
        },
        [setMinutes],
    );

    const hasValuesInTopBar = Boolean(i18key || !hideSuffix || helpTextConfig);

    const secondsLabel = useMemo(() => {
        if (seconds === "01") {
            return t("seconds_long_singular");
        }
        return t("seconds_long");
    }, [seconds, t]);
    const minutesLabel = useMemo(() => {
        if (minutes === "01") {
            return t("minutes_long_singular");
        }
        return t("minutes_long");
    }, [minutes, t]);

    const label = useMemo(() => {
        if (i18key) {
            return t(i18key);
        }
    }, [i18key, t]);

    const minutesSecondary = useMemo(() => {
        return isFalsy(minutes);
    }, [minutes]);
    const secondsSecondary = useMemo(() => {
        return isFalsy(seconds);
    }, [seconds]);

    const showSecondary = minutesSecondary && secondsSecondary;

    const leftTextStyles = useMemo(() => {
        return [{ textAlign: "right", marginRight: 2 } as const, textStyle];
    }, [textStyle]);
    const rightTextStyles = useMemo(() => {
        return [{ textAlign: "left", marginLeft: 2 } as const, textStyle];
    }, [textStyle]);

    return (
        <ThemedView stretch ghost>
            {hasValuesInTopBar && (
                <HStack ghost center style={{ justifyContent: "space-between" }}>
                    <HStack ghost center>
                        {label && (
                            <Text ghost style={styles.label}>
                                {label}
                            </Text>
                        )}
                        {!hideSuffix && (
                            <Text ghost placeholder style={styles.suffix}>
                                {minutesSuffix}&thinsp;:&thinsp;{secondsSuffix}
                            </Text>
                        )}
                    </HStack>
                    {helpTextConfig && <HelpText helpTextConfig={helpTextConfig} />}
                </HStack>
            )}
            <ThemedPressable stretch ghost disabled={!editable} onPress={openBottomSheet}>
                <HStack
                    style={wrapperStyle}
                    hasError={hasError}
                    input={input}
                    background={background}
                    stretch
                    center
                    round>
                    <Text
                        ghost
                        stretch
                        error={hasError}
                        style={leftTextStyles}
                        textSecondary={showSecondary}>
                        {minutes?.padStart(2, "0") || "00"}
                    </Text>
                    <Text error={hasError} style={textStyle} textSecondary={showSecondary} ghost>
                        :
                    </Text>
                    <Text
                        error={hasError}
                        ghost
                        textSecondary={showSecondary}
                        stretch
                        style={rightTextStyles}>
                        {seconds?.padStart(2, "0") || "00"}
                    </Text>
                </HStack>
            </ThemedPressable>
            <ThemedBottomSheetModal
                dismissOnClose
                allowSwipeDownToClose={false}
                title={label}
                ref={ref}>
                <PageContent ghost>
                    <HStack center ghost>
                        <ThemedView
                            round
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: 50,
                            }}
                        />
                        <HStack ghost stretch center>
                            <Picker
                                itemStyle={{
                                    textAlign: "left",
                                    fontSize: 25,
                                }}
                                style={{ flex: 1 }}
                                selectionColor={"rgba(1,0,0,0.000001)"}
                                selectedValue={minutes}
                                onValueChange={handleChangeMinutes}>
                                {numberArray}
                            </Picker>
                            <Text
                                style={{
                                    position: "absolute",
                                    pointerEvents: "none",
                                    left: "50%",
                                    top: "50%",
                                    transform: [{ translateY: -10 }, { translateX: -15 }],
                                }}
                                ghost>
                                {minutesLabel}
                            </Text>
                        </HStack>
                        <HStack ghost stretch center>
                            <Picker
                                itemStyle={{
                                    textAlign: "left",
                                    fontSize: 25,
                                }}
                                style={{ flex: 1 }}
                                selectionColor={"rgba(1,0,0,0.000001)"}
                                selectedValue={seconds}
                                onValueChange={handleChangeSeconds}>
                                {numberSteps5}
                            </Picker>
                            <Text
                                style={{
                                    position: "absolute",
                                    pointerEvents: "none",
                                    left: "50%",
                                    top: "50%",
                                    transform: [{ translateY: -10 }, { translateX: -15 }],
                                }}
                                ghost>
                                {secondsLabel}
                            </Text>
                        </HStack>
                    </HStack>
                </PageContent>
            </ThemedBottomSheetModal>
            {hasError && (
                <ErrorText errorKey={errorTextConfig?.errorKey}>
                    {errorTextConfig?.errorText}
                </ErrorText>
            )}
        </ThemedView>
    );
};
