import { ComponentProps, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../../theme/context";

interface ThemedMaterialCommunityIconsProps extends ComponentProps<typeof MaterialCommunityIcons> {
  secondary?: boolean;
  ghost?: boolean;
}

export const ThemedMaterialCommunityIcons = (props: ThemedMaterialCommunityIconsProps) => {
  const { mainColor, componentBackgroundColor, secondaryBackgroundColor } = useTheme();
  const computedBackgroundColor = useMemo(() => {
    if (props.secondary) {
      return secondaryBackgroundColor;
    }
    if (props.ghost) {
      return "transparent";
    }
    return componentBackgroundColor;
  }, [componentBackgroundColor, props.ghost, props.secondary, secondaryBackgroundColor]);
  const style = useMemo(() => [{ backgroundColor: computedBackgroundColor }, props.style], [computedBackgroundColor, props.style]);
  return <MaterialCommunityIcons {...props} style={style} color={props.color ?? mainColor} />;
};
