import { ComponentProps, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../../theme/context";

export const ThemedMaterialCommunityIcons = (props: ComponentProps<typeof MaterialCommunityIcons>) => {
  const { mainColor, componentBackgroundColor } = useTheme();
  const style = useMemo(() => [{ backgroundColor: componentBackgroundColor }, props.style], [componentBackgroundColor, props.style]);
  return <MaterialCommunityIcons {...props} style={style} color={props.color ?? mainColor} />;
};
