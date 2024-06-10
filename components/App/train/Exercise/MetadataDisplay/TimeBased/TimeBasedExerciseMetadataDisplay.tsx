import { trainStyles } from "../../../trainStyles";
import { HStack } from "../../../../../Stack/HStack/HStack";
import { Text } from "../../../../../Themed/ThemedText/Text";
import { styles } from "../styles";
import { useAppSelector } from "../../../../../../store";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { getTimeUnit } from "../../../../../../store/selectors/settings/settingsSelectors";
import { ExerciseMetaData } from "../../../../../../store/reducers/workout/types";
import { useMemo } from "react";
import { useTypedTranslation } from "../../../../../../locales/i18next";
import { TranslationKeys } from "../../../../../../locales/translationKeys";

interface SmallMetadataDisplayProps {
    exerciseMetaData: ExerciseMetaData;
}

export const TimeBasedSmallExerciseDataDisplay = ({ exerciseMetaData }: SmallMetadataDisplayProps) => {
    const { t } = useTypedTranslation();

    const minutes = useMemo(() => {
        const parsedMinutes = parseInt(exerciseMetaData?.pauseMinutes ?? "0", 10);
        return parsedMinutes > 0 ? parsedMinutes : undefined;
    }, [exerciseMetaData?.pauseMinutes]);

    const seconds = useMemo(() => {
        const parsedSeconds = parseInt(exerciseMetaData?.pauseSeconds ?? "0", 10);
        return parsedSeconds > 0 ? parsedSeconds : undefined;
    }, [exerciseMetaData?.pauseSeconds]);

    const { secondsUnit, minutesUnit } = useAppSelector(getTimeUnit);
    const showPause = minutes || seconds;
    const metaText = useMemo(() => ` ${t(TranslationKeys.PAUSE_LOWER)} `, [t]);
    if (!exerciseMetaData) {
        return null;
    }

    return (
        <ThemedView>
            <HStack>
                {showPause && (
                    <HStack>
                        <HStack style={styles.timeStack}>
                            {minutes && (
                                <ThemedView>
                                    <HStack style={styles.smallGap}>
                                        <Text style={trainStyles.exerciseMetaText}>{minutes}</Text>
                                        <Text style={trainStyles.exerciseMetaText}>{minutesUnit}</Text>
                                    </HStack>
                                </ThemedView>
                            )}
                            {seconds && (
                                <ThemedView>
                                    <HStack style={styles.smallGap}>
                                        <Text style={trainStyles.exerciseMetaText}>{seconds}</Text>
                                        <Text style={trainStyles.exerciseMetaText}>{secondsUnit}</Text>
                                    </HStack>
                                </ThemedView>
                            )}
                        </HStack>
                        <Text style={trainStyles.exerciseMetaText}>{metaText}</Text>
                    </HStack>
                )}
            </HStack>
        </ThemedView>
    );
};
