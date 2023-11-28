import { trainStyles } from "../trainStyles";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { Pressable, TextStyle } from "react-native";
import { useCallback, useMemo } from "react";
import { ExerciseMetaData, WeightBasedExerciseMetaData } from "../../../../store/types";
import { HStack } from "../../../Stack/HStack/HStack";
import { VStack } from "../../../Stack/VStack/VStack";
import { Text } from "../../../Themed/ThemedText/Text";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { AddExerciseModal } from "../../../AddExerciseModal/AddExerciseModal";
import { useBottomSheetRef } from "../../../BottomSheetModal/ThemedButtomSheetModal";
import { styles } from "./styles";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { editWorkout } from "../../../../store/reducers/workout";

import { getSelectedTrainingDay } from "../../../../store/reducers/workout/workoutSelectors";

interface ExerciseMetaDataDisplayProps {
    exerciseIndex: number;
    exerciseMetaData?: WeightBasedExerciseMetaData;
}

interface SmallMetadataDisplayProps {
    exerciseMetaData: ExerciseMetaData;
    style?: TextStyle;
}

export const SmallMetadataDisplay = ({ style, exerciseMetaData }: SmallMetadataDisplayProps) => {
    const { t } = useTranslation();
    const textStyle = useMemo(() => [trainStyles.exerciseMetaText, style], [style]);

    const isSingle = useMemo(() => parseFloat(exerciseMetaData.sets) === 1, [exerciseMetaData.sets]);

    if (exerciseMetaData.type === "WEIGHT_BASED") {
        return (
            <HStack>
                <Text style={textStyle}>
                    {exerciseMetaData?.weight} {t("training_header_weight")}
                </Text>
                <Text style={textStyle}>&#x30FB;</Text>
                <Text style={textStyle}>
                    {exerciseMetaData?.sets} {t(`training_header_sets_${isSingle ? "single" : "multi"}`)}
                </Text>
                <Text style={textStyle}>&#x30FB;</Text>
                <Text style={textStyle}>
                    {exerciseMetaData?.reps} {t("training_header_reps")}
                </Text>
                {exerciseMetaData?.pause && (
                    <>
                        <Text style={textStyle}>&#x30FB;</Text>
                        <Text style={textStyle}>{exerciseMetaData.pause} min</Text>
                    </>
                )}
            </HStack>
        );
    } else {
        //TODO: implement small exercise meta data display for time based exercises
        return null;
    }
};

export const ExerciseMetaDataDisplay = ({ exerciseIndex, exerciseMetaData }: ExerciseMetaDataDisplayProps) => {
    const selectedTraining = useAppSelector(getSelectedTrainingDay);
    const dispatch = useAppDispatch();
    const [addExerciseRef] = useBottomSheetRef();
    const handleShowModal = useCallback(() => {
        void Haptics.selectionAsync();
        addExerciseRef.current?.present();
    }, [addExerciseRef]);

    const handleClose = useCallback(() => {
        addExerciseRef.current?.close();
    }, [addExerciseRef]);

    const handleUpdateMetaData = useCallback(
        (exercise: ExerciseMetaData) => {
            if (selectedTraining === undefined) {
                return;
            }
            const newExercises = [...(selectedTraining?.exercises ?? [])];
            newExercises.splice(exerciseIndex, 1, exercise);
            dispatch(editWorkout({ name: selectedTraining?.name ?? "", exercises: newExercises, color: selectedTraining.calendarColor }));
            handleClose();
        },
        [selectedTraining, exerciseIndex, dispatch, handleClose],
    );

    if (!exerciseMetaData) {
        return null;
    }

    return (
        <>
            <HStack style={styles.wrapper}>
                <VStack>
                    <Text style={trainStyles.exerciseName}>{exerciseMetaData?.name}</Text>
                    <SmallMetadataDisplay exerciseMetaData={exerciseMetaData} />
                </VStack>
                <Pressable onPress={handleShowModal} style={styles.pressable}>
                    <ThemedMaterialCommunityIcons name="pencil" size={30} />
                </Pressable>
            </HStack>
            <AddExerciseModal
                editedExercise={exerciseMetaData}
                isEditingExercise={true}
                reference={addExerciseRef}
                onConfirmEdit={handleUpdateMetaData}
                onRequestClose={handleClose}
            />
        </>
    );
};
