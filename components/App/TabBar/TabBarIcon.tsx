import { SvgProps } from "react-native-svg";
import { mainColor, secondaryColor } from "../theme/colors";
import { ComponentProps, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const TabBarIcon = ({ focused, Icon }: { focused: boolean; Icon: React.FC<SvgProps> | ComponentProps<typeof MaterialCommunityIcons>["name"] }) => {
  const fillColor = useMemo(() => {
    return focused ? mainColor : secondaryColor;
  }, [focused]);

  if (typeof Icon === "string") {
    return <MaterialCommunityIcons name={Icon} size={20} color={fillColor} />;
  }

  return <Icon width={20} height={20} fill={fillColor} />;
};
