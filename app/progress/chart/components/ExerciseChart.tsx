import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { DoneExerciseData, ExerciseMetaData, ExerciseSets, PlainExerciseData } from "../../../../store/types";
import { useCallback, useMemo, useRef, useState } from "react";
import { backgroundColor, mainColor, textFieldBackgroundColor } from "../../../theme/colors";
import { borderRadius } from "../../../theme/border";
import { getUsDate } from "../../../../utils/date";
import { IsoDate } from "../../../../types/date";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { SmallMetadataDisplay } from "../../../components/train/ExerciseMetaDataDisplay";
import { VStack } from "../../../../components/VStack/VStack";
import { Button } from "../../../../components/Button/Button";
import { Modal } from "../../../../components/Modal/Modal";
import { ChartTypeDisplay } from "./ChartTypeDisplay";

interface ExerciseChartProps {
  exercise: { doneExerciseEntries: DoneExerciseData } & ExerciseMetaData;
}

const chartTypeMap = {
  CUMULATIVE: "Cumulative",
  AVG_REPS: "Average reps",
  AVG_WEIGHT: "Average weight",
};
export type ChartType = keyof typeof chartTypeMap;

const getCumulativeExerciseData = (data: ExerciseSets[]) => {
  return data.reduce((values, sets) => {
    return [
      ...values,
      Object.values(sets)
        .map((set) => parseFloat(set?.weight ?? "0") * parseFloat(set?.reps ?? "0"))
        .reduce((cumulative, entry) => cumulative + entry, 0),
    ];
  }, [] as number[]);
};

const getAveragePerDay = (data: ExerciseSets[], dataType: keyof PlainExerciseData) => {
  return data.reduce((values, sets) => {
    const setValues = Object.values(sets);
    return [...values, parseFloat((setValues.map((set) => parseFloat(set?.[dataType] ?? "0")).reduce((cumulative, entry) => cumulative + entry, 0) / setValues.length).toFixed(3))];
  }, [] as number[]);
};

const useExerciseData = (exerciseData: DoneExerciseData, chartType: ChartType) => {
  const rawEntries = Object.entries(exerciseData);

  const labels = useMemo(() => {
    return Array.from(rawEntries.values()).map(([key]) => key);
  }, [rawEntries]);

  const data = useMemo(() => {
    const data = Array.from(rawEntries.values()).map(([_, entry]) => entry);
    if (chartType === "AVG_REPS") {
      return getAveragePerDay(data, "reps");
    }
    if (chartType === "AVG_WEIGHT") {
      return getAveragePerDay(data, "weight");
    }
    return getCumulativeExerciseData(data);
  }, [chartType, rawEntries]);

  const chartData: LineChartData = {
    labels,
    datasets: [
      {
        data,
        color: () => mainColor, // optional
        strokeWidth: 1, // optional
      },
    ],
  };

  return [chartData, rawEntries.length] as const;
};

const chartTypeLabel: Record<ChartType, string> = {
  CUMULATIVE: "kg",
  AVG_WEIGHT: "kg",
  AVG_REPS: "reps",
};

export const ExerciseChart = ({ exercise }: ExerciseChartProps) => {
  const [chartType, setChartType] = useState<ChartType>("CUMULATIVE");
  const [data, numberEntries] = useExerciseData(exercise.doneExerciseEntries, chartType);
  const viewRef = useRef<View>(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const dotContent = useCallback(
    ({ x, y, indexData }: { x: number; y: number; index: number; indexData: number }) => {
      return (
        <View style={{ position: "absolute", top: y - 25, left: x - 20, flex: 1, padding: 3, backgroundColor, borderRadius, alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: mainColor }}>
            {indexData} {chartTypeLabel[chartType]}
          </Text>
        </View>
      );
    },
    [chartType],
  );

  const mappedChartProps = useMemo(
    () =>
      Object.entries(chartTypeMap).map(([type, text]) => {
        const onPress = () => {
          setChartType(type as ChartType);
          setShowSelectionModal(false);
        };

        return { onPress, title: text, chartType: type };
      }),
    [],
  );

  return (
    <View ref={viewRef} style={{ backgroundColor: textFieldBackgroundColor, overflow: "hidden", padding: 10, paddingBottom: 0, borderRadius, margin: 10, gap: 10 }}>
      <VStack>
        <Text style={{ color: mainColor, fontSize: 16 }}>{exercise.name}</Text>
        <SmallMetadataDisplay style={{ fontSize: 12, alignSelf: "center" }} />
      </VStack>
      <ScrollView horizontal scrollEnabled={numberEntries > 5}>
        <LineChart
          data={data}
          width={numberEntries > 5 ? numberEntries * 80 : Dimensions.get("screen").width + 250 / (numberEntries * numberEntries * numberEntries)}
          height={Dimensions.get("screen").height * 0.33}
          renderDotContent={dotContent}
          formatXLabel={(xValue) => getUsDate(xValue as IsoDate)}
          chartConfig={{
            backgroundGradientFrom: textFieldBackgroundColor,
            backgroundGradientTo: textFieldBackgroundColor,
            decimalPlaces: 0,
            color: () => "#111",
            labelColor: () => mainColor,
            propsForDots: {
              r: "3",
            },
            propsForLabels: {
              fontSize: 12,
            },
          }}
          style={{
            marginTop: 15,
            borderRadius: 16,
          }}
          yLabelsOffset={25}
        />
      </ScrollView>
      <Button style={{ button: { padding: 10, marginBottom: 10, backgroundColor } }} title={`Chart type: ${chartTypeMap[chartType ?? "CUMULATIVE"]}`} onPress={() => setShowSelectionModal(true)} />
      {showSelectionModal && (
        <Modal title="Select chart type" onRequestClose={() => setShowSelectionModal(false)} isVisible={showSelectionModal}>
          <VStack style={{ gap: 10 }}>
            {mappedChartProps.map(({ onPress, title, chartType }) => (
              <Button key={`${chartType}${title}`} onPress={onPress}>
                <Text style={{ color: mainColor, fontSize: 20 }}>{title}</Text>
                <ChartTypeDisplay chartType={chartType as ChartType} />
              </Button>
            ))}
          </VStack>
        </Modal>
      )}
    </View>
  );
};
