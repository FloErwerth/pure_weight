import { styles } from "./styles";
import { RefObject, useCallback, useMemo } from "react";
import { HStack } from "../Stack/HStack/HStack";
import * as Haptics from "expo-haptics";
import { Animated, Pressable, View } from "react-native";
import { Text } from "../Themed/ThemedText/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../theme/context";

interface SiteNavigationButtonsProps {
  handleBack?: () => void;
  handleConfirm?: () => void;
  handleConfirmOpacity?: Animated.Value;
  handleConfirmIcon?: { name: "check" | "plus"; size: number };
  title?: string;
  titleFontSize?: number;
  disabled?: boolean;
  confirmButtonRef?: RefObject<View>;
}

export const SiteNavigationButtons = ({
  handleBack,
  title,
  titleFontSize = 30,
  handleConfirm,
  disabled = false,
  handleConfirmIcon = { name: "check", size: 30 },
  confirmButtonRef,
  handleConfirmOpacity,
}: SiteNavigationButtonsProps) => {
  const titleStyles = useMemo(
    () => ({ ...styles.title, fontSize: titleFontSize, paddingVertical: titleFontSize <= 40 ? (40 - titleFontSize) / 2 : 0 }),
    [titleFontSize],
  );

  const titleWrapperStyles = useMemo(() => [{ paddingLeft: !handleBack ? 20 : 0 }, styles.titleWrapper], [handleBack]);

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
          <Pressable disabled={disabled} onPress={handleBackButton}>
            <MaterialCommunityIcons color={mainColor} size={Math.min(28, titleFontSize)} name="arrow-left" />
          </Pressable>
        )}
        <Text background numberOfLines={1} style={titleStyles}>
          {title}
        </Text>
      </HStack>
      <Animated.View style={{ opacity: handleConfirmOpacity !== undefined ? handleConfirmOpacity : 1 }}>
        {handleConfirm && (
          <Pressable ref={confirmButtonRef} disabled={disabled} onPress={handleConfirmButton}>
            <MaterialCommunityIcons color={mainColor} size={handleConfirmIcon?.size} name={handleConfirmIcon?.name} />
          </Pressable>
        )}
      </Animated.View>
    </HStack>
  );
};
