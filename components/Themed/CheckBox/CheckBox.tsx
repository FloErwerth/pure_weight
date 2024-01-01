import { ThemedPressable } from "../Pressable/Pressable";
import { useCallback, useEffect, useMemo } from "react";
import { ThemedMaterialCommunityIcons } from "../ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { HStack } from "../../Stack/HStack/HStack";
import { Text } from "../ThemedText/Text";
import { styles } from "./styles";
import { ThemedView } from "../ThemedView/View";
import { borderRadius } from "../../../theme/border";
import { Pressable, View } from "react-native";
import { SnapPoint, ThemedBottomSheetModal, useBottomSheetRef } from "../../BottomSheetModal/ThemedBottomSheetModal";
import { HelpAnswer } from "../../HelpQuestionAnswer/HelpQuestion";
import { AnswerText } from "../../HelpQuestionAnswer/AnswerText";

interface CheckBoxProps {
    checked?: boolean;
    onChecked?: (checked: boolean) => void;
    size?: number;
    label: string;
    helpText?: { title?: string; text: string };
    disabled?: boolean;
    snapPoints?: SnapPoint[];
}

export const CheckBox = ({ checked = false, onChecked, size = 20, label, helpText, disabled, snapPoints }: CheckBoxProps) => {
    const opacity = useSharedValue(0);
    const checkBoxWrapperStyle = useMemo(() => ({ borderRadius: borderRadius < size ? size / 4 : borderRadius, width: size, height: size }), [size]);
    const checkStyle = useMemo(() => ({ opacity: opacity }), [opacity]);
    const [ref, open, close] = useBottomSheetRef();
    useEffect(() => {
        opacity.value = withTiming(checked ? 1 : 0, { duration: 100 });
    }, [checked]);

    const handleCheck = useCallback(() => {
        onChecked?.(!checked);
    }, [checked, onChecked]);

    return (
        <View>
            <ThemedPressable style={styles.outerWrapper} disabled={disabled} ghost onPress={handleCheck}>
                <HStack input style={styles.wrapper}>
                    <Text ghost style={styles.text}>
                        {label}
                    </Text>
                    <HStack ghost style={{ gap: 10 }}>
                        <ThemedView secondary style={checkBoxWrapperStyle}>
                            <Animated.View style={checkStyle}>
                                <ThemedMaterialCommunityIcons ghost name="check" size={size} />
                            </Animated.View>
                        </ThemedView>
                        {!disabled && helpText && (
                            <Pressable onPress={open}>
                                <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={size} />
                            </Pressable>
                        )}
                    </HStack>
                </HStack>
            </ThemedPressable>
            <ThemedBottomSheetModal snapPoints={snapPoints} title={helpText?.title} ref={ref}>
                <HelpAnswer>
                    <AnswerText>{helpText?.text}</AnswerText>
                </HelpAnswer>
            </ThemedBottomSheetModal>
        </View>
    );
};
