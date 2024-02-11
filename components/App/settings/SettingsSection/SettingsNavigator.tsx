import { PropsWithChildren, useCallback } from "react";
import { styles } from "./styles";
import { Text } from "../../../Themed/ThemedText/Text";
import { HStack } from "../../../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { Routes, useNavigate } from "../../../../hooks/navigate";

interface SettingsSectionProps extends PropsWithChildren {
    title: string;
    page: keyof typeof Routes;
    input?: boolean;
}
export const SettingsNavigator = ({ title, page, input }: SettingsSectionProps) => {
    const navigate = useNavigate();

    const onPress = useCallback(() => {
        navigate(page);
    }, [navigate, page]);

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
