import { View } from "react-native";
import { useMemo } from "react";

export const ColorIndicator = ({ color, height, width }: { color: string; height: number; width: number }) => {
  const colorIndicatorStyles = useMemo(() => ({ backgroundColor: color, width, height, borderRadius: width / 2 }), [color, height, width]);
  return <View style={colorIndicatorStyles} />;
};
