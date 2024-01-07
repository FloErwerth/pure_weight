import { ThemedPressable } from "../Pressable/Pressable";
import { useCallback, useMemo, useRef } from "react";
import { ThemedMaterialCommunityIcons } from "../ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { HStack } from "../../Stack/HStack/HStack";
import { Text } from "../ThemedText/Text";
import { styles } from "./styles";
import { ThemedView } from "../ThemedView/View";
import { borderRadius } from "../../../theme/border";
import { Animated, Pressable, View } from "react-native";
import { SnapPoint, ThemedBottomSheetModal, useBottomSheetRef } from "../../BottomSheetModal/ThemedBottomSheetModal";
import { HelpAnswer } from "../../HelpQuestionAnswer/HelpQuestion";
import { AnswerText } from "../../HelpQuestionAnswer/AnswerText";

interface CheckBoxProps {
    checked: boolean;
    onChecked: (checked: boolean) => void;
    size?: number;
    label: string;
    helpText?: { title?: string; text: string };
    disabled?: boolean;
    snapPoints?: SnapPoint[];
}

export const CheckBox = ({ checked, onChecked, size = 20, label, helpText, disabled, snapPoints }: CheckBoxProps) => {
    const opacity = useRef(new Animated.Value(0));
    const checkBoxWrapperStyle = useMemo(() => ({ borderRadius: borderRadius < size ? size / 4 : borderRadius, width: size + 2, height: size + 2 }), [size]);
    const checkStyle = useMemo(() => ({ opacity: opacity.current }), [opacity]);
    const [ref, open] = useBottomSheetRef();

    const handleCheck = useCallback(() => {
        if (checked) {
            onChecked?.(false);
            Animated.timing(opacity.current, { toValue: 0, duration: 50, useNativeDriver: false }).start();
        } else {
            onChecked?.(true);
            Animated.timing(opacity.current, { toValue: 1, duration: 50, useNativeDriver: false }).start();
        }
    }, [checked, onChecked, opacity]);

    return (
        <View>
            <ThemedView style={styles.outerWrapper} ghost>
                <HStack input style={styles.wrapper}>
                    <Text ghost style={styles.text}>
                        {label}
                    </Text>
                    <HStack ghost style={{ gap: 10 }}>
                        <ThemedPressable secondary style={checkBoxWrapperStyle} onPress={handleCheck}>
                            <Animated.View style={checkStyle}>
                                <ThemedMaterialCommunityIcons ghost name="check" size={size} />
                            </Animated.View>
                        </ThemedPressable>
                        {!disabled && helpText && (
                            <Pressable disabled={disabled} onPress={open}>
                                <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={size} />
                            </Pressable>
                        )}
                    </HStack>
                </HStack>
            </ThemedView>
            <ThemedBottomSheetModal snapPoints={snapPoints} title={helpText?.title} ref={ref}>
                <HelpAnswer>
                    <AnswerText>{helpText?.text}</AnswerText>
                </HelpAnswer>
            </ThemedBottomSheetModal>
        </View>
    );
};
