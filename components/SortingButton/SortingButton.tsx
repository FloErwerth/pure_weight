import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { Text } from "../Themed/ThemedText/Text";
import { styles } from "./styles";
import { ComponentProps, useCallback } from "react";
import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

type SortingButtonProps = {
    iconName: ComponentProps<typeof MaterialCommunityIcons>["name"];
    title: string;
    hide?: boolean;
    mappedOptions: Array<{
        iconName: ComponentProps<typeof MaterialCommunityIcons>["name"];
        value: string;
        label: string;
        selectCallback: () => void;
    }>;
};

export const SortingButton = ({ iconName, title, mappedOptions, hide = false }: SortingButtonProps) => {
    const { t } = useTranslation();
    const { ref, openBottomSheet: open, closeBottomSheet: close } = useBottomSheetRef();

    const handleSelectedValue = useCallback(
        (selectCallback: () => void) => {
            close();
            selectCallback();
        },
        [close],
    );

    if (hide) {
        return null;
    }

    return (
        <View>
            <ThemedPressable ghost style={styles.wrapper} onPress={open}>
                <HStack ghost style={styles.optionStack}>
                    <ThemedMaterialCommunityIcons ghost name={iconName} size={20} />
                    <Text ghost style={styles.title}>
                        {title}
                    </Text>
                </HStack>
            </ThemedPressable>
            <ThemedBottomSheetModal title={t("sorting_modal_title")} ref={ref}>
                <ThemedView ghost style={styles.optionWrapper}>
                    {mappedOptions.map(({ iconName, value, label, selectCallback }) => (
                        <ThemedPressable key={value} onPress={() => handleSelectedValue(selectCallback)} style={styles.option}>
                            <HStack style={styles.optionStack}>
                                <ThemedMaterialCommunityIcons name={iconName} size={20} />
                                <Text ghost style={styles.optionText}>
                                    {label}
                                </Text>
                            </HStack>
                        </ThemedPressable>
                    ))}
                </ThemedView>
            </ThemedBottomSheetModal>
        </View>
    );
};
