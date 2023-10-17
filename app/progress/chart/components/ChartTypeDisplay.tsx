import { View } from "react-native";
import { ChartType } from "./ExerciseCharts";
import { useMemo } from "react";
import { Text } from "../../../../components/Text/Text";
import { secondaryColor } from "../../../theme/colors";

export const chartTypeTextMap: Record<ChartType, string> = {
  CUMULATIVE: "Calculates the overall weight with weight x sets x reps",
  AVG_REPS: "Shows the average reps per day",
  AVG_WEIGHT: "Shows the average weight per day",
};

interface ChartTypeDisplayProps {
  chartType: ChartType;
}
export const ChartTypeDisplay = ({ chartType }: ChartTypeDisplayProps) => {
  const text = useMemo(() => chartTypeTextMap[chartType], [chartType]);
  return (
    <View>
      <Text style={{ color: secondaryColor, fontSize: 12 }}>{text}</Text>
    </View>
  );
};
