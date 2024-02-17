import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { PageContent } from "../PageContent/PageContent";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { View } from "react-native";
import { AnswerText } from "../HelpQuestionAnswer/AnswerText";
import { styles } from "./styles";

type HelpTextProps = {
    helpTextConfig: {
        title: string;
        text: string;
        iconSize?: number;
    };
};
export const HelpText = ({ helpTextConfig: { title, text, iconSize = 20 } }: HelpTextProps) => {
    const { ref, openBottomSheet } = useBottomSheetRef();

    return (
        <View>
            <ThemedPressable ghost round style={styles.wrapper} onPress={openBottomSheet}>
                <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={iconSize} />
            </ThemedPressable>
            <ThemedBottomSheetModal title={title} ref={ref}>
                <PageContent ghost paddingTop={20}>
                    <AnswerText>{text}</AnswerText>
                </PageContent>
            </ThemedBottomSheetModal>
        </View>
    );
};
