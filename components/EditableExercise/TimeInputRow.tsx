import { useCallback, useMemo } from "react";
import { styles, timeInputStyles } from "./styles";

import { Picker } from "@react-native-picker/picker";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";
import { AppState, useAppSelector } from "../../store";
import { getErrorByKey } from "../../store/selectors/errors/errorSelectors";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";
import { ErrorText } from "../ErrorText/ErrorText";
import { HelpText } from "../HelpText/HelpText";
import { PageContent } from "../PageContent/PageContent";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedView } from "../Themed/ThemedView/View";
import { TimeInputRowProps } from "./types";

const numberSteps5 = Array.from({ length: 13 }, (_, i) => (i * 5).toString().padStart(2, "0")).map((i) => {
	const label = i === "60" ? "59" : i;
	return <Picker.Item color="white" key={`minutes-${i}`} label={label} value={label} />;
});
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
	const { t } = useTypedTranslation();
	const hasError = useAppSelector((state: AppState) => getErrorByKey(state, errorTextConfig?.errorKey));
	const secondsSuffix = useMemo(() => t(TranslationKeys.SECONDS), [t]);
	const minutesSuffix = useMemo(() => t(TranslationKeys.MINUTES), [t]);
	const { ref, openBottomSheet } = useBottomSheetRef();

	const handleChangeSeconds = useCallback(
		(seconds: string) => {
			const secondsNumber = Number.parseFloat(seconds);
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
			const minutesNumber = Number.parseFloat(minutes);
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
			return t(TranslationKeys.SECONDS_LONG_SINGULAR);
		}
		return t(TranslationKeys.SECONDS_LONG);
	}, [seconds, t]);
	const minutesLabel = useMemo(() => {
		if (minutes === "01") {
			return t(TranslationKeys.MINUTES_LONG_SINGULAR);
		}
		return t(TranslationKeys.MINUTES_LONG);
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

	const minutesText = useMemo(() => minutes?.padStart(2, "0") || "00", [minutes]);
	const secondsText = useMemo(() => seconds?.padStart(2, "0") || "00", [seconds]);

	const selectionColor = useMemo(() => "rgba(1,0,0,0.000001)", []);

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
				<HStack style={wrapperStyle} hasError={hasError} input={input} background={background} stretch center round>
					<Text ghost stretch error={hasError} style={leftTextStyles} textSecondary={showSecondary}>
						{minutesText}
					</Text>
					<Text error={hasError} style={textStyle} textSecondary={showSecondary} ghost>
						:
					</Text>
					<Text error={hasError} ghost textSecondary={showSecondary} stretch style={rightTextStyles}>
						{secondsText}
					</Text>
				</HStack>
			</ThemedPressable>
			<ThemedBottomSheetModal dismissOnClose allowSwipeDownToClose={false} title={label} ref={ref}>
				<PageContent ghost>
					<HStack center ghost>
						<ThemedView round style={timeInputStyles.wrapper} />
						<HStack ghost stretch center>
							<Picker
								itemStyle={timeInputStyles.pickerItem}
								style={timeInputStyles.picker}
								selectionColor={selectionColor}
								selectedValue={minutes}
								onValueChange={handleChangeMinutes}
							>
								{numberArray}
							</Picker>
							<Text style={timeInputStyles.text} ghost>
								{minutesLabel}
							</Text>
						</HStack>
						<HStack ghost stretch center>
							<Picker
								itemStyle={timeInputStyles.pickerItem}
								style={timeInputStyles.picker}
								selectionColor={selectionColor}
								selectedValue={seconds}
								onValueChange={handleChangeSeconds}
							>
								{numberSteps5}
							</Picker>
							<Text style={timeInputStyles.text} ghost>
								{secondsLabel}
							</Text>
						</HStack>
					</HStack>
				</PageContent>
			</ThemedBottomSheetModal>
			{hasError && <ErrorText errorKey={errorTextConfig?.errorKey}>{errorTextConfig?.errorText}</ErrorText>}
		</ThemedView>
	);
};
