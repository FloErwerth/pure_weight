import { trainStyles } from "../../../trainStyles";
import { useMemo } from "react";
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
    const isSingle = useMemo(() => parseFloat(exerciseMetaData?.sets ?? "0") === 1, [exerciseMetaData?.sets]);
    const showDurationMinutes = parseFloat(exerciseMetaData?.duration?.minutes ?? "0") !== 0;
    const showDurationSeconds = parseFloat(exerciseMetaData?.duration?.seconds ?? "0") !== 0;
    const showPauseMinutes = parseFloat(exerciseMetaData?.pause?.minutes ?? "0") !== 0;
    const showPauseSecnds = parseFloat(exerciseMetaData?.pause?.seconds ?? "0") !== 0;
    const showPreparationMinutes = parseFloat(exerciseMetaData?.preparation?.minutes ?? "0") !== 0;
    const showPreparationSeconds = parseFloat(exerciseMetaData?.preparation?.seconds ?? "0") !== 0;
    const { secondsUnit, minutesUnit } = useAppSelector(getTimeUnit);
    const showPause = showPauseMinutes || showPauseSecnds;
    const showPreparation = showPreparationMinutes || showPreparationSeconds;
    if (!exerciseMetaData) {
        return null;
    }

    return (
        <ThemedView>
            <HStack>
                <Text style={trainStyles.exerciseMetaText}>
                    {exerciseMetaData?.sets}&thinsp;{t(`training_header_sets_${isSingle ? "single" : "multi"}`)}
                </Text>
                <Text style={trainStyles.exerciseMetaText}>&thinsp;x&thinsp;</Text>
                <HStack style={styles.timeStack}>
                    {showDurationMinutes && (
                        <ThemedView>
                            <HStack style={styles.smallGap}>
                                <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData.duration?.minutes}</Text>
                                <Text style={trainStyles.exerciseMetaText}>{minutesUnit}</Text>
                            </HStack>
                        </ThemedView>
                    )}
                    {showDurationSeconds && (
                        <ThemedView>
                            <HStack style={styles.smallGap}>
                                <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData.duration?.seconds}</Text>
                                <Text style={trainStyles.exerciseMetaText}>{secondsUnit}</Text>
                            </HStack>
                        </ThemedView>
                    )}
                </HStack>
                <Text style={trainStyles.exerciseMetaText}>&thinsp;{`${t("after")}`}&thinsp;</Text>
                {showPreparation && (
                    <HStack>
                        <HStack style={styles.timeStack}>
                            {showPreparationMinutes && (
                                <ThemedView>
                                    <HStack style={styles.smallGap}>
                                        <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData.preparation?.minutes}</Text>
                                        <Text style={trainStyles.exerciseMetaText}>{minutesUnit}</Text>
                                    </HStack>
                                </ThemedView>
                            )}
                            {showPreparationSeconds && (
                                <ThemedView>
                                    <HStack style={styles.smallGap}>
                                        <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData.preparation?.seconds}</Text>
                                        <Text style={trainStyles.exerciseMetaText}>{secondsUnit}</Text>
                                    </HStack>
                                </ThemedView>
                            )}
                        </HStack>
                    </HStack>
                )}
            </HStack>
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
