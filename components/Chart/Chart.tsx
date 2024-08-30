import { ReactNode, memo, useCallback, useMemo } from "react";
import { Dimensions, ScrollView, ViewStyle } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LineChartData, LineChartProps } from "react-native-chart-kit/dist/line-chart/LineChart";
import { useTheme } from "../../theme/context";

interface ChartProps {
	data: LineChartData;
	transparent?: boolean;
	lineChartStyles?: ViewStyle;
	getXLabel?: (xValue: string) => string;
	getYLabel?: (yValue: string) => string;
	getDotContent?: ({ x, y, indexData }: { x: number; y: number; index: number; indexData: number }) => ReactNode;
	getDotColor?: (index: number) => string;
}

function Chart({ data, getXLabel, getDotContent, getYLabel, lineChartStyles, transparent = false, getDotColor }: ChartProps) {
	const { mainColor, componentBackgroundColor, secondaryColor } = useTheme();
	const numberEntries = data.datasets[0].data.length;
	const width = useMemo(() => Math.max((Dimensions.get("window").width * 3) / numberEntries, numberEntries * 100), [numberEntries]);

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
		<ScrollView horizontal>
			<LineChart
				data={data}
				transparent={transparent}
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
}

export default memo(Chart);
