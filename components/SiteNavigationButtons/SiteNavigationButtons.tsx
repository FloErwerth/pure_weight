import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { HStack } from "../HStack/HStack";

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
        <Pressable disabled={disabled} onPress={handleBack}>
          <MaterialCommunityIcons color={disabled ? "lightgrey" : "black"} size={28} name="arrow-left" />
        </Pressable>
        <Text style={titleStyles}>{title}</Text>
      </HStack>
      <View>
        {handleConfirm && (
          <Pressable disabled={disabled} onPress={handleConfirm}>
            <MaterialCommunityIcons color={disabled ? "lightgrey" : "black"} size={30} name="check" />
          </Pressable>
        )}
      </View>
    </HStack>
  );
};
