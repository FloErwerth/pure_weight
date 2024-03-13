import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { Text } from "../Themed/ThemedText/Text";

interface PurchaseTileProps {
    text: string;
    purchasePackage: () => void;
}

export const PurchaseTile = ({ purchasePackage, text }: PurchaseTileProps) => {
    return (
        <ThemedPressable onPress={purchasePackage}>
            <Text>{text}</Text>
        </ThemedPressable>
    );
};
