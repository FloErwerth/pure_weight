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
}
export const SettingsNavigator = ({ title, page }: SettingsSectionProps) => {
    const navigate = useNavigate();

    const onPress = useCallback(() => {
        navigate(page);
    }, [navigate, page]);

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
