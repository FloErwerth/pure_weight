import { Dimensions, ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { DoneExerciseData, ExerciseSets, PlainExerciseData } from "../../../../../store/types";
import { useCallback, useMemo, useRef, useState } from "react";
import { borderRadius } from "../../../../../theme/border";
import { getDate } from "../../../../../utils/date";
import { IsoDate } from "../../../../../types/date";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { VStack } from "../../../../VStack/VStack";
import { Button } from "../../../../Themed/Button/Button";
import { Modal } from "../../../../Modal/Modal";
import { useAppSelector } from "../../../../../store";
import { getSelectedTrainingDayData } from "../../../../../store/selectors";
import { HStack } from "../../../../HStack/HStack";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../../../Themed/ThemedView/View";
import { Text } from "../../../../Themed/ThemedText/Text";
import { ThemedScrollView } from "../../../../Themed/ThemedScrollView/ThemedScrollView";
import { useTheme } from "../../../../../theme/context";

interface ExerciseChartProps {
  exercise: { name: string; data: DoneExerciseData[] };
}

const chartTypeMap: Record<string, { title: string; hint: string }> = {
  CUMULATIVE: {
    title: "progress_cumulative",
    hint: "progress_cumulative_hint",
  },
  AVG_REPS: {
    title: "progress_avg_reps",
    hint: "progress_avg_reps_hint",
  },
  AVG_WEIGHT: {
    title: "progress_avg_weight",
    hint: "progress_avg_weight_hint",
  },
};
export type ChartType = keyof typeof chartTypeMap;

const getCumulativeExerciseData = (data: ExerciseSets[]) => {
  return data.reduce((vals, sets) => {
    return [...vals, sets.map((set) => parseFloat(set?.weight ?? "0") * parseFloat(set?.reps ?? "0")).reduce((cumulative, entry) => cumulative + entry, 0)];
  }, [] as number[]);
};

const getAveragePerDay = (data: ExerciseSets[], dataType: keyof PlainExerciseData) => {
  return data.reduce((values, sets) => {
    const setValues = sets;
    return [...values, parseFloat((setValues.map((set) => parseFloat(set?.[dataType] ?? "0")).reduce((cumulative, entry) => cumulative + entry, 0) / setValues.length).toFixed(3))];
  }, [] as number[]);
};

const useExerciseData = (exerciseData: DoneExerciseData[], chartType: ChartType) => {
  const { mainColor } = useTheme();
  const labels = useMemo(() => {
    return exerciseData.map(({ date }) => date);
  }, [exerciseData]);

  const data = useMemo(() => {
    const sets = exerciseData.map(({ sets }) => sets);

    if (chartType === "AVG_REPS") {
      return getAveragePerDay(sets, "reps");
    }
    if (chartType === "AVG_WEIGHT") {
      return getAveragePerDay(sets, "weight");
    }
    return getCumulativeExerciseData(sets);
  }, [chartType, exerciseData]);

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

  return [chartData, exerciseData.length] as const;
};

const chartTypeLabel: Record<ChartType, string> = {
  CUMULATIVE: "kg",
  AVG_WEIGHT: "kg",
  AVG_REPS: "reps",
};

export const ExerciseChart = ({ exercise }: ExerciseChartProps) => {
  const [chartType, setChartType] = useState<ChartType>("CUMULATIVE");
  const [data, numberEntries] = useExerciseData(exercise.data, chartType);
  const viewRef = useRef<View>(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const { t } = useTranslation();
  const { mainColor, componentBackgroundColor } = useTheme();

  const getDotContent = useCallback(
    ({ x, y, indexData }: { x: number; y: number; index: number; indexData: number }) => {
      return (
        <ThemedView style={{ position: "absolute", top: y - 25, left: x - 20, flex: 1, padding: 3, borderRadius, alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: mainColor }}>
            {indexData} {chartTypeLabel[chartType]}
          </Text>
        </ThemedView>
      );
    },
    [chartType, mainColor],
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

  const config = useMemo(
    () => ({
      backgroundGradientFrom: componentBackgroundColor,
      backgroundGradientTo: componentBackgroundColor,
      decimalPlaces: 0,
      color: () => "#111",
      labelColor: () => mainColor,
      propsForDots: {
        r: "3",
      },
      propsForLabels: {
        fontSize: 12,
      },
    }),
    [componentBackgroundColor, mainColor],
  );

  const getXLabel = useCallback((xValue: string) => {
    return getDate(xValue as IsoDate);
  }, []);

  const scrollEnabled = useMemo(() => numberEntries > 5, [numberEntries]);
  const width = useMemo(() => (numberEntries > 5 ? numberEntries * 80 : Dimensions.get("screen").width + 250 / (numberEntries * numberEntries * numberEntries)), [numberEntries]);

  return (
    <View ref={viewRef} style={[styles.wrapper, { backgroundColor: componentBackgroundColor }]}>
      <HStack style={styles.chartHeader}>
        <Text style={styles.headerTitle}>{exercise.name}</Text>
        <Button onPress={() => setShowSelectionModal(true)} title={t(chartTypeMap[chartType].title)} style={{ button: styles.selectionButton, text: styles.selectionText }} />
      </HStack>
      <ScrollView horizontal scrollEnabled={scrollEnabled}>
        <LineChart
          data={data}
          formatYLabel={() => ""}
          width={width}
          height={Dimensions.get("screen").height * 0.33}
          renderDotContent={getDotContent}
          formatXLabel={getXLabel}
          chartConfig={config}
          style={styles.lineChart}
          yLabelsOffset={25}
        />
      </ScrollView>
      {showSelectionModal && (
        <Modal title={t("progress_modal_title")} onRequestClose={() => setShowSelectionModal(false)} isVisible={showSelectionModal}>
          <VStack style={styles.selectionModal}>
            {mappedChartProps.map(({ onPress, title, chartType }) => (
              <Button key={`${chartType}${title}`} onPress={onPress}>
                <Text style={styles.chartTypeSelectonTitle}>{t(chartTypeMap[chartType].title)}</Text>
                <View>
                  <Text style={styles.chartTypeSelectionText}>{t(chartTypeMap[chartType].hint)}</Text>
                </View>
              </Button>
            ))}
          </VStack>
        </Modal>
      )}
    </View>
  );
};

export default function Charts() {
  const trainingDayData = useAppSelector(getSelectedTrainingDayData);

  if (trainingDayData === undefined) {
    return null;
  }

  return (
    <ThemedScrollView>
      {trainingDayData?.exercises?.map((exercise) => <ExerciseChart key={Math.random() * 100} exercise={{ name: exercise.name, data: exercise.doneExerciseEntries }} />)}
    </ThemedScrollView>
  );
}
