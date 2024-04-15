import { trainStyles } from "../../../trainStyles";
import { HStack } from "../../../../../Stack/HStack/HStack";
import { Text } from "../../../../../Themed/ThemedText/Text";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAppSelector } from "../../../../../../store";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { getTimeUnit } from "../../../../../../store/selectors/settings/settingsSelectors";
import { ExerciseMetaData } from "../../../../../../store/reducers/workout/types";
import { useMemo } from "react";

interface SmallMetadataDisplayProps {
    exerciseMetaData: ExerciseMetaData;
}

export const WeightBasedSmallExerciseMetadataDisplay = ({ exerciseMetaData }: SmallMetadataDisplayProps) => {
    const { t } = useTranslation();
    const showMinutes = parseFloat(exerciseMetaData?.pauseMinutes || "0") !== 0;
    const showSeconds = parseFloat(exerciseMetaData?.pauseSeconds || "0") !== 0;
    const { secondsUnit, minutesUnit } = useAppSelector(getTimeUnit);
    const showPause = showMinutes || showSeconds;
    const pauseLowerText = useMemo(() => " ".concat(t("pause_lower")), [t]);

    if (!exerciseMetaData) {
        return null;
    }

    return (
        <ThemedView>
            {showPause && (
                <HStack>
                    <HStack style={styles.timeStack}>
                        {showMinutes && (
                            <ThemedView>
                                <HStack style={styles.smallGap}>
                                    <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData.pauseMinutes}</Text>
                                    <Text style={trainStyles.exerciseMetaText}>{minutesUnit}</Text>
                                </HStack>
                            </ThemedView>
                        )}
                        {showSeconds && (
                            <ThemedView>
                                <HStack style={styles.smallGap}>
                                    <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData.pauseSeconds}</Text>
                                    <Text style={trainStyles.exerciseMetaText}>{secondsUnit}</Text>
                                </HStack>
                            </ThemedView>
                        )}
                    </HStack>
                    <Text style={trainStyles.exerciseMetaText}>{pauseLowerText}</Text>
                </HStack>
            )}
        </ThemedView>
    );
};
