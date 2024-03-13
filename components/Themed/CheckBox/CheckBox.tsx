import { ThemedPressable } from "../Pressable/Pressable";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ThemedMaterialCommunityIcons } from "../ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { HStack } from "../../Stack/HStack/HStack";
import { Text } from "../ThemedText/Text";
import { styles } from "./styles";
import { ThemedView } from "../ThemedView/View";
import { borderRadius } from "../../../theme/border";
import { Animated, ViewStyle } from "react-native";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../BottomSheetModal/ThemedBottomSheetModal";
import { HelpAnswer } from "../../HelpQuestionAnswer/HelpQuestion";
import { AnswerText } from "../../HelpQuestionAnswer/AnswerText";

interface CheckBoxProps {
    checked: boolean;
    onChecked: (checked: boolean) => void;
    size?: number;
    label: string;
    helpTextConfig?: { title?: string; text: string; iconSize?: number };
    disabled?: boolean;
    customWrapperStyles?: ViewStyle;
    input?: boolean;
    secondary?: boolean;
    ghost?: boolean;
}

export const CheckBox = ({ checked, onChecked, size = 26, label, helpTextConfig, disabled, customWrapperStyles, input, secondary, ghost }: CheckBoxProps) => {
    const opacity = useRef(new Animated.Value(0));
    const checkBoxWrapperStyle = useMemo(() => ({ borderRadius: borderRadius < size ? size / 4 : borderRadius, width: size + 2, height: size + 2 }), [size]);
    const checkStyle = useMemo(() => ({ opacity: opacity.current }), [opacity]);
    const { ref, openBottomSheet, closeBottomSheet } = useBottomSheetRef();

    useEffect(() => {
        Animated.timing(opacity.current, {
            toValue: checked ? 1 : 0,
            duration: 25,
            useNativeDriver: true,
        }).start();
    }, [checked]);

    const handleCheck = useCallback(() => {
        onChecked?.(!checked);
    }, [checked, onChecked]);

    const outerWrapperStyles = useMemo(() => [styles.outerWrapper, customWrapperStyles], [customWrapperStyles]);

    return (
        <>
            <ThemedView style={outerWrapperStyles} ghost>
                <HStack input={input} ghost={ghost} secondary={secondary} style={styles.wrapper}>
                    <HStack ghost style={{ gap: 5, alignItems: "center" }}>
                        <Text ghost style={styles.text}>
                            {label}
                        </Text>
                        {helpTextConfig && (
                            <ThemedPressable ghost onPress={openBottomSheet}>
                                <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={helpTextConfig.iconSize || 20} />
                            </ThemedPressable>
                        )}
                    </HStack>
                    <ThemedPressable disabled={disabled} input={!disabled && !input} style={checkBoxWrapperStyle} onPress={handleCheck}>
                        <Animated.View style={checkStyle}>
                            <ThemedMaterialCommunityIcons disabled={disabled} ghost name="check" size={size} />
                        </Animated.View>
                    </ThemedPressable>
                </HStack>
            </ThemedView>
            <ThemedBottomSheetModal title={helpTextConfig?.title} ref={ref}>
                <HelpAnswer>
                    <AnswerText>{helpTextConfig?.text}</AnswerText>
                </HelpAnswer>
            </ThemedBottomSheetModal>
        </>
    );
};
