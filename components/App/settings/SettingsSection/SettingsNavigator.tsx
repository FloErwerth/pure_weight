import { PropsWithChildren } from "react";
import { styles } from "./styles";
import { Text } from "../../../Themed/ThemedText/Text";
import { HStack } from "../../../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";

interface SettingsSectionProps extends PropsWithChildren {
    title: string;
    onPress?: () => void;
}
export const SettingsNavigator = ({ onPress, title }: SettingsSectionProps) => {
    return (
        <ThemedPressable input onPress={onPress} style={styles.outerWrapper}>
            <HStack input style={styles.innerWrapper}>
                <Text input style={styles.title}>
                    {title}
                </Text>
                <ThemedMaterialCommunityIcons ghost name="arrow-right" size={23} />
            </HStack>
        </ThemedPressable>
    );
};
