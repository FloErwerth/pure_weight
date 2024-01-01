import { ThemedPressable } from "../../../../Themed/Pressable/Pressable";
import { Pressable, View } from "react-native";
import { Text } from "../../../../Themed/ThemedText/Text";
import { PropsWithChildren } from "react";
import { styles } from "./styles";
import { HelpAnswer } from "../../../../HelpQuestionAnswer/HelpQuestion";
import { SnapPoint, ThemedBottomSheetModal, useBottomSheetRef } from "../../../../BottomSheetModal/ThemedBottomSheetModal";
import { ThemedMaterialCommunityIcons } from "../../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { HStack } from "../../../../Stack/HStack/HStack";
import { AnswerText } from "../../../../HelpQuestionAnswer/AnswerText";

interface ProfileContentProps extends PropsWithChildren {
    title?: string;
    onPress?: () => void;
    helpText?: { title?: string; text: string; iconSize?: number };
    snapPoints?: SnapPoint[];
}
export const ProfileContent = ({ onPress, children, title, helpText, snapPoints }: ProfileContentProps) => {
    const [ref, open] = useBottomSheetRef();
    return (
        <View>
            <ThemedPressable onPress={onPress} style={styles.outerWrapper}>
                <View style={styles.innerWrapperChildren}>
                    <HStack style={styles.stack}>
                        {title ? <Text style={styles.title}>{title}</Text> : <View />}
                        {helpText && (
                            <Pressable onPress={open}>
                                <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={helpText.iconSize ?? 24} />
                            </Pressable>
                        )}
                    </HStack>
                    {children}
                </View>
            </ThemedPressable>
            <ThemedBottomSheetModal snapPoints={snapPoints} title={helpText?.title} ref={ref}>
                <HelpAnswer>
                    <AnswerText>{helpText?.text}</AnswerText>
                </HelpAnswer>
            </ThemedBottomSheetModal>
        </View>
    );
};
