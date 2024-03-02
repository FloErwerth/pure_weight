import { styles } from "./styles";
import { RefObject, useCallback, useMemo } from "react";
import { HStack } from "../Stack/HStack/HStack";
import * as Haptics from "expo-haptics";
import { Animated, Pressable, View } from "react-native";
import { Text } from "../Themed/ThemedText/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../theme/context";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedPressable } from "../Themed/Pressable/Pressable";

interface SiteNavigationButtonsProps {
    backButtonAction?: () => void;
    handleConfirm?: () => void;
    handleConfirmOpacity?: Animated.Value;
    handleConfirmIcon?: { name: "check" | "plus" | "cog" | "content-save-outline" | "content-copy"; size: number };
    title?: string;
    titleFontSize?: number;
    confirmButtonDisabled?: boolean;
    closeButtonDisabled?: boolean;
    confirmButtonRef?: RefObject<View>;
    handleQuicksettings?: () => void;
}
export const DEFAULT_PLUS = { name: "plus", size: 40 } as const;
export const SiteNavigationButtons = ({
    backButtonAction,
    title,
    titleFontSize = 25,
    handleConfirm,
    confirmButtonDisabled = false,
    closeButtonDisabled = false,
    handleConfirmIcon = { name: "check", size: 30 },
    confirmButtonRef,
    handleConfirmOpacity,
    handleQuicksettings,
}: SiteNavigationButtonsProps) => {
    const titleStyles = useMemo(
        () => ({
            ...styles.title,
            fontSize: titleFontSize,
            paddingVertical: titleFontSize <= 40 ? (40 - titleFontSize) / 2 : 0,
        }),
        [titleFontSize],
    );

    const titleWrapperStyles = useMemo(
        () => [{ paddingLeft: !backButtonAction ? 20 : 10 }, styles.titleWrapper],
        [backButtonAction],
    );

    const { mainColor } = useTheme();

    const handleBackButton = useCallback(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        backButtonAction?.();
    }, [backButtonAction]);

    const handleConfirmButton = useCallback(() => {
        if (handleConfirmIcon) {
            if (handleConfirmIcon.name === "plus") {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            if (handleConfirmIcon.name === "check") {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        }
        handleConfirm?.();
    }, [handleConfirm, handleConfirmIcon]);

    return (
        <HStack background style={styles.headerWrapper}>
            <HStack background style={titleWrapperStyles}>
                {backButtonAction && (
                    <Pressable disabled={closeButtonDisabled} onPress={handleBackButton}>
                        <MaterialCommunityIcons color={mainColor} size={30} name="arrow-left" />
                    </Pressable>
                )}
                <Text background numberOfLines={1} style={titleStyles}>
                    {title}
                </Text>
            </HStack>
            <HStack style={styles.actions} ghost>
                {handleQuicksettings && (
                    <HStack ghost>
                        <ThemedPressable ghost onPress={handleQuicksettings}>
                            <ThemedMaterialCommunityIcons ghost size={30} name="cog" />
                        </ThemedPressable>
                    </HStack>
                )}
                <Animated.View style={{ opacity: handleConfirmOpacity !== undefined ? handleConfirmOpacity : 1 }}>
                    {handleConfirm && (
                        <Pressable
                            ref={confirmButtonRef}
                            disabled={confirmButtonDisabled}
                            onPress={handleConfirmButton}>
                            <ThemedMaterialCommunityIcons
                                ghost
                                disabled={confirmButtonDisabled}
                                size={handleConfirmIcon?.size}
                                name={handleConfirmIcon?.name}
                            />
                        </Pressable>
                    )}
                </Animated.View>
            </HStack>
        </HStack>
    );
};
