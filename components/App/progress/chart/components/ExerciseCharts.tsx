import { useCallback, useMemo, useState } from "react";
import { borderRadius } from "../../../../../theme/border";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { VStack } from "../../../../Stack/VStack/VStack";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../BottomSheetModal/ThemedBottomSheetModal";
import { useAppSelector } from "../../../../../store";
import { HStack } from "../../../../Stack/HStack/HStack";
import { styles } from "./styles";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../../../Themed/ThemedView/View";
import { Text } from "../../../../Themed/ThemedText/Text";
import { ThemedScrollView } from "../../../../Themed/ThemedScrollView/ThemedScrollView";
import { useTheme } from "../../../../../theme/context";
import { IsoDate } from "../../../../../types/date";
import { ThemedPressable } from "../../../../Themed/Pressable/Pressable";
import { useNavigate } from "../../../../../hooks/navigate";

import { getTrainingDayData } from "../../../../../store/reducers/workout/workoutSelectors";
import { getLanguage, getWeightUnit } from "../../../../../store/reducers/settings/settingsSelectors";
import { trunicateToNthSignificantDigit } from "../../../../../utils/number";
import Chart from "../../../../Chart/Chart";
import { ExerciseSets, WeightBasedExerciseData } from "../../../../../store/reducers/workout/types";
import { getLocaleDate } from "../../../../../utils/date";

interface ExerciseChartProps {
    exerciseName: string;
    data: { date: IsoDate; sets: ExerciseSets }[];
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

const getAveragePerDay = (data: ExerciseSets[], dataType: keyof Omit<WeightBasedExerciseData, "confirmed">) => {
    return data.reduce((values, sets) => {
        const setValues = sets;
        return [...values, parseFloat((setValues.map((set) => parseFloat(set?.[dataType] ?? "0")).reduce((cumulative, entry) => cumulative + entry, 0) / setValues.length).toFixed(3))];
    }, [] as number[]);
};

const useExerciseData = (exerciseData: { date: IsoDate; sets: ExerciseSets }[], chartType: ChartType) => {
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
                color: () => mainColor,
                strokeWidth: 1,
            },
        ],
    };

    return [chartData] as const;
};

const useChartTypeLabel = (chartType: ChartType) => {
    const weightUnit = useAppSelector(getWeightUnit);
    return {
        CUMULATIVE: weightUnit,
        AVG_WEIGHT: weightUnit,
        AVG_REPS: "reps",
    }[chartType];
};

export const ExerciseChart = ({ exerciseName, data }: ExerciseChartProps) => {
    const [chartType, setChartType] = useState<ChartType>("CUMULATIVE");
    const [lineChartData] = useExerciseData(data, chartType);
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();
    const { mainColor } = useTheme();
    const [ref, open, close] = useBottomSheetRef();
    const chartTypeLabel = useChartTypeLabel(chartType);
    const getDotContent = useCallback(
        ({ x, y, indexData }: { x: number; y: number; index: number; indexData: number }) => {
            return (
                <ThemedView key={x + y} style={{ position: "absolute", top: y - 25, left: x - 20, flex: 1, padding: 3, borderRadius, alignItems: "center" }}>
                    <Text style={{ fontSize: 12, color: mainColor }}>
                        {trunicateToNthSignificantDigit(indexData, false, 1)} {chartTypeLabel}
                    </Text>
                </ThemedView>
            );
        },
        [chartTypeLabel, mainColor],
    );

    const openSelectionModal = useCallback(() => {
        open();
    }, [open]);

    const closeSelectionModal = useCallback(() => {
        close();
    }, [close]);

    const getXLabel = useCallback(
        (xValue: string) => {
            return getLocaleDate(xValue as IsoDate, language, { dateStyle: "medium" });
        },
        [language],
    );

    const mappedChartProps = useMemo(
        () =>
            Object.entries(chartTypeMap).map(([type, text]) => {
                const onPress = () => {
                    setChartType(type as ChartType);
                    closeSelectionModal();
                };
                return { onPress, title: text, chartType: type };
            }),
        [closeSelectionModal],
    );

    return (
        <ThemedView style={styles.wrapper}>
            <HStack ghost style={styles.chartHeader}>
                <Text ghost style={styles.headerTitle}>
                    {exerciseName}
                </Text>
                <ThemedPressable input onPress={openSelectionModal} style={styles.selectionButton}>
                    <Text input center style={styles.selectionText}>
                        {t(chartTypeMap[chartType].title)}
                    </Text>
                </ThemedPressable>
            </HStack>
            <Chart lineChartStyles={styles.lineChart} getYLabel={() => ""} getXLabel={getXLabel} getDotContent={getDotContent} data={lineChartData} />
            <ThemedBottomSheetModal title={t("progress_modal_title")} ref={ref}>
                <VStack ghost style={styles.selectionModal}>
                    {mappedChartProps.map(({ onPress, title, chartType }) => (
                        <ThemedPressable style={{ borderRadius, padding: 10 }} input key={`${chartType}${title}`} onPress={onPress}>
                            <VStack input>
                                <Text center ghost style={styles.chartTypeSelectonTitle}>
                                    {t(chartTypeMap[chartType].title)}
                                </Text>
                                <Text center input style={styles.chartTypeSelectionText}>
                                    {t(chartTypeMap[chartType].hint)}
                                </Text>
                            </VStack>
                        </ThemedPressable>
                    ))}
                </VStack>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};

export default function ExerciseCharts() {
    const trainingDayData = useAppSelector(getTrainingDayData);
    const navigate = useNavigate();
    if (trainingDayData === undefined) {
        navigate("workouts");
        return null;
    }

    return <ThemedScrollView ghost>{trainingDayData?.map(({ exerciseName, data }) => <ExerciseChart key={Math.random() * 100} exerciseName={exerciseName} data={data} />)}</ThemedScrollView>;
}
