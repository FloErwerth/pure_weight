import { ThemedPressable } from "../../../../Themed/Pressable/Pressable";
import { Pressable, View } from "react-native";
import { Text } from "../../../../Themed/ThemedText/Text";
import { PropsWithChildren, useMemo } from "react";
import { styles } from "./styles";
import { HelpAnswer } from "../../../../HelpQuestionAnswer/HelpQuestion";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../BottomSheetModal/ThemedBottomSheetModal";
import { ThemedMaterialCommunityIcons } from "../../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { HStack } from "../../../../Stack/HStack/HStack";
import { AnswerText } from "../../../../HelpQuestionAnswer/AnswerText";

interface ProfileContentProps extends PropsWithChildren {
    title?: string;
    onPress?: () => void;
    helpText?: { title?: string; text: string; iconSize?: number };
}
export const ProfileContent = ({ onPress, children, title, helpText }: ProfileContentProps) => {
    const { ref, openBottomSheet: open } = useBottomSheetRef();

    const size = useMemo(() => helpText?.iconSize ?? 24, [helpText?.iconSize]);
    const memoTitle = useMemo(() => helpText?.title, [helpText?.title]);
    const memoText = useMemo(() => helpText?.text, [helpText?.text]);

    return (
        <View>
            <ThemedPressable onPress={onPress}>
                <View style={styles.innerWrapperChildren}>
                    <HStack style={styles.stack}>
                        {title && <Text style={styles.title}>{title}</Text>}
                        {helpText && (
                            <Pressable onPress={open}>
                                <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={size} />
                            </Pressable>
                        )}
                    </HStack>
                    {children}
                </View>
            </ThemedPressable>
            <ThemedBottomSheetModal title={memoTitle} ref={ref}>
                <HelpAnswer>
                    <AnswerText>{memoText}</AnswerText>
                </HelpAnswer>
            </ThemedBottomSheetModal>
        </View>
    );
};
