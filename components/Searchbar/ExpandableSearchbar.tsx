import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { SearchbarProps } from "./types";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Keyboard, Pressable, TextInput } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

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
    const { t } = useTranslation();
    const placeholder = useMemo(() => t("settings_search_placeholder"), [t]);
    const [showInput, setShowInput] = useState(false);
    const positionLeft = useSharedValue(TEXT_INPUT_VALUES.start.left);
    const animatedWidth = useSharedValue(TEXT_INPUT_VALUES.start.width);
    const animatedOpacity = useSharedValue(TEXT_INPUT_VALUES.start.opacity);
    const ref = useRef<TextInput>(null);

    useEffect(() => {}, [animatedOpacity, animatedWidth, positionLeft, showInput]);

    const animatedInputStyles = useAnimatedStyle(
        () => ({ position: "absolute", top: -5, width: animatedWidth.value, left: positionLeft.value, opacity: animatedOpacity.value }),
        [],
    );

    const handleHideInput = useCallback(() => {
        //hide
        positionLeft.value = withTiming(TEXT_INPUT_VALUES.start.left, { duration: 200 });
        animatedWidth.value = withTiming(TEXT_INPUT_VALUES.start.width, { duration: 200 });
        animatedOpacity.value = withTiming(TEXT_INPUT_VALUES.start.opacity, { duration: 200 });
    }, [animatedOpacity, animatedWidth, positionLeft]);

    const handleShowInput = useCallback(() => {
        //show
        positionLeft.value = withTiming(TEXT_INPUT_VALUES.end.left, { duration: 200 });
        animatedWidth.value = withTiming(TEXT_INPUT_VALUES.end.width, { duration: 200 });
        animatedOpacity.value = withTiming(TEXT_INPUT_VALUES.end.opacity, { duration: 200 });
    }, [animatedOpacity, animatedWidth, positionLeft]);

    const handleToggleSearch = useCallback(() => {
        if (showInput) {
            handleHideInput();
            Keyboard.dismiss();
            setShowInput(false);
        } else {
            handleShowInput();
            ref.current?.focus();
            setShowInput(true);
        }
    }, [handleShowInput, handleHideInput, showInput]);

    return (
        <ThemedView style={{ paddingVertical: 5 }} ghost round>
            <HStack ghost>
                <Animated.View style={animatedInputStyles}>
                    <ThemedTextInput reference={ref} showClear onChangeText={handleSetSearchManual} placeholder={placeholder} />
                </Animated.View>
                <Pressable onPress={handleToggleSearch}>
                    <ThemedMaterialCommunityIcons name="magnify" ghost size={30} />
                </Pressable>
            </HStack>
        </ThemedView>
    );
};
