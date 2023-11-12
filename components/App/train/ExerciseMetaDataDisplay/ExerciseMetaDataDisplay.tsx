import { trainStyles } from "../trainStyles";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getSelectedTrainingDay, getTrainingIndex } from "../../../../store/selectors";
import { Pressable, TextStyle } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { editTrainingDay } from "../../../../store/reducer";
import { ExerciseMetaData } from "../../../../store/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HStack } from "../../../HStack/HStack";
import { VStack } from "../../../VStack/VStack";
import { Text } from "../../../Themed/ThemedText/Text";
import { borderRadius } from "../../../../theme/border";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { AddExerciseModal } from "../../../AddExerciseModal/AddExerciseModal";
import { useTheme } from "../../../../theme/context";

interface ExerciseMetaDataDisplayProps {
  exerciseIndex: number;
  exerciseMetaData: ExerciseMetaData;
}

interface SmallMetadataDisplayProps {
  exerciseMetaData: ExerciseMetaData;
  style?: TextStyle;
}
export const SmallMetadataDisplay = ({ style, exerciseMetaData }: SmallMetadataDisplayProps) => {
  const { t } = useTranslation();
  const textStyle = useMemo(() => [trainStyles.exerciseMetaText, style], [style]);

  const isSingle = useMemo(() => parseFloat(exerciseMetaData.sets) === 1, [exerciseMetaData.sets]);

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
};

export const ExerciseMetaDataDisplay = ({ exerciseIndex, exerciseMetaData }: ExerciseMetaDataDisplayProps) => {
  const { mainColor, componentBackgroundColor } = useTheme();
  const [showEdit, setShowEdit] = useState(false);
  const trainingDayIndex = useAppSelector(getTrainingIndex);
  const selectedTraining = useAppSelector(getSelectedTrainingDay);
  const dispatch = useAppDispatch();

  const handleUpdateMetaData = useCallback(
    (exercise: ExerciseMetaData) => {
      if (trainingDayIndex === undefined) {
        return;
      }
      const newExercises = [...(selectedTraining?.exercises ?? [])];
      newExercises.splice(exerciseIndex, 1, { ...exercise, doneExerciseEntries: selectedTraining?.exercises[exerciseIndex].doneExerciseEntries ?? [] });
      dispatch(editTrainingDay({ index: trainingDayIndex, trainingDay: { name: selectedTraining?.name ?? "", exercises: newExercises } }));
      setShowEdit(false);
    },
    [exerciseIndex, dispatch, selectedTraining?.exercises, selectedTraining?.name, setShowEdit, trainingDayIndex],
  );

  useEffect(() => {
    if (showEdit) {
      void Haptics.selectionAsync();
    }
  }, [showEdit]);

  return (
    <>
      <HStack style={{ justifyContent: "space-between", borderRadius, backgroundColor: componentBackgroundColor, padding: 10, flex: 1 }}>
        <VStack>
          <Text style={trainStyles.exerciseName}>{exerciseMetaData?.name}</Text>
          <SmallMetadataDisplay exerciseMetaData={exerciseMetaData} />
        </VStack>
        <Pressable onPress={() => setShowEdit(true)} style={{ width: 50, alignItems: "center", justifyContent: "center" }}>
          <MaterialCommunityIcons name="pencil" color={mainColor} size={30} />
        </Pressable>
      </HStack>
      <AddExerciseModal onConfirmEdit={handleUpdateMetaData} exercise={exerciseMetaData} onRequestClose={() => setShowEdit(false)} />
    </>
  );
};
