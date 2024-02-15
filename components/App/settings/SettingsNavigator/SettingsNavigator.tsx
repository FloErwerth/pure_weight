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
    helpText?: { title: string; text: string; iconSize?: number };
}
export const SettingsNavigator = ({ title, input, onPress, helpText }: SettingsSectionProps) => {
    const { ref, openBottomSheet } = useBottomSheetRef();

    return (
        <>
            <HStack ghost stretch>
                <ThemedPressable padding onPress={onPress} stretch input={input} style={styles.outerWrapper}>
                    <HStack input={input} style={styles.innerWrapper}>
                        <HStack stretch>
                            <Text input={input} style={styles.title}>
                                {title}
                            </Text>
                            {helpText && (
                                <Pressable onPress={openBottomSheet}>
                                    <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={helpText.iconSize ?? 24} />
                                </Pressable>
                            )}
                        </HStack>
                        <ThemedMaterialCommunityIcons ghost name="arrow-right" size={23} />
                    </HStack>
                </ThemedPressable>
            </HStack>
            <ThemedBottomSheetModal title={helpText?.title} ref={ref}>
                <HelpAnswer>
                    <AnswerText>{helpText?.text}</AnswerText>
                </HelpAnswer>
            </ThemedBottomSheetModal>
        </>
    );
};
