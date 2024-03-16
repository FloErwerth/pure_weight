import { PropsWithChildren } from "react";
import { styles } from "./styles";
import { Text } from "../../../Themed/ThemedText/Text";
import { HStack } from "../../../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../BottomSheetModal/ThemedBottomSheetModal";
import { Pressable } from "react-native";
import { HelpAnswer } from "../../../HelpQuestionAnswer/HelpQuestion";
import { AnswerText } from "../../../HelpQuestionAnswer/AnswerText";

interface SettingsSectionProps extends PropsWithChildren {
    title: string;
    onPress: () => void;
    input?: boolean;
    content?: { title: string; text: string; iconSize?: number };
    stretch?: boolean;
}
export const SettingsNavigator = ({ title, input, onPress, content, stretch = true }: SettingsSectionProps) => {
    const { ref, openBottomSheet } = useBottomSheetRef();

    return (
        <>
            <HStack ghost stretch={stretch}>
                <ThemedPressable padding onPress={onPress} stretch input={input} style={styles.outerWrapper}>
                    <HStack input={input} style={styles.innerWrapper}>
                        <HStack stretch>
                            <Text input={input} style={styles.title}>
                                {title}
                            </Text>
                            {content && (
                                <Pressable onPress={openBottomSheet}>
                                    <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={content.iconSize ?? 24} />
                                </Pressable>
                            )}
                        </HStack>
                        <ThemedMaterialCommunityIcons ghost name="chevron-right" size={23} />
                    </HStack>
                </ThemedPressable>
            </HStack>
            <ThemedBottomSheetModal title={content?.title} ref={ref}>
                <HelpAnswer>
                    <AnswerText>{content?.text}</AnswerText>
                </HelpAnswer>
            </ThemedBottomSheetModal>
        </>
    );
};
