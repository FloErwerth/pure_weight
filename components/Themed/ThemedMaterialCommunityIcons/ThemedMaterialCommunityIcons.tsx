import { ComponentProps, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../../theme/context";

interface ThemedMaterialCommunityIconsProps extends ComponentProps<typeof MaterialCommunityIcons> {
  secondary?: boolean;
}

export const ThemedMaterialCommunityIcons = (props: ThemedMaterialCommunityIconsProps) => {
  const { mainColor, componentBackgroundColor, secondaryBackgroundColor } = useTheme();
  const style = useMemo(
    () => [{ backgroundColor: props.secondary ? secondaryBackgroundColor : componentBackgroundColor }, props.style],
    [componentBackgroundColor, props.secondary, props.style, secondaryBackgroundColor],
  );
  return <MaterialCommunityIcons {...props} style={style} color={props.color ?? mainColor} />;
};
