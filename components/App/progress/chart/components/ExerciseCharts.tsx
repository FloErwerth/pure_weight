import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { DoneExerciseData, ExerciseMetaData, ExerciseSets, PlainExerciseData } from "../../../../../store/types";
import { useCallback, useMemo, useRef, useState } from "react";
import { backgroundColor, componentBackgroundColor, mainColor, secondaryColor } from "../../../theme/colors";
import { borderRadius } from "../../../theme/border";
import { getDate } from "../../../../../utils/date";
import { IsoDate } from "../../../../../types/date";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { VStack } from "../../../../VStack/VStack";
import { Button } from "../../../../Button/Button";
import { Modal } from "../../../../Modal/Modal";
import { useAppSelector } from "../../../../../store";
import { getSelectedTrainingDayData } from "../../../../../store/selectors";
import { HStack } from "../../../../HStack/HStack";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";

interface ExerciseChartProps {
  exercise: { doneExerciseEntries: DoneExerciseData } & ExerciseMetaData;
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
  const { t } = useTranslation();
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
    [],
  );

  const getXLabel = useCallback((xValue: string) => {
    return getDate(xValue as IsoDate);
  }, []);

  const width = useMemo(() => (numberEntries > 5 ? numberEntries * 80 : Dimensions.get("screen").width + 250 / (numberEntries * numberEntries * numberEntries)), [numberEntries]);

  return (
    <View ref={viewRef} style={{ backgroundColor: componentBackgroundColor, overflow: "hidden", padding: 10, paddingBottom: 0, borderRadius, gap: 10 }}>
      <HStack style={styles.chartHeader}>
        <Text style={styles.headerTitle}>{exercise.name}</Text>
        <View style={styles.chartTypeSelection}>
          <Button onPress={() => setShowSelectionModal(true)} title={t(chartTypeMap[chartType].title)} style={{ text: styles.selectionText }} />
        </View>
      </HStack>
      <ScrollView horizontal scrollEnabled={numberEntries > 5}>
        <LineChart
          data={data}
          width={width}
          height={Dimensions.get("screen").height * 0.33}
          renderDotContent={dotContent}
          formatXLabel={getXLabel}
          chartConfig={config}
          style={{
            marginTop: 15,
            borderRadius: 16,
          }}
          yLabelsOffset={25}
        />
      </ScrollView>
      {showSelectionModal && (
        <Modal title={t("progress_modal_title")} onRequestClose={() => setShowSelectionModal(false)} isVisible={showSelectionModal}>
          <VStack style={{ gap: 10 }}>
            {mappedChartProps.map(({ onPress, title, chartType }) => (
              <Button key={`${chartType}${title}`} onPress={onPress}>
                <Text style={{ color: mainColor, fontSize: 20 }}>{t(chartTypeMap[chartType].title)}</Text>
                <View>
                  <Text style={{ color: secondaryColor, fontSize: 12 }}>{t(chartTypeMap[chartType].hint)}</Text>
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

  return (
    <ScrollView>
      {trainingDayData?.exercises?.map((exercise) => {
        return <ExerciseChart key={`${exercise.sets}${exercise.name}${exercise.weight}`} exercise={exercise} />;
      })}
    </ScrollView>
  );
}
