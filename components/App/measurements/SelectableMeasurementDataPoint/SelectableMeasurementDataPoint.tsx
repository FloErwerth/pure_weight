import { Text } from "../../../Themed/ThemedText/Text";
import { getUnitByType } from "../../../../store/reducers/measurements/measurementSelectors";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { getLanguage, getUnitSystem } from "../../../../store/reducers/settings/settingsSelectors";
import { useAppSelector } from "../../../../store";
import { MeasurementType } from "../types";
import { styles } from "./styles";
import { IsoDate } from "../../../../types/date";
import { getLocaleDate } from "../../../../utils/date";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

type EditedMeasurementDataPointProps = {
    isoDate: IsoDate;
    value: string;
    type?: MeasurementType;
    selectMeasurementPoint: () => void;
};

export const SelectableMeasurementDataPoint = ({ isoDate, value, type, selectMeasurementPoint }: EditedMeasurementDataPointProps) => {
    const unitSystem = useAppSelector(getUnitSystem);
    const language = useAppSelector(getLanguage);
    return (
        <Animated.View style={styles.wrapper} entering={FadeIn} exiting={FadeOut} layout={Layout}>
            <ThemedPressable round padding stretch onPress={selectMeasurementPoint}>
                <Text style={styles.value}>
                    {value} {getUnitByType(unitSystem, type)}
                </Text>
                <Text style={styles.date}>{getLocaleDate(isoDate, language, { dateStyle: "medium" })}</Text>
            </ThemedPressable>
        </Animated.View>
    );
};
