import { useMemo } from "react";
import { Text } from "../../Themed/ThemedText/Text";
import { useTheme } from "../../../theme/context";

export const TabBarLabel = ({ focused, title }: { focused: boolean; title: string }) => {
  const { mainColor, secondaryColor } = useTheme();
  const color = useMemo(() => {
    return focused ? mainColor : secondaryColor;
  }, [focused, mainColor, secondaryColor]);

  return <Text style={{ color, alignSelf: "center" }}>{title}</Text>;
};
