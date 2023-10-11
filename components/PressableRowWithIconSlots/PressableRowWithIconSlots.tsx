import {ComponentProps, PropsWithChildren, useCallback, useMemo} from "react";
import { styles } from "./styles";
import {Pressable, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

type IconType = {
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
  hide?: boolean;
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
    onClick?.();
  }, [onClick]);

  const handleClickIcon1 = useCallback(() => {
    if (Icon1?.onPress) {
      Icon1.onPress();
    }
  }, [Icon1]);

  const handleClickIcon2 = useCallback(() => {
    if (Icon2?.onPress) {
      Icon2.onPress();
    }
  }, [Icon2]);

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.button} onPress={handleClick}>
        {children}
      </Pressable>
      <View style={styles.iconWrapper}>
        {showIcon1 && (
          <Pressable style={styles.icon} disabled={Icon1?.disabled} onPress={handleClickIcon1}>
            <MaterialCommunityIcons name={Icon1?.icon} style={styles.iconCorrection} as={Icon1?.icon} p={12} color={Icon1?.disabled ? "lightgrey" : "black"} />
          </Pressable>
        )}
        {showIcon2 && (
          <Pressable style={styles.icon} disabled={Icon2?.disabled} onPress={handleClickIcon2}>
            <MaterialCommunityIcons name={Icon2?.icon} style={styles.iconCorrection} as={Icon2?.icon} p={12} color={Icon2?.disabled ? "lightgrey" : "black"} />
          </Pressable>
        )}
      </View>
    </View>
  );
};
