import React, { useCallback, useRef } from "react";
import { styles } from "./styles";
import { Keyboard, View } from "react-native";
import { ThemedPressable } from "../Pressable/Pressable";
import { ThemedView } from "../ThemedView/View";
import { Text } from "../ThemedText/Text";
import { useTheme } from "../../../theme/context";
import { AppState, useAppSelector } from "../../../store";
import { getErrorByKey } from "../../../store/selectors/errors/errorSelectors";
import { ErrorText } from "../../ErrorText/ErrorText";
import { HStack } from "../../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../BottomSheetModal/ThemedBottomSheetModal";
import { PageContent } from "../../PageContent/PageContent";
import { ErrorFields } from "../../../store/reducers/errors/types";

interface ThemedDropdownProps<T extends readonly string[]> {
    isSelectable?: boolean;
    onSelectItem?: (value: T[number]) => void;
    placeholder?: string;
    value?: T[number];
    options?: { value: T[number]; label: string }[];
    errorKey?: ErrorFields;
    secondary?: boolean;
    modalTitle?: string;
    stretch?: boolean;
    hideCheck?: boolean;
}

function Separator({ show }: { show: boolean }) {
    const { backgroundColor } = useTheme();

    if (!show) {
        return null;
    }

    return <View style={{ height: 1, backgroundColor: backgroundColor }} />;
}

export function ThemedDropdown<T extends readonly string[]>({ secondary, isSelectable, errorKey, options, onSelectItem, placeholder, value, stretch, modalTitle, hideCheck }: ThemedDropdownProps<T>) {
    const containerRef = useRef<View>(null);
    const error = useAppSelector((state: AppState) => getErrorByKey(state, errorKey));
    const { ref: dropdownRef, openBottomSheet: openDropdown, closeBottomSheet: closeDropdown } = useBottomSheetRef();

    const togglePicker = useCallback(() => {
        Keyboard.dismiss();
        openDropdown();
    }, [openDropdown]);

    const handleSelectItem = useCallback(
        (value: T[number]) => {
            closeDropdown();
            onSelectItem?.(value);
        },
        [closeDropdown, onSelectItem],
    );

    const itemWrapperStyle = [
        {
            justifyContent: hideCheck ? "center" : "space-between",
            paddingLeft: hideCheck ? 0 : 10,
            paddingRight: hideCheck ? 0 : 15,
        } as const,
    ];

    return (
        <>
            <ThemedView style={styles.wrapper} stretch={stretch} ghost>
                <ThemedPressable secondary={secondary} error={error} disabled={!isSelectable} reference={containerRef} style={styles.selectedItemWrapper} onPress={togglePicker}>
                    <Text ghost disabled={!isSelectable} error={error} style={styles.selectedItem}>
                        {value || placeholder}
                    </Text>
                </ThemedPressable>

                {error && <ErrorText errorKey={"create_measurement_type"} />}

                <ThemedBottomSheetModal ref={dropdownRef} title={modalTitle}>
                    <PageContent ignorePadding paddingTop={20} stretch input>
                        {options?.map((option, index) => (
                            <ThemedView key={option.value} stretch ghost>
                                <ThemedPressable ghost onPress={() => handleSelectItem(option.value)}>
                                    <HStack center style={itemWrapperStyle} gap ghost>
                                        <Text ghost style={styles.item}>
                                            {option.label}
                                        </Text>
                                        {!hideCheck && option.label === value && <ThemedMaterialCommunityIcons name="check" size={20} ghost />}
                                    </HStack>
                                </ThemedPressable>
                                <Separator show={index < options.length - 1} />
                            </ThemedView>
                        ))}
                    </PageContent>
                </ThemedBottomSheetModal>
            </ThemedView>
        </>
    );
}
