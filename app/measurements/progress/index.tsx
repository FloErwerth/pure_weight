import { useCallback } from "react";
import { useTheme } from "../../../theme/context";
import { useAppSelector } from "../../../store";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { borderRadius } from "../../../theme/border";
import { trunicateToNthSignificantDigit } from "../../../utils/number";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { getMeasurementData } from "../../../store/selectors/measurements/measurementSelectors";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useNavigateBack } from "../../../hooks/navigate";
import { PageContent } from "../../../components/PageContent/PageContent";
import { IsoDate } from "../../../types/date";
import { getLocaleDate } from "../../../utils/date";
import { getLanguage } from "../../../store/selectors/settings/settingsSelectors";
import Chart from "../../../components/Chart/Chart";

export const MeasurementProgress = () => {
	const { mainColor } = useTheme();
	const data = useAppSelector(getMeasurementData);
	const navigateBack = useNavigateBack();
	const language = useAppSelector(getLanguage);
	const navigateToMeasurement = useCallback(() => {
		navigateBack();
	}, [navigateBack]);

	const getDotContent = useCallback(
		({ x, y, indexData }: { x: number; y: number; index: number; indexData: number }) => {
			return (
				<ThemedView
					key={x + y}
					style={{
						position: "absolute",
						top: y - 25,
						left: x - 20,
						flex: 1,
						padding: 3,
						borderRadius,
						alignItems: "center",
					}}
				>
					<Text style={{ fontSize: 12, color: mainColor }}>
						{trunicateToNthSignificantDigit(indexData, false, 1)} {data?.unit}
					</Text>
				</ThemedView>
			);
		},
		[data?.unit, mainColor],
	);

	const getXLabel = useCallback(
		(label: string) => {
			return getLocaleDate(label as IsoDate, language, { dateStyle: "medium" }) ?? "";
		},
		[language],
	);

	if (!data) {
		navigateBack();
		return null;
	}

	return (
		<ThemedView background stretch round>
			<SiteNavigationButtons backButtonAction={navigateToMeasurement} title={data.name} />
			<PageContent background paddingTop={20}>
				<ThemedView style={{ padding: 10 }} round>
					<Chart
						transparent
						lineChartStyles={{ left: -30, top: 20, borderRadius }}
						getXLabel={getXLabel}
						getYLabel={() => ""}
						data={data}
						getDotContent={getDotContent}
					/>
				</ThemedView>
			</PageContent>
		</ThemedView>
	);
};
