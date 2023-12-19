import { ThemedPressable } from "../../../../Themed/Pressable/Pressable";
import { View } from "react-native";
import { Text } from "../../../../Themed/ThemedText/Text";
import { PropsWithChildren } from "react";
import { styles } from "./styles";

interface ProfileContentProps extends PropsWithChildren {
    title: string;
    onPress?: () => void;
}
export const ProfileContent = ({ onPress, children, title }: ProfileContentProps) => {
    return (
        <ThemedPressable onPress={onPress} style={styles.outerWrapper}>
            <View style={styles.innerWrapperChildren}>
                <Text style={styles.title}>{title}</Text>
                {children}
            </View>
        </ThemedPressable>
    );
};
