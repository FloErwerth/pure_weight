import { Dimensions, View } from "react-native";
import { Modal } from "../../../Modal/Modal";
import { useCallback, useRef, useState } from "react";
import { Grid, LineChart, YAxis } from "react-native-svg-charts";
import { HStack } from "../../../HStack/HStack";
import { useAppSelector } from "../../../../store";
import { AppState } from "../../../../store/types";
import { getMeasurementDataFromIndex } from "../../../../store/selectors";
import { MeasurementUnit } from "../types";

interface MeasurementChartModalProps {
  isVisible: boolean;
  onRequestClose: () => void;
  name?: string;
  unit?: MeasurementUnit;
  index: number;
}

const WIDTH = Dimensions.get("screen").width - 100;
const HEIGHT = Dimensions.get("screen").height * 0.33;
export const MeasurementChartModal = ({ isVisible, onRequestClose, index, unit, name }: MeasurementChartModalProps) => {
  const handleRequestClose = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  const data = useAppSelector((state: AppState) => getMeasurementDataFromIndex(state, index));
  const [modalWidth, setModalWidth] = useState(WIDTH);
  const containerRef = useRef<View>(null);

  const measureContainer = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.measure((x, y, width) => {
        setModalWidth(width);
      });
    }
  }, []);

  const contentInset = { top: 20, bottom: 20 };

  const getYLabel = useCallback(
    (value: unknown) => {
      return `${value} ${unit}`;
    },
    [unit],
  );

  if (!data) {
    return null;
  }

  return (
    <Modal title={name} onRequestClose={handleRequestClose} isVisible={isVisible}>
      <HStack style={{ height: HEIGHT, width: WIDTH }} reference={containerRef} onLayout={measureContainer}>
        <YAxis formatLabel={getYLabel} contentInset={contentInset} data={data} />
        <LineChart style={{ height: HEIGHT, flex: 1, marginLeft: 10, width: WIDTH }} data={data} svg={{ stroke: "rgb(134, 65, 244)" }} contentInset={contentInset}>
          <Grid direction={"BOTH"} ticks={[2, 1, 2, 1, 1]} />
        </LineChart>
      </HStack>
    </Modal>
  );
};
