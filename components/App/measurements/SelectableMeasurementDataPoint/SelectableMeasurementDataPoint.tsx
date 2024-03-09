import { Text } from "../../../Themed/ThemedText/Text";
import { getUnitByType } from "../../../../store/selectors/measurements/measurementSelectors";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { getLanguage, getUnitSystem } from "../../../../store/selectors/settings/settingsSelectors";
import { useAppSelector } from "../../../../store";
import { MeasurementType } from "../types";
import { styles } from "./styles";
import { IsoDate } from "../../../../types/date";
import { getLocaleDate } from "../../../../utils/date";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

type EditedMeasurementDataPointProps = {
    name: string;
    isoDate: IsoDate;
    value: string;
    type?: MeasurementType;
    selectMeasurementPoint: () => void;
};

export const SelectableMeasurementDataPoint = ({
    isoDate,
    value,
    type,
    selectMeasurementPoint,
    name,
}: EditedMeasurementDataPointProps) => {
    const unitSystem = useAppSelector(getUnitSystem);
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();
    return (
        <Animated.View style={styles.wrapper} entering={FadeIn} exiting={FadeOut} layout={Layout}>
            <ThemedPressable round padding stretch onPress={selectMeasurementPoint}>
                <Text style={styles.date}>{getLocaleDate(isoDate, language, { dateStyle: "medium" })}</Text>
                <Text style={styles.value}>
                    {t("measured_value")}: {value} {getUnitByType(unitSystem, type)} {name}
                </Text>
            </ThemedPressable>
        </Animated.View>
    );
};
