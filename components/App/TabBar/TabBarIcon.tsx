import { SvgProps } from "react-native-svg";
import { ComponentProps, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../../theme/context";

export const TabBarIcon = ({ focused, Icon }: { focused: boolean; Icon: React.FC<SvgProps> | ComponentProps<typeof MaterialCommunityIcons>["name"] }) => {
  const { mainColor, secondaryColor } = useTheme();
  const fillColor = useMemo(() => {
    return focused ? mainColor : secondaryColor;
  }, [focused, mainColor, secondaryColor]);

  if (typeof Icon === "string") {
    return <MaterialCommunityIcons name={Icon} size={20} color={fillColor} />;
  }

  return <Icon width={20} height={20} fill={fillColor} />;
};
