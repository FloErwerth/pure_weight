import { trainStyles } from "../../../trainStyles";
import { Pressable } from "react-native";
import { useCallback, useMemo } from "react";
import { HStack } from "../../../../../Stack/HStack/HStack";
import { VStack } from "../../../../../Stack/VStack/VStack";
import { Text } from "../../../../../Themed/ThemedText/Text";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { ThemedMaterialCommunityIcons } from "../../../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { AppState, useAppDispatch, useAppSelector } from "../../../../../../store";
import { getExerciseMetadataFromWorkoutById } from "../../../../../../store/reducers/workout/workoutSelectors";
import { setEditedExercise } from "../../../../../../store/reducers/workout";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { getTimeUnit, getWeightUnit } from "../../../../../../store/reducers/settings/settingsSelectors";
import { useNavigate } from "../../../../../../hooks/navigate";
import { ExerciseId, ExerciseMetaData } from "../../../../../../store/reducers/workout/types";

interface ExerciseMetaDataDisplayProps {
    exerciseId: ExerciseId;
}

interface SmallMetadataDisplayProps {
    exerciseMetaData: ExerciseMetaData;
}

export const WeightBasedSmallExerciseMetadataDisplay = ({ exerciseMetaData }: SmallMetadataDisplayProps) => {
    const { t } = useTranslation();
    const isSingle = useMemo(() => parseFloat(exerciseMetaData?.sets ?? "0") === 1, [exerciseMetaData?.sets]);
    const showMinutes = parseFloat(exerciseMetaData?.pause?.minutes ?? "0") !== 0;
    const showSeconds = parseFloat(exerciseMetaData?.pause?.seconds ?? "0") !== 0;
    const { secondsUnit, minutesUnit } = useAppSelector(getTimeUnit);
    const weightUnit = useAppSelector(getWeightUnit);
    const showPause = showMinutes || showSeconds;

    const mit = useMemo(() => t("with"), [t]);

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
                <Text style={trainStyles.exerciseMetaText}>
                    {exerciseMetaData?.reps}&thinsp;{t("training_header_reps")}
                </Text>
                <Text style={trainStyles.exerciseMetaText}>&thinsp;{`${mit}`}&thinsp;</Text>
                <Text style={trainStyles.exerciseMetaText}>
                    {exerciseMetaData?.weight}&thinsp;{weightUnit}
                </Text>
            </HStack>
            {showPause && (
                <HStack>
                    <HStack style={styles.timeStack}>
                        {showMinutes && (
                            <ThemedView>
                                <HStack style={styles.smallGap}>
                                    <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData.pause?.minutes}</Text>
                                    <Text style={trainStyles.exerciseMetaText}>{minutesUnit}</Text>
                                </HStack>
                            </ThemedView>
                        )}
                        {showSeconds && (
                            <ThemedView>
                                <HStack style={styles.smallGap}>
                                    <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData.pause?.seconds}</Text>
                                    <Text style={trainStyles.exerciseMetaText}>{secondsUnit}</Text>
                                </HStack>
                            </ThemedView>
                        )}
                    </HStack>
                    <Text style={trainStyles.exerciseMetaText}> {t("pause_lower")}</Text>
                </HStack>
            )}
        </ThemedView>
    );
};

export const WeightBasedExerciseMetadataDisplay = ({ exerciseId }: ExerciseMetaDataDisplayProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleShowModal = useCallback(() => {
        dispatch(setEditedExercise({ isTrained: true, exerciseId }));
        void Haptics.selectionAsync();
        navigate("workouts/create/exercise");
    }, [dispatch, exerciseId, navigate]);

    const exerciseMetaData = useAppSelector((state: AppState) => getExerciseMetadataFromWorkoutById(state, exerciseId));

    if (!exerciseMetaData) {
        return null;
    }

    return (
        <>
            <HStack style={styles.wrapper}>
                <VStack>
                    <Text style={trainStyles.exerciseName}>{exerciseMetaData?.name}</Text>
                    <WeightBasedSmallExerciseMetadataDisplay exerciseMetaData={exerciseMetaData} />
                </VStack>
                <Pressable onPress={handleShowModal} style={styles.pressable}>
                    <ThemedMaterialCommunityIcons name="pencil" size={24} />
                </Pressable>
            </HStack>
        </>
    );
};
