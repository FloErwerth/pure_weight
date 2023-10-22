import { Text, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RefObject, useCallback, useMemo } from "react";
import { HStack } from "../HStack/HStack";
import { Button } from "../Button/Button";
import { mainColor, mainDisabledColor } from "../App/theme/colors";
import * as Haptics from "expo-haptics";

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
          <Button theme="ghost" disabled={disabled} onPress={handleBackButton}>
            <MaterialCommunityIcons color={disabled ? mainDisabledColor : mainColor} size={28} name="arrow-left" />
          </Button>
        )}
        <Text numberOfLines={1} style={titleStyles}>
          {title}
        </Text>
      </HStack>
      <View>
        {handleConfirm && (
          <Button reference={confirmButtonRef} theme="ghost" disabled={disabled} onPress={handleConfirmButton}>
            <MaterialCommunityIcons color={disabled ? mainDisabledColor : mainColor} size={handleConfirmIcon?.size} name={handleConfirmIcon?.name} />
          </Button>
        )}
      </View>
    </HStack>
  );
};
