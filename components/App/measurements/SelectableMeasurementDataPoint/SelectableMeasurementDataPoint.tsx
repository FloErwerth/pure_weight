import { Text } from "../../../Themed/ThemedText/Text";
import { getSinceDate } from "../../../../utils/date";
import { getUnitByType } from "../../../../store/reducers/measurements/measurementSelectors";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { getLanguage, getUnitSystem } from "../../../../store/reducers/settings/settingsSelectors";
import { useAppSelector } from "../../../../store";
import { MeasurementType } from "../types";
import { styles } from "./styles";
import { IsoDate } from "../../../../types/date";

type EditedMeasurementDataPointProps = {
    isoDate: IsoDate;
    value: string;
    type?: MeasurementType;
    selectMeasurementPoint: () => void;
};

const useFillingText = () => {
    const language = useAppSelector(getLanguage);
    return language === "de" ? "am " : "on ";
};

export const SelectableMeasurementDataPoint = ({ isoDate, value, type, selectMeasurementPoint }: EditedMeasurementDataPointProps) => {
    const unitSystem = useAppSelector(getUnitSystem);
    const fillingText = useFillingText();
    return (
        <ThemedPressable round padding stretch onPress={selectMeasurementPoint}>
            <Text style={styles.value}>
                {value} {getUnitByType(unitSystem, type)}
            </Text>
            <Text style={styles.date}>
                {fillingText}
                {getSinceDate(isoDate)}
            </Text>
        </ThemedPressable>
    );
};
