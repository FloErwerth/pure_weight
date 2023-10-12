import { Text, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { HStack } from "../HStack/HStack";
import { Button } from "../Button/Button";
import { mainColor, mainDisabledColor } from "../../app/theme/colors";

interface SiteNavigationButtonsProps {
  handleBack: () => void;
  handleConfirm?: () => void;
  title?: string;
  titleFontSize?: number;
  disabled?: boolean;
}
export const SiteNavigationButtons = ({ handleBack, title, titleFontSize = 40, handleConfirm, disabled = false }: SiteNavigationButtonsProps) => {
  const titleStyles = useMemo(() => ({ ...styles.title, fontSize: titleFontSize }), [titleFontSize]);

  return (
    <HStack style={styles.headerWrapper}>
      <HStack style={styles.titleWrapper}>
        <Button theme="ghost" disabled={disabled} onPress={handleBack}>
          <MaterialCommunityIcons color={disabled ? mainDisabledColor : mainColor} size={28} name="arrow-left" />
        </Button>
        <Text style={titleStyles}>{title}</Text>
      </HStack>
      <View>
        {handleConfirm && (
          <Button theme="ghost" disabled={disabled} onPress={handleConfirm}>
            <MaterialCommunityIcons color={disabled ? mainDisabledColor : mainColor} size={30} name="check" />
          </Button>
        )}
      </View>
    </HStack>
  );
};
