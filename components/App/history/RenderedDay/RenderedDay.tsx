import { Pressable, View } from "react-native";
import { Text } from "../../../Themed/ThemedText/Text";
import { useMemo } from "react";
import { styles } from "./styles";
import { useTheme } from "../../../../theme/context";
import { getInvertedColor } from "../../../ColorPickerWithModal/ColorPickerWithModal";

interface RenderedDayProps {
  day: string;
  color: string;
  handleSelectDate: () => void;
  selected: boolean;
}

const useMarkedDayStyles = (color: string, selected: boolean) => {
  const { mainColor, textDisabled } = useTheme();

  const viewStyle = useMemo(() => {
    if (color === undefined) {
      return [styles.dateWrapper];
    }
    return [styles.dateWrapper, { backgroundColor: selected ? color : textDisabled }];
  }, [color, selected, textDisabled]);

  const dotStyle = useMemo(
    () => ({
      marginTop: 1,
      width: 16,
      height: !color || selected ? 0 : 4,
      borderRadius: 4,
      backgroundColor: selected ? getInvertedColor(color) : color,
    }),
    [color, selected],
  );

  const textStyle = useMemo(() => {
    return { color: selected ? getInvertedColor(color) : mainColor, fontSize: selected ? 18 : 16, fontWeight: selected ? "bold" : "normal" } as const;
  }, [selected, color, mainColor]);
  return useMemo(() => ({ viewStyle, textStyle, dotStyle }), [dotStyle, textStyle, viewStyle]);
};

export const RenderedDay = ({ day, color, handleSelectDate, selected }: RenderedDayProps) => {
  const { viewStyle, textStyle, dotStyle } = useMarkedDayStyles(color, selected);

  return (
    <Pressable onPress={handleSelectDate}>
      <View style={viewStyle}>
        <Text style={textStyle} ghost>
          {day}
        </Text>
        <View style={dotStyle}></View>
      </View>
    </Pressable>
  );
};
