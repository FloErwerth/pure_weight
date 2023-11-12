import { Modal } from "../../../Modal/Modal";
import { useCallback } from "react";
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

interface MeasurementChartModalProps {
  isVisible: boolean;
  onRequestClose: () => void;
  name?: string;
  unit?: MeasurementUnit;
  index: number;
}

export const MeasurementChartModal = ({ isVisible, onRequestClose, index, unit, name }: MeasurementChartModalProps) => {
  const handleRequestClose = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);
  const { mainColor } = useTheme();
  const data = useAppSelector((state: AppState) => getMeasurementDataFromIndex(state, index));
  const getDotContent = useCallback(
    ({ x, y, indexData }: { x: number; y: number; index: number; indexData: number }) => {
      return (
        <ThemedView key={x + y} style={{ position: "absolute", top: y - 25, left: x - 20, flex: 1, padding: 3, borderRadius, alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: mainColor }}>
            {truncateToNthSignificantDigit(indexData)} {unit}
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
    <Modal title={name} onRequestClose={handleRequestClose} isVisible={isVisible}>
      <Chart transparent lineChartStyles={{ left: -45, top: 20, borderRadius }} getYLabel={() => ""} data={data} getDotContent={getDotContent} />
    </Modal>
  );
};
