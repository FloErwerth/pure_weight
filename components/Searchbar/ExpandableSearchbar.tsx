import { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, Keyboard, Pressable, TextInput } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";
import { SearchbarProps } from "./types";

const screenWidth = Dimensions.get("screen").width;
const TEXT_INPUT_VALUES = {
	start: {
		width: 0,
		left: 0,
		opacity: 0,
	},
	end: {
		width: screenWidth - 80,
		left: -screenWidth + 70,
		opacity: 1,
	},
};

export const ExpandableSearchbar = ({ handleSetSearchManual }: SearchbarProps) => {
	const { t } = useTypedTranslation();
	const placeholder = useMemo(() => t(TranslationKeys.SETTINGS_SEARCH_PLACEHOLDER), [t]);
	const [showInput, setShowInput] = useState(false);
	const positionLeft = useSharedValue(TEXT_INPUT_VALUES.start.left);
	const animatedWidth = useSharedValue(TEXT_INPUT_VALUES.start.width);
	const animatedOpacity = useSharedValue(TEXT_INPUT_VALUES.start.opacity);
	const ref = useRef<TextInput>(null);

	const animatedInputStyles = useAnimatedStyle(
		() => ({ position: "absolute", top: -5, width: animatedWidth.value, left: positionLeft.value, opacity: animatedOpacity.value }),
		[],
	);

	const handleHideInput = useCallback(() => {
		positionLeft.value = withTiming(TEXT_INPUT_VALUES.start.left, { duration: 200, easing: Easing.out(Easing.ease) });
		animatedWidth.value = withTiming(TEXT_INPUT_VALUES.start.width, { duration: 200, easing: Easing.out(Easing.ease) });
		animatedOpacity.value = withTiming(TEXT_INPUT_VALUES.start.opacity, { duration: 200, easing: Easing.out(Easing.ease) });
	}, [animatedOpacity, animatedWidth, positionLeft]);

	const handleShowInput = useCallback(() => {
		positionLeft.value = withTiming(TEXT_INPUT_VALUES.end.left, { duration: 200 });
		animatedWidth.value = withTiming(TEXT_INPUT_VALUES.end.width, { duration: 200 });
		animatedOpacity.value = withTiming(TEXT_INPUT_VALUES.end.opacity, { duration: 200 });
	}, [animatedOpacity, animatedWidth, positionLeft]);

	const handleToggleSearch = useCallback(() => {
		if (showInput) {
			Keyboard.dismiss();
			setShowInput(false);
			setTimeout(() => {
				handleHideInput();
			}, 150);
		} else {
			handleShowInput();
			ref.current?.focus();
			setShowInput(true);
		}
	}, [handleShowInput, handleHideInput, showInput]);

	const handleBlur = useCallback(() => {
		if (showInput) {
			handleToggleSearch();
		}
	}, [showInput, handleToggleSearch]);

	return (
		<ThemedView style={styles.wrapper} ghost round>
			<HStack ghost>
				<Animated.View style={animatedInputStyles}>
					<ThemedTextInput round onBlur={handleBlur} reference={ref} showClear onChangeText={handleSetSearchManual} placeholder={placeholder} />
				</Animated.View>
				<Pressable onPress={handleToggleSearch}>
					<ThemedMaterialCommunityIcons name="magnify" ghost size={30} />
				</Pressable>
			</HStack>
		</ThemedView>
	);
};
