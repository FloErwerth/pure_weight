import { Pressable, View } from "react-native";
import { Text } from "../../../Themed/ThemedText/Text";
import { useMemo } from "react";
import { styles } from "./styles";
import { useTheme } from "../../../../theme/context";
import { MarkedDay } from "../../../../app/profile/history";
import { HStack } from "../../../Stack/HStack/HStack";

interface RenderedDayProps {
  day: string;
  markedDate: MarkedDay;
  handleSelectDate: () => void;
  selected: boolean;
}

const useMarkedDayStyles = (markedDate: MarkedDay, selected: boolean) => {
  const { secondaryBackgroundColor, mainColor } = useTheme();
  return [
    useMemo(() => {
      if (markedDate === undefined) {
        return [styles.dateWrapper];
      }
      return [styles.dateWrapper, { backgroundColor: secondaryBackgroundColor, borderWidth: 0.5, borderColor: selected ? mainColor : "transparent" }];
    }, [mainColor, markedDate, secondaryBackgroundColor, selected]),
  ] as const;
};

const MultiDot = ({ markedDate }: { markedDate: MarkedDay }) => {
  const mappedDots = useMemo(() => {
    const colors = markedDate?.dotColors.length > 3 ? markedDate?.dotColors.slice(markedDate.dotColors.length - 3) : markedDate?.dotColors;

    return colors?.map((color) => ({ width: 4, height: 4, borderRadius: 4, backgroundColor: color }));
  }, [markedDate?.dotColors]);

  if (markedDate) {
    return (
      <HStack style={{ gap: 2 }}>
        {mappedDots.map((style) => (
          <View style={style}></View>
        ))}
      </HStack>
    );
  }
  return null;
};

export const RenderedDay = ({ day, markedDate, handleSelectDate, selected }: RenderedDayProps) => {
  const [dateStyle] = useMarkedDayStyles(markedDate, selected);

  return (
    <Pressable onPress={handleSelectDate}>
      <View style={dateStyle}>
        <Text ghost>{day}</Text>
        <MultiDot markedDate={markedDate} />
      </View>
    </Pressable>
  );
};
