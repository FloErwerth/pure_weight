import { trainStyles } from "../trainStyles";
import { Pressable, TextStyle } from "react-native";
import { useCallback, useMemo } from "react";
import { HStack } from "../../../Stack/HStack/HStack";
import { VStack } from "../../../Stack/VStack/VStack";
import { Text } from "../../../Themed/ThemedText/Text";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { EditableExerciseModal } from "../../../EditableExerciseModal/EditableExerciseModal";
import { useBottomSheetRef } from "../../../BottomSheetModal/ThemedBottomSheetModal";
import { styles } from "./styles";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { AppState, useAppDispatch, useAppSelector } from "../../../../store";
import { getWeightBasedExerciseMetaDataFromTrainedWorkout } from "../../../../store/reducers/workout/workoutSelectors";
import { setEditedExercise } from "../../../../store/reducers/workout";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { getTimeUnit, getWeightUnit } from "../../../../store/reducers/settings/settingsSelectors";

interface ExerciseMetaDataDisplayProps {
    exerciseIndex: number;
}

interface SmallMetadataDisplayProps {
    style?: TextStyle;
    exerciseIndex: number;
}

export const SmallMetadataDisplay = ({ style, exerciseIndex }: SmallMetadataDisplayProps) => {
    const { t } = useTranslation();
    const textStyle = useMemo(() => [trainStyles.exerciseMetaText, style], [style]);
    const exerciseMetaData = useAppSelector((state: AppState) => getWeightBasedExerciseMetaDataFromTrainedWorkout(state, exerciseIndex));
    const isSingle = useMemo(() => parseFloat(exerciseMetaData?.sets ?? "0") === 1, [exerciseMetaData?.sets]);
    const showMinutes = parseFloat(exerciseMetaData?.pause?.minutes ?? "0") !== 0;
    const showSeconds = parseFloat(exerciseMetaData?.pause?.seconds ?? "0") !== 0;
    const { secondsUnit, minutesUnit } = useAppSelector(getTimeUnit);
    const weightUnit = useAppSelector(getWeightUnit);
    const showPause = showMinutes || showSeconds;
    if (!exerciseMetaData) {
        return null;
    }

    return (
        <HStack>
            <Text style={textStyle}>
                {exerciseMetaData?.weight} {weightUnit}
            </Text>
            <Text style={textStyle}>&#x30FB;</Text>
            <Text style={textStyle}>
                {exerciseMetaData?.sets} {t(`training_header_sets_${isSingle ? "single" : "multi"}`)}
            </Text>
            <Text style={textStyle}>&#x30FB;</Text>
            <Text style={textStyle}>
                {exerciseMetaData?.reps} {t("training_header_reps")}
            </Text>
            {showPause && (
                <HStack>
                    <Text style={textStyle}>&#x30FB;</Text>
                    <HStack style={styles.timeStack}>
                        {showMinutes && (
                            <ThemedView>
                                <HStack style={styles.smallGap}>
                                    <Text style={textStyle}>{exerciseMetaData.pause?.minutes}</Text>
                                    <Text style={textStyle}>{minutesUnit}</Text>
                                </HStack>
                            </ThemedView>
                        )}
                        {showSeconds && (
                            <ThemedView>
                                <HStack style={styles.smallGap}>
                                    <Text style={textStyle}>{exerciseMetaData.pause?.seconds}</Text>
                                    <Text style={textStyle}>{secondsUnit}</Text>
                                </HStack>
                            </ThemedView>
                        )}
                    </HStack>
                </HStack>
            )}
        </HStack>
    );
};

export const ExerciseMetaDataDisplay = ({ exerciseIndex }: ExerciseMetaDataDisplayProps) => {
    const dispatch = useAppDispatch();
    const [addExerciseRef] = useBottomSheetRef();

    const handleShowModal = useCallback(() => {
        dispatch(setEditedExercise({ index: exerciseIndex, isTrained: true }));
        void Haptics.selectionAsync();
        addExerciseRef.current?.present();
    }, [addExerciseRef, dispatch, exerciseIndex]);

    const exerciseMetaData = useAppSelector((state: AppState) => getWeightBasedExerciseMetaDataFromTrainedWorkout(state, exerciseIndex));

    const handleClose = useCallback(() => {
        addExerciseRef.current?.close();
    }, [addExerciseRef]);

    if (!exerciseMetaData) {
        return null;
    }

    return (
        <>
            <HStack style={styles.wrapper}>
                <VStack>
                    <Text style={trainStyles.exerciseName}>{exerciseMetaData?.name}</Text>
                    <SmallMetadataDisplay exerciseIndex={exerciseIndex} />
                </VStack>
                <Pressable onPress={handleShowModal} style={styles.pressable}>
                    <ThemedMaterialCommunityIcons name="pencil" size={24} />
                </Pressable>
            </HStack>
            <EditableExerciseModal reference={addExerciseRef} onRequestClose={handleClose} />
        </>
    );
};
