import { ThemedBottomSheetModalProps, ThemedButtomSheetModal } from "../../../BottomSheetModal/ThemedButtomSheetModal";
import { RefObject, useCallback } from "react";
import { AppState, useAppSelector } from "../../../../store";
import { MeasurementType } from "../types";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { borderRadius } from "../../../../theme/border";
import { Text } from "../../../Themed/ThemedText/Text";
import { useTheme } from "../../../../theme/context";
import { Chart } from "../../../Chart/Chart";
import { trunicateToNthSignificantDigit } from "../../../../utils/number";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getMeasurementDataFromIndex } from "../../../../store/reducers/measurements/measurementSelectors";

interface MeasurementChartModalProps extends ThemedBottomSheetModalProps {
    reference: RefObject<BottomSheetModal>;
    name?: string;
    unit?: MeasurementType;
    index: number;
}

export const MeasurementChartModal = ({ index, unit, name, reference }: MeasurementChartModalProps) => {
    const { mainColor } = useTheme();
    const data = useAppSelector((state: AppState) => getMeasurementDataFromIndex(state, index));
    const getDotContent = useCallback(
        ({ x, y, indexData }: { x: number; y: number; index: number; indexData: number }) => {
            return (
                <ThemedView key={x + y} style={{ position: "absolute", top: y - 25, left: x - 20, flex: 1, padding: 3, borderRadius, alignItems: "center" }}>
                    <Text style={{ fontSize: 12, color: mainColor }}>
                        {trunicateToNthSignificantDigit(indexData + 0.0012121221, false, 1)} {unit}
                    </Text>
                </ThemedView>
            );
        },
        [mainColor, unit],
    );
    if (!data) {
        return null;
    }

    return (
        <ThemedButtomSheetModal ref={reference} title={name}>
            <Chart transparent lineChartStyles={{ left: -45, top: 20, borderRadius }} getYLabel={() => ""} data={data} getDotContent={getDotContent} />
        </ThemedButtomSheetModal>
    );
};
