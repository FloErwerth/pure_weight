import { LineChart } from "react-native-chart-kit";
import { LineChartData, LineChartProps } from "react-native-chart-kit/dist/line-chart/LineChart";
import { ReactNode, useCallback, useMemo } from "react";
import { useTheme } from "../../theme/context";
import { Dimensions, ScrollView, ViewStyle } from "react-native";

interface ChartProps {
    data: LineChartData;
    transparent?: boolean;
    lineChartStyles?: ViewStyle;
    getXLabel?: (xValue: string) => string;
    getYLabel?: (yValue: string) => string;
    getDotContent?: ({ x, y, indexData }: { x: number; y: number; index: number; indexData: number }) => ReactNode;
    getDotColor?: (index: number) => string;
}
export const Chart = ({ data, getXLabel, getDotContent, getYLabel, lineChartStyles, transparent = false, getDotColor }: ChartProps) => {
    const { mainColor, componentBackgroundColor, secondaryColor } = useTheme();
    const numberEntries = data.datasets[0].data.length;
    const scrollEnabled = useMemo(() => numberEntries > 5, [numberEntries]);
    const width = useMemo(() => (numberEntries < 7 ? Dimensions.get("screen").width - 30 : numberEntries * 100), [numberEntries]);

    const config: LineChartProps["chartConfig"] = useMemo(
        () => ({
            backgroundGradientFrom: componentBackgroundColor,
            backgroundGradientTo: componentBackgroundColor,
            decimalPlaces: 0,
            color: () => secondaryColor,
            labelColor: () => mainColor,
            propsForDots: {
                r: "5",
            },
            propsForLabels: {
                fontSize: 12,
            },
        }),
        [componentBackgroundColor, mainColor, secondaryColor],
    );

    const handleGetDotColor = useCallback(
        (dataPoint: unknown, index: number) => {
            return getDotColor?.(index) ?? mainColor;
        },
        [getDotColor, mainColor],
    );

    return (
        <ScrollView horizontal scrollEnabled={scrollEnabled}>
            <LineChart
                data={data}
                transparent={transparent}
                bezier
                formatYLabel={getYLabel}
                width={width}
                height={Dimensions.get("screen").height * 0.33}
                renderDotContent={getDotContent}
                formatXLabel={getXLabel}
                chartConfig={config}
                style={lineChartStyles}
                getDotColor={handleGetDotColor}
            />
        </ScrollView>
    );
};
