import { useMemo } from "react";
import { mainColor, secondaryColor } from "../theme/colors";
import { Text } from "../../Text/Text";

export const TabBarLabel = ({ focused, title }: { focused: boolean; title: string }) => {
  const color = useMemo(() => {
    return focused ? mainColor : secondaryColor;
  }, [focused]);
  return <Text style={{ color, alignSelf: "center" }}>{title}</Text>;
};
