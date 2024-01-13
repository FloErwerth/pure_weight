import { trainStyles } from "../../../trainStyles";
import { TextStyle } from "react-native";
import { useMemo } from "react";
import { HStack } from "../../../../../Stack/HStack/HStack";
import { Text } from "../../../../../Themed/ThemedText/Text";
import { useTranslation } from "react-i18next";
import { styles } from "./styles";
import { AppState, useAppSelector } from "../../../../../../store";
import { getExerciseMetadataFromWorkoutByIndex } from "../../../../../../store/reducers/workout/workoutSelectors";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { getTimeUnit } from "../../../../../../store/reducers/settings/settingsSelectors";

interface ExerciseMetaDataDisplayProps {
    exerciseIndex: number;
}

interface SmallMetadataDisplayProps {
    style?: TextStyle;
    exerciseIndex: number;
}

export const TimeBasedSmallExerciseDataDisplay = ({ style, exerciseIndex }: SmallMetadataDisplayProps) => {
    const { t } = useTranslation();
    const textStyle = useMemo(() => [trainStyles.exerciseMetaText, style], [style]);
    const exerciseMetaData = useAppSelector((state: AppState) => getExerciseMetadataFromWorkoutByIndex(state, exerciseIndex));
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
                <Text style={textStyle}>
                    {exerciseMetaData?.sets}&thinsp;{t(`training_header_sets_${isSingle ? "single" : "multi"}`)}
                </Text>
                <Text style={textStyle}>&#x30FB;</Text>
                <HStack style={styles.timeStack}>
                    {showDurationMinutes && (
                        <ThemedView>
                            <HStack style={styles.smallGap}>
                                <Text style={textStyle}>{exerciseMetaData.duration?.minutes}</Text>
                                <Text style={textStyle}>{minutesUnit}</Text>
                            </HStack>
                        </ThemedView>
                    )}
                    {showDurationSeconds && (
                        <ThemedView>
                            <HStack style={styles.smallGap}>
                                <Text style={textStyle}>{exerciseMetaData.duration?.seconds}</Text>
                                <Text style={textStyle}>{secondsUnit}</Text>
                            </HStack>
                        </ThemedView>
                    )}
                </HStack>
                <Text style={textStyle}>{` ${t("after")} `}</Text>
                {showPreparation && (
                    <HStack>
                        <HStack style={styles.timeStack}>
                            {showPreparationMinutes && (
                                <ThemedView>
                                    <HStack style={styles.smallGap}>
                                        <Text style={textStyle}>{exerciseMetaData.preparation?.minutes}</Text>
                                        <Text style={textStyle}>{minutesUnit}</Text>
                                    </HStack>
                                </ThemedView>
                            )}
                            {showPreparationSeconds && (
                                <ThemedView>
                                    <HStack style={styles.smallGap}>
                                        <Text style={textStyle}>{exerciseMetaData.preparation?.seconds}</Text>
                                        <Text style={textStyle}>{secondsUnit}</Text>
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
                                        <Text style={textStyle}>{exerciseMetaData.pause?.minutes}</Text>
                                        <Text style={textStyle}>{minutesUnit}</Text>
                                    </HStack>
                                </ThemedView>
                            )}
                            {showPauseSecnds && (
                                <ThemedView>
                                    <HStack style={styles.smallGap}>
                                        <Text style={textStyle}>{exerciseMetaData.pause?.seconds}</Text>
                                        <Text style={textStyle}>{secondsUnit}</Text>
                                    </HStack>
                                </ThemedView>
                            )}
                        </HStack>
                        <Text style={textStyle}>{` ${t("pause_lower")} `}</Text>
                    </HStack>
                )}
            </HStack>
        </ThemedView>
    );
};
