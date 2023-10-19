import { SvgProps } from "react-native-svg";
import { mainColor, secondaryColor } from "../theme/colors";
import { useMemo } from "react";

export const TabBarIcon = ({ focused, Icon }: { focused: boolean; Icon: React.FC<SvgProps> }) => {
  const fillColor = useMemo(() => {
    return focused ? mainColor : secondaryColor;
  }, [focused]);
  return <Icon width={20} height={20} fill={fillColor} />;
};
