import { useCallback, useMemo, useState } from "react";
import { borderRadius } from "../../../../../theme/border";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
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

import { getDoneWorkoutData } from "../../../../../store/selectors/workout/workoutSelectors";
import { getLanguage, getTimeUnit, getWeightUnit } from "../../../../../store/selectors/settings/settingsSelectors";
import { trunicateToNthSignificantDigit } from "../../../../../utils/number";
import Chart from "../../../../Chart/Chart";
import { ExerciseSets, ExerciseType, SortedData } from "../../../../../store/reducers/workout/types";
import { getLocaleDate } from "../../../../../utils/date";
import { getMinutesSecondsFromMilliseconds } from "../../../../../utils/timeDisplay";
import { ThemedMaterialCommunityIcons } from "../../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { PageContent } from "../../../../PageContent/PageContent";
import { AnswerText } from "../../../../HelpQuestionAnswer/AnswerText";

interface ExerciseChartProps {
    exerciseName: string;
    exerciseType: ExerciseType;
    data: SortedData["data"];
    index: number;
}

const getChartTypeMap = (exerciseType: ExerciseType): Record<string, { title: string; hint: string }> => {
    if (exerciseType === "TIME_BASED") {
        return {
            CUMULATIVE: {
                title: "progress_cumulative",
                hint: "progress_cumulative_hint",
            },
            AVG_DUR: {
                title: "progress_avg_dur",
                hint: "progress_avg_dur_hint",
            },
        } as const;
    }
    return {
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
    } as const;
};
export type ChartType = keyof Record<string, { title: string; hint: string }>;

const getCumulativeExerciseData = (data: { sets: ExerciseSets }[], type: ExerciseType) => {
    return data.reduce((vals, { sets }) => {
        if (type === "TIME_BASED") {
            return [
                ...vals,
                sets.map((set) => parseFloat(set?.durationMinutes ?? "0") * 60 * 1000 + parseFloat(set?.durationSeconds ?? "0") * 1000).reduce((cumulative, entry) => cumulative + entry, 0),
            ];
        }
        return [...vals, sets.map((set) => parseFloat(set?.weight ?? "0") * parseFloat(set?.reps ?? "0")).reduce((cumulative, entry) => cumulative + entry, 0)];
    }, [] as number[]);
};

const getAveragePerDay = (data: { sets: ExerciseSets }[], dataType: "weight" | "reps") => {
    return data.reduce((values, { sets }) => {
        const setValues = sets;
        return [...values, parseFloat((setValues.map((set) => parseFloat(set?.[dataType] ?? "0")).reduce((cumulative, entry) => cumulative + entry, 0) / setValues.length).toFixed(3))];
    }, [] as number[]);
};

const getAverageDurationPerExercise = (data: { sets: ExerciseSets }[]) => {
    return data.reduce((values, { sets }) => {
        const setValues = sets;
        return [
            ...values,
            parseFloat(
                (
                    setValues.map((set) => parseFloat(set?.durationMinutes ?? "0") * 60 * 1000 + parseFloat(set?.durationSeconds ?? "0") * 1000).reduce((cumulative, entry) => cumulative + entry, 0) /
                    setValues.length
                ).toString(),
            ),
        ];
    }, [] as number[]);
};

const useExerciseData = (exerciseData: SortedData["data"], chartType: ChartType["TIME_BASED" & "WEIGHT_BASED"], type: ExerciseType) => {
    const { mainColor } = useTheme();

    const labels = useMemo(() => {
        return exerciseData.map(({ date }) => date);
    }, [exerciseData]);

    const data = useMemo(() => {
        const sets = exerciseData.map(({ sets }) => ({ sets }));
        if (chartType === "AVG_DUR") {
            return getAverageDurationPerExercise(sets);
        }
        if (chartType === "AVG_REPS") {
            return getAveragePerDay(sets, "reps");
        }
        if (chartType === "AVG_WEIGHT") {
            return getAveragePerDay(sets, "weight");
        }
        return getCumulativeExerciseData(sets, type);
    }, [chartType, exerciseData, type]);

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

const useChartTypeLabel = (chartType: ChartType["TIME_BASED" & "WEIGHT_BASED"], exerciseType: ExerciseType) => {
    const weightUnit = useAppSelector(getWeightUnit);
    const timeUnit = useAppSelector(getTimeUnit);
    return {
        AVG_DUR: timeUnit,
        CUMULATIVE: exerciseType === "WEIGHT_BASED" ? weightUnit : timeUnit,
        AVG_WEIGHT: weightUnit,
        AVG_REPS: "reps",
    }[chartType];
};

export const ExerciseChart = ({ exerciseName, exerciseType, data }: ExerciseChartProps) => {
    const chartTypeMap = useMemo(() => getChartTypeMap(exerciseType), [exerciseType]);

    const [chartType, setChartType] = useState<ChartType>("CUMULATIVE");
    const [lineChartData] = useExerciseData(data, chartType, exerciseType);
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();
    const { mainColor } = useTheme();
    const { ref, openBottomSheet, closeBottomSheet } = useBottomSheetRef();
    const chartTypeLabel = useChartTypeLabel(chartType, exerciseType);
    const { ref: helpRef, openBottomSheet: openHelp } = useBottomSheetRef();

    const getDotContent = useCallback(
        ({ x, y, indexData }: { x: number; y: number; index: number; indexData: number }) => {
            const minutesSeconds = getMinutesSecondsFromMilliseconds(indexData);

            const getContent = () => {
                if (exerciseType === "TIME_BASED" && typeof chartTypeLabel === "object") {
                    const minutesContent = minutesSeconds.minutes > 0 ? `${minutesSeconds.minutes} ${chartTypeLabel.minutesUnit}` : "";
                    const secondsContent = minutesSeconds.seconds > 0 ? `${trunicateToNthSignificantDigit(minutesSeconds.seconds, false, 1)} ${chartTypeLabel.secondsUnit}` : "";

                    return (
                        <>
                            {minutesContent} {secondsContent}
                        </>
                    );
                }
                return (
                    <>
                        {trunicateToNthSignificantDigit(indexData, false, 1)} {chartTypeLabel}
                    </>
                );
            };
            const left = exerciseType === "TIME_BASED" ? (minutesSeconds.minutes ? x - 35 : x - 25) : x - 20;
            return (
                <ThemedView
                    key={x + y}
                    style={{
                        position: "absolute",
                        top: y - 25,
                        left,
                        flex: 1,
                        padding: 3,
                        borderRadius,
                        alignItems: "center",
                    }}>
                    <Text style={{ fontSize: 12, color: mainColor }}>{getContent()}</Text>
                </ThemedView>
            );
        },
        [chartTypeLabel, exerciseType, mainColor],
    );

    const openSelectionModal = useCallback(() => {
        openBottomSheet();
    }, [openBottomSheet]);

    const closeSelectionModal = useCallback(() => {
        closeBottomSheet();
    }, [closeBottomSheet]);

    const getXLabel = useCallback(
        (xValue: string) => {
            return getLocaleDate(xValue as IsoDate, language, { dateStyle: "medium" }) ?? "";
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
        [chartTypeMap, closeSelectionModal],
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
                <ThemedView ghost style={styles.selectionModal}>
                    {mappedChartProps.map(({ onPress, title, chartType }) => (
                        <HStack ghost key={`${chartType}${title}`}>
                            <ThemedPressable stretch round background style={styles.chartTypeSelectionButton} padding onPress={onPress}>
                                <Text center ghost style={styles.chartTypeSelectonTitle}>
                                    {t(chartTypeMap[chartType].title)}
                                </Text>
                            </ThemedPressable>
                            <ThemedPressable onPress={openHelp} padding ghost>
                                <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={26} />
                            </ThemedPressable>
                        </HStack>
                    ))}
                </ThemedView>
            </ThemedBottomSheetModal>
            <ThemedBottomSheetModal ref={helpRef} title={t(chartTypeMap[chartType].title)}>
                <PageContent ghost paddingTop={20}>
                    <AnswerText>{t(chartTypeMap[chartType].hint)}</AnswerText>
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};

export default function ExerciseCharts() {
    const trainingDayData = useAppSelector(getDoneWorkoutData);

    const navigate = useNavigate();
    if (trainingDayData === undefined) {
        navigate("workouts");
        return null;
    }

    return (
        <ThemedScrollView ghost>
            {trainingDayData?.map(({ exerciseName, type, data }, index) => <ExerciseChart index={index} key={Math.random() * 100} exerciseName={exerciseName} exerciseType={type} data={data} />)}
        </ThemedScrollView>
    );
}
