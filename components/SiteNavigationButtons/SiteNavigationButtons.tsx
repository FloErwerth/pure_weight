import { styles } from "./styles";
import { RefObject, useCallback, useMemo } from "react";
import { HStack } from "../HStack/HStack";
import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";
import { Text } from "../Themed/ThemedText/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../theme/context";

interface SiteNavigationButtonsProps {
  handleBack?: () => void;
  handleConfirm?: () => void;
  handleConfirmIcon?: { name: "check" | "plus"; size: number };
  title?: string;
  titleFontSize?: number;
  disabled?: boolean;
  confirmButtonRef?: RefObject<View>;
}
export const SiteNavigationButtons = ({
  handleBack,
  title,
  titleFontSize = 40,
  handleConfirm,
  disabled = false,
  handleConfirmIcon = { name: "check", size: 30 },
  confirmButtonRef,
}: SiteNavigationButtonsProps) => {
  const titleStyles = useMemo(
    () => ({ ...styles.title, fontSize: titleFontSize, paddingVertical: titleFontSize <= 40 ? (40 - titleFontSize) / 2 : 0, marginLeft: handleBack ? 0 : 15 }),
    [handleBack, titleFontSize],
  );
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
    <HStack style={styles.headerWrapper}>
      <HStack style={styles.titleWrapper}>
        {handleBack && (
          <Pressable disabled={disabled} onPress={handleBackButton}>
            <MaterialCommunityIcons color={mainColor} size={28} name="arrow-left" />
          </Pressable>
        )}
        <Text numberOfLines={1} style={titleStyles}>
          {title}
        </Text>
      </HStack>
      <View>
        {handleConfirm && (
          <Pressable ref={confirmButtonRef} disabled={disabled} onPress={handleConfirmButton}>
            <MaterialCommunityIcons color={mainColor} size={handleConfirmIcon?.size} name={handleConfirmIcon?.name} />
          </Pressable>
        )}
      </View>
    </HStack>
  );
};
