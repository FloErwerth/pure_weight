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
    handleBack?: () => void;
    handleConfirm?: () => void;
    handleConfirmOpacity?: Animated.Value;
    handleConfirmIcon?: { name: "check" | "plus" | "cog"; size: number };
    title?: string;
    titleFontSize?: number;
    confirmButtonDisabled?: boolean;
    closeButtonDisabled?: boolean;
    confirmButtonRef?: RefObject<View>;
    handleQuicksettings?: () => void;
}
export const DEFAULT_PLUS = { name: "plus", size: 40 } as const;
export const SiteNavigationButtons = ({
    handleBack,
    title,
    titleFontSize = 30,
    handleConfirm,
    confirmButtonDisabled = false,
    closeButtonDisabled = false,
    handleConfirmIcon = { name: "check", size: 30 },
    confirmButtonRef,
    handleConfirmOpacity,
    handleQuicksettings,
}: SiteNavigationButtonsProps) => {
    const titleStyles = useMemo(() => ({ ...styles.title, fontSize: titleFontSize, paddingVertical: titleFontSize <= 40 ? (40 - titleFontSize) / 2 : 0 }), [titleFontSize]);

    const titleWrapperStyles = useMemo(() => [{ paddingLeft: !handleBack ? 20 : 10 }, styles.titleWrapper], [handleBack]);

    const { mainColor } = useTheme();

    const handleBackButton = useCallback(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        handleBack?.();
    }, [handleBack]);

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
                {handleBack && (
                    <Pressable disabled={closeButtonDisabled} onPress={handleBackButton}>
                        <MaterialCommunityIcons color={mainColor} size={Math.min(28, titleFontSize)} name="arrow-left" />
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
                            <ThemedMaterialCommunityIcons ghost size={Math.min(28, titleFontSize)} name="cog" />
                        </ThemedPressable>
                    </HStack>
                )}
                <Animated.View style={{ opacity: handleConfirmOpacity !== undefined ? handleConfirmOpacity : 1 }}>
                    {handleConfirm && (
                        <Pressable ref={confirmButtonRef} disabled={confirmButtonDisabled} onPress={handleConfirmButton}>
                            <MaterialCommunityIcons color={mainColor} size={handleConfirmIcon?.size} name={handleConfirmIcon?.name} />
                        </Pressable>
                    )}
                </Animated.View>
            </HStack>
        </HStack>
    );
};
