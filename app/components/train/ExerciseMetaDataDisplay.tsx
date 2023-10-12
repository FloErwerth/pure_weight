import { trainStyles } from "../../trainStyles";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getExerciseIndex, getExerciseMetaDataRaw, getSelectedTrainingDay, getTrainingIndex } from "../../../store/selectors";
import { Pressable } from "react-native";
import { Dispatch, SetStateAction, useCallback } from "react";
import { EditableExercise } from "../../../components/EditableExercise/EditableExercise";
import { editTrainingDay } from "../../../store/reducer";
import { ExerciseMetaData } from "../../../store/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HStack } from "../../../components/HStack/HStack";
import { VStack } from "../../../components/VStack/VStack";
import { Text } from "../../../components/Text/Text";
import { mainColor, textFieldBackgroundColor } from "../../theme/colors";
import { borderRadius } from "../../theme/border";

interface ExerciseMetaDataDisplayProps {
  showEdit: boolean;
  setShowEdit: Dispatch<SetStateAction<boolean>>;
}
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

  return (
    <HStack style={{ justifyContent: "space-between", borderRadius, backgroundColor: textFieldBackgroundColor, padding: 10 }}>
      <VStack style={{ width: showEdit ? "100%" : "auto" }}>
        {showEdit ? (
          <EditableExercise theme={"Inline"} exercise={exerciseMetaData} onConfirmEdit={handleUpdateMetaData} onCancel={() => setShowEdit(false)} />
        ) : (
          <>
            <Text style={trainStyles.exerciseName}>{exerciseMetaData?.name}</Text>
            <HStack>
              <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData?.weight} kg</Text>
              <Text style={trainStyles.exerciseMetaText}>&#x30FB;</Text>
              <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData?.sets} sets</Text>
              <Text style={trainStyles.exerciseMetaText}>&#x30FB;</Text>
              <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData?.reps} reps</Text>
              {exerciseMetaData?.pause && (
                <>
                  <Text style={trainStyles.exerciseMetaText}>&#x30FB;</Text>
                  <Text style={trainStyles.exerciseMetaText}>{exerciseMetaData.pause} min</Text>
                </>
              )}
            </HStack>
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
