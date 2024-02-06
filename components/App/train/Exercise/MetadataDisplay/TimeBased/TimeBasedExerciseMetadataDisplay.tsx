import { trainStyles } from "../../../trainStyles";
import { HStack } from "../../../../../Stack/HStack/HStack";
import { Text } from "../../../../../Themed/ThemedText/Text";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAppSelector } from "../../../../../../store";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { getTimeUnit } from "../../../../../../store/reducers/settings/settingsSelectors";
import { ExerciseMetaData } from "../../../../../../store/reducers/workout/types";

interface SmallMetadataDisplayProps {
    exerciseMetaData: ExerciseMetaData;
}

export const TimeBasedSmallExerciseDataDisplay = ({ exerciseMetaData }: SmallMetadataDisplayProps) => {
    const { t } = useTranslation();
    const showPauseMinutes = parseFloat(exerciseMetaData?.pause?.minutes ?? "0") !== 0;
    const showPauseSecnds = parseFloat(exerciseMetaData?.pause?.seconds ?? "0") !== 0;
    const { secondsUnit, minutesUnit } = useAppSelector(getTimeUnit);
    const showPause = showPauseMinutes || showPauseSecnds;
    if (!exerciseMetaData) {
        return null;
    }

    return (
        <ThemedView>
            <HStack>
                {showPause && (
                    <HStack>
                        <HStack style={styles.timeStack}>
                            {showPauseMinutes && (
                                <ThemedView>
                                    <HStack style={styles.smallGap}>
                                        <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData.pause?.minutes}</Text>
                                        <Text style={trainStyles.exerciseMetaText}>{minutesUnit}</Text>
                                    </HStack>
                                </ThemedView>
                            )}
                            {showPauseSecnds && (
                                <ThemedView>
                                    <HStack style={styles.smallGap}>
                                        <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData.pause?.seconds}</Text>
                                        <Text style={trainStyles.exerciseMetaText}>{secondsUnit}</Text>
                                    </HStack>
                                </ThemedView>
                            )}
                        </HStack>
                        <Text style={trainStyles.exerciseMetaText}>{` ${t("pause_lower")} `}</Text>
                    </HStack>
                )}
            </HStack>
        </ThemedView>
    );
};
