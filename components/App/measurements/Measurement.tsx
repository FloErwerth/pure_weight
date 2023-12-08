import { VStack } from "../../Stack/VStack/VStack";
import { View } from "react-native";
import { Text } from "../../Themed/ThemedText/Text";
import { getDate } from "../../../utils/date";
import { ThemedMaterialCommunityIcons } from "../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { HStack } from "../../Stack/HStack/HStack";
import { useCallback, useMemo } from "react";
import { styles } from "./styles";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { useTheme } from "../../../theme/context";
import { useTranslation } from "react-i18next";
import { ProgressDisplay } from "../../WorkoutCard/components/ProgressDisplay/ProgressDisplay";
import { Measurement } from "./types";

import { getLanguage } from "../../../store/reducers/settings/settingsSelectors";
import { getLatestMeasurements, getMeasurmentProgress } from "../../../store/reducers/measurements/measurementSelectors";
import { useNavigate } from "../../../hooks/navigate";
import { setInspectedMeasurement } from "../../../store/reducers/measurements";

interface MeasurementProps {
    index: number;
    measurement: Measurement;
}

export const RenderedMeasurement = ({ index, measurement }: MeasurementProps) => {
    const latestMeasurements = useAppSelector(getLatestMeasurements);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { mainColor, componentBackgroundColor } = useTheme();
    const pressableWrapperStyle = useMemo(() => [styles.pressableWrapper, { backgroundColor: componentBackgroundColor }], [componentBackgroundColor]);
    const textStyle = useMemo(() => [styles.text, { color: mainColor }], [mainColor]);
    const language = useAppSelector(getLanguage);
    const progress = useAppSelector((state: AppState) => getMeasurmentProgress(state, index));

    const handleNavigateToChart = useCallback(() => {
        dispatch(setInspectedMeasurement(index));
        navigate("measurement/progress");
    }, [dispatch, index, navigate]);

    return (
        <HStack style={pressableWrapperStyle}>
            <VStack style={{ gap: 15, flex: 1, paddingRight: 10 }}>
                <View>
                    <Text style={textStyle}>{measurement.name}</Text>
                    <Text>
                        {t("measurement_latest")} {getDate(latestMeasurements[index], language)}
                    </Text>
                </View>
                {measurement.name && progress && (
                    <ProgressDisplay type="Measurement" higherIsBetter={measurement?.higherIsBetter} name={measurement?.name} percent={progress} onPress={handleNavigateToChart} />
                )}
            </VStack>
            <ThemedMaterialCommunityIcons name="table-large-plus" size={26} />
        </HStack>
    );
};
