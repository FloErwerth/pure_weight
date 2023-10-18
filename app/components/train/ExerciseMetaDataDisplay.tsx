import { trainStyles } from "../../train/trainStyles";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getExerciseIndex, getExerciseMetaDataRaw, getSelectedTrainingDay, getTrainingIndex } from "../../../store/selectors";
import { Pressable, TextStyle } from "react-native";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from "react";
import { EditableExercise } from "../../../components/EditableExercise/EditableExercise";
import { editTrainingDay } from "../../../store/reducer";
import { ExerciseMetaData } from "../../../store/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HStack } from "../../../components/HStack/HStack";
import { VStack } from "../../../components/VStack/VStack";
import { Text } from "../../../components/Text/Text";
import { componentBackgroundColor, mainColor } from "../../theme/colors";
import { borderRadius } from "../../theme/border";
import * as Haptics from "expo-haptics";

interface ExerciseMetaDataDisplayProps {
  showEdit: boolean;
  setShowEdit: Dispatch<SetStateAction<boolean>>;
}

interface SmallMetadataDisplayProps {
  style?: TextStyle;
}
export const SmallMetadataDisplay = ({ style }: SmallMetadataDisplayProps) => {
  const exerciseMetaData = useAppSelector(getExerciseMetaDataRaw);
  const textStyle = useMemo(() => [trainStyles.exerciseMetaText, style], [style]);
  return (
    <HStack>
      <Text style={textStyle}>{exerciseMetaData?.weight} kg</Text>
      <Text style={textStyle}>&#x30FB;</Text>
      <Text style={textStyle}>{exerciseMetaData?.sets} sets</Text>
      <Text style={textStyle}>&#x30FB;</Text>
      <Text style={textStyle}>{exerciseMetaData?.reps} reps</Text>
      {exerciseMetaData?.pause && (
        <>
          <Text style={textStyle}>&#x30FB;</Text>
          <Text style={textStyle}>{exerciseMetaData.pause} min</Text>
        </>
      )}
    </HStack>
  );
};

export const ExerciseMetaDataDisplay = ({ showEdit, setShowEdit }: ExerciseMetaDataDisplayProps) => {
  const exerciseMetaData = useAppSelector(getExerciseMetaDataRaw);
  const currentExerciseIndex = useAppSelector(getExerciseIndex);
  const trainingDayIndex = useAppSelector(getTrainingIndex);
  const selectedTraining = useAppSelector(getSelectedTrainingDay);
  const dispatch = useAppDispatch();

  const handleUpdateMetaData = useCallback(
    (exercise: ExerciseMetaData) => {
      if (trainingDayIndex === undefined) {
        return;
      }
      const newExercises = [...(selectedTraining?.exercises ?? [])];
      newExercises.splice(currentExerciseIndex, 1, { ...exercise, doneExerciseEntries: selectedTraining?.exercises[currentExerciseIndex].doneExerciseEntries ?? {} });
      dispatch(editTrainingDay({ index: trainingDayIndex, trainingDay: { name: selectedTraining?.name ?? "", exercises: newExercises } }));
      setShowEdit(false);
    },
    [currentExerciseIndex, dispatch, selectedTraining?.exercises, selectedTraining?.name, setShowEdit, trainingDayIndex],
  );

  useEffect(() => {
    if (showEdit) {
      void Haptics.selectionAsync();
    }
  }, [showEdit]);

  return (
    <HStack style={{ justifyContent: "space-between", borderRadius, backgroundColor: componentBackgroundColor, padding: 10 }}>
      <VStack style={{ width: showEdit ? "100%" : "auto" }}>
        {showEdit ? (
          <EditableExercise theme={"Inline"} exercise={exerciseMetaData} onConfirmEdit={handleUpdateMetaData} onCancel={() => setShowEdit(false)} />
        ) : (
          <>
            <Text style={trainStyles.exerciseName}>{exerciseMetaData?.name}</Text>
            <SmallMetadataDisplay />
          </>
        )}
      </VStack>
      {!showEdit && (
        <Pressable onPress={() => setShowEdit(true)} style={{ width: 50, alignItems: "center", justifyContent: "center" }}>
          <MaterialCommunityIcons name="pencil" color={mainColor} size={20} />
        </Pressable>
      )}
    </HStack>
  );
};
