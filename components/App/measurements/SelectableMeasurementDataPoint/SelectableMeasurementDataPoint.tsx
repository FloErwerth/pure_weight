import { Text } from "../../../Themed/ThemedText/Text";
import { getUnitByType } from "../../../../store/reducers/measurements/measurementSelectors";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { getUnitSystem } from "../../../../store/reducers/settings/settingsSelectors";
import { useAppSelector } from "../../../../store";
import { MeasurementType } from "../types";
import { styles } from "./styles";
import { IsoDate } from "../../../../types/date";
import { getSinceDate } from "../../../../utils/timeAgo";

type EditedMeasurementDataPointProps = {
    isoDate: IsoDate;
    value: string;
    type?: MeasurementType;
    selectMeasurementPoint: () => void;
};

export const SelectableMeasurementDataPoint = ({ isoDate, value, type, selectMeasurementPoint }: EditedMeasurementDataPointProps) => {
    const unitSystem = useAppSelector(getUnitSystem);
    return (
        <ThemedPressable round padding stretch onPress={selectMeasurementPoint}>
            <Text style={styles.value}>
                {value} {getUnitByType(unitSystem, type)}
            </Text>
            <Text style={styles.date}>{getSinceDate(isoDate)}</Text>
        </ThemedPressable>
    );
};
