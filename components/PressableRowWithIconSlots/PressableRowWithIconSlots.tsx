import { ComponentProps, PropsWithChildren, useCallback, useMemo } from "react";
import { styles } from "./styles";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HStack } from "../HStack/HStack";
import { mainColor, mainDisabledColor } from "../../app/theme/colors";
import * as Haptics from "expo-haptics";

type IconType = {
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
  hide?: boolean;
  size?: number;
  disabled?: boolean;
  onPress?: () => void;
};

export interface PressableRowWithIconSlotsProps extends PropsWithChildren {
  onClick?: () => void;
  Icon1?: IconType;
  Icon2?: IconType;
}
export const PressableRowWithIconSlots = ({ children, onClick, Icon1, Icon2 }: PressableRowWithIconSlotsProps) => {
  const showIcon1 = useMemo(() => (Icon1 && !Icon1.hide) ?? false, [Icon1]);
  const showIcon2 = useMemo(() => (Icon2 && !Icon2.hide) ?? false, [Icon2]);

  const handleClick = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClick?.();
  }, [onClick]);

  const handleClickIcon1 = useCallback(() => {
    if (Icon1?.onPress) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Icon1.onPress();
    }
  }, [Icon1]);

  const handleClickIcon2 = useCallback(() => {
    if (Icon2?.onPress) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Icon2.onPress();
    }
  }, [Icon2]);

  return (
    <HStack style={styles.wrapper}>
      <Pressable style={styles.button} onPress={handleClick}>
        {children}
      </Pressable>
      <HStack style={styles.iconWrapper}>
        {showIcon1 && (
          <Pressable style={styles.icon} disabled={Icon1?.disabled} onPress={handleClickIcon1}>
            <MaterialCommunityIcons size={Icon1?.size ?? 20} name={Icon1?.icon} color={Icon1?.disabled ? mainDisabledColor : mainColor} />
          </Pressable>
        )}
        {showIcon2 && (
          <Pressable style={styles.icon} disabled={Icon2?.disabled} onPress={handleClickIcon2}>
            <MaterialCommunityIcons size={Icon2?.size ?? 20} name={Icon2?.icon} color={Icon2?.disabled ? mainDisabledColor : mainColor} />
          </Pressable>
        )}
      </HStack>
    </HStack>
  );
};
