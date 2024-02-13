import { ThemedPressable } from "../../../../Themed/Pressable/Pressable";
import { Pressable, View } from "react-native";
import { Text } from "../../../../Themed/ThemedText/Text";
import { PropsWithChildren } from "react";
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
    return (
        <View>
            <ThemedPressable onPress={onPress}>
                <View style={styles.innerWrapperChildren}>
                    <HStack style={styles.stack}>
                        {title && <Text style={styles.title}>{title}</Text>}
                        {helpText && (
                            <Pressable onPress={open}>
                                <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={helpText.iconSize ?? 24} />
                            </Pressable>
                        )}
                    </HStack>
                    {children}
                </View>
            </ThemedPressable>
            <ThemedBottomSheetModal title={helpText?.title} ref={ref}>
                <HelpAnswer>
                    <AnswerText>{helpText?.text}</AnswerText>
                </HelpAnswer>
            </ThemedBottomSheetModal>
        </View>
    );
};
