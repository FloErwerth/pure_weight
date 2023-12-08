import { lazy, Suspense, useCallback, useMemo } from "react";
import { useTheme } from "../../../theme/context";
import { useAppDispatch, useAppSelector } from "../../../store";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { borderRadius } from "../../../theme/border";
import { trunicateToNthSignificantDigit } from "../../../utils/number";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { getMeasurementData } from "../../../store/reducers/measurements/measurementSelectors";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useNavigate } from "../../../hooks/navigate";
import { PageContent } from "../../../components/PageContent/PageContent";
import { styles } from "../../../components/App/progress/chart/components/styles";
import { ThemedScrollView } from "../../../components/Themed/ThemedScrollView/ThemedScrollView";
import { VStack } from "../../../components/Stack/VStack/VStack";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { Skeleton } from "../../../components/Skeleton/Skeleton";
import { Dimensions } from "react-native";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { MeasurementSelection } from "../../../components/App/settings/components/Selections/HistoryEntrySelection/Measurement/MeasurementSelection";

const Chart = lazy(() => import("../../../components/Chart/Chart"));
const Fallback = () => {
    const { componentBackgroundColor } = useTheme();
    const containerStyles = useMemo(() => [styles.vStack, { backgroundColor: componentBackgroundColor }], [componentBackgroundColor]);
    return (
        <ThemedScrollView ghost contentContainerStyle={styles.scrollView}>
            <VStack key={Math.random() * 10000} style={containerStyles}>
                <HStack style={styles.hStack}>
                    <Skeleton borderRadius={borderRadius} width={140} height={40} />
                    <Skeleton borderRadius={borderRadius} width={140} height={40} />
                </HStack>
                <Skeleton borderRadius={borderRadius} width={Dimensions.get("screen").width - 40} height={283} />
            </VStack>
        </ThemedScrollView>
    );
};
const PromiseTrigger = () => {
    throw new Promise(() => {});
};
const handleConfirmIcon = { name: "cog", size: 24 } as const;

export const MeasurementProgress = () => {
    const { mainColor } = useTheme();
    const data = useAppSelector(getMeasurementData);
    const navigate = useNavigate();
    const [ref, open] = useBottomSheetRef();
    const dispatch = useAppDispatch();
    const navigateToMeasurement = useCallback(() => {
        navigate("measurements");
    }, [navigate]);

    const getDotContent = useCallback(
        ({ x, y, indexData }: { x: number; y: number; index: number; indexData: number }) => {
            return (
                <ThemedView key={x + y} style={{ position: "absolute", top: y - 25, left: x - 20, flex: 1, padding: 3, borderRadius, alignItems: "center" }}>
                    <Text style={{ fontSize: 12, color: mainColor }}>
                        {trunicateToNthSignificantDigit(indexData, false, 1)} {data?.unit}
                    </Text>
                </ThemedView>
            );
        },
        [data?.unit, mainColor],
    );

    if (!data) {
        navigate("measurements");
        return null;
    }

    return (
        <ThemedView background stretch round>
            <SiteNavigationButtons handleBack={navigateToMeasurement} title={data.name} handleConfirmIcon={handleConfirmIcon} handleConfirm={open} />
            <PageContent paddingTop={20}>
                <Suspense fallback={<Fallback />}>
                    <ThemedView style={{ padding: 10 }} round>
                        <Chart transparent lineChartStyles={{ left: -45, top: 20, borderRadius }} getYLabel={() => ""} data={data} getDotContent={getDotContent} />
                    </ThemedView>
                </Suspense>
            </PageContent>
            <ThemedBottomSheetModal snapPoints={["35%"]} ref={ref} title={"Number of workout entries"}>
                <MeasurementSelection insideModal />
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
