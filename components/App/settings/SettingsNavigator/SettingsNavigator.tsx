import { PropsWithChildren } from "react";
import { styles } from "./styles";
import { Text } from "../../../Themed/ThemedText/Text";
import { HStack } from "../../../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";

interface SettingsSectionProps extends PropsWithChildren {
    title: string;
    onPress: () => void;
    input?: boolean;
}
export const SettingsNavigator = ({ title, input, onPress }: SettingsSectionProps) => {
    return (
        <ThemedPressable input={input} onPress={onPress} style={styles.outerWrapper}>
            <HStack input={input} style={styles.innerWrapper}>
                <Text input={input} style={styles.title}>
                    {title}
                </Text>
                <ThemedMaterialCommunityIcons ghost name="arrow-right" size={23} />
            </HStack>
        </ThemedPressable>
    );
};
