import { ThemedBottomSheetModalProps, ThemedButtomSheetModal } from "../../../BottomSheetModal/ThemedButtomSheetModal";
import { RefObject, useCallback } from "react";
import { useAppSelector } from "../../../../store";
import { AppState } from "../../../../store/types";
import { getMeasurementDataFromIndex } from "../../../../store/selectors";
import { MeasurementUnit } from "../types";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { borderRadius } from "../../../../theme/border";
import { Text } from "../../../Themed/ThemedText/Text";
import { useTheme } from "../../../../theme/context";
import { Chart } from "../../../Chart/Chart";
import { truncateToNthSignificantDigit } from "../../../../utils/number";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface MeasurementChartModalProps extends ThemedBottomSheetModalProps {
  reference: RefObject<BottomSheetModal>;
  name?: string;
  unit?: MeasurementUnit;
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
            {truncateToNthSignificantDigit(indexData + 0.0012121221, false, 1)} {unit}
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
