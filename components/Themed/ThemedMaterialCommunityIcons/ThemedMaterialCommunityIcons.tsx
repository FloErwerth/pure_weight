import { ComponentProps, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../../theme/context";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";

interface ThemedMaterialCommunityIconsProps extends ComponentProps<typeof MaterialCommunityIcons> {
  secondary?: boolean;
  ghost?: boolean;
}

export const ThemedMaterialCommunityIcons = (props: ThemedMaterialCommunityIconsProps) => {
  const { mainColor } = useTheme();
  const computedBackgroundColor = useComputedBackgroundColor(props);
  const style = useMemo(() => [{ backgroundColor: computedBackgroundColor }, props.style], [computedBackgroundColor, props.style]);
  return <MaterialCommunityIcons {...props} style={style} color={props.color ?? mainColor} />;
};
