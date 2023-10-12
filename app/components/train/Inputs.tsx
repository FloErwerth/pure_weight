import { SetInputRow } from "../../../components/SetInputRow/SetInputRow";
import { ExerciseSets, PlainExerciseData } from "../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getExerciseMetaDataRaw, getNumberOfSets, getSelectedTrainingName, getSetIndex } from "../../../store/selectors";
import { useCallback, useMemo } from "react";
import { setSetIndex } from "../../../store/reducer";
import { TrainingHeader } from "./TrainingHeader";
import { Center } from "../../../components/Center/Center";
import { View } from "react-native";

interface InputsProps {
  doneSetsThisExercise: ExerciseSets;
  handleSetDone: (data: PlainExerciseData, setIndex?: number) => void;
}

export const Inputs = ({ doneSetsThisExercise, handleSetDone }: InputsProps) => {
  const currentSetIndex = useAppSelector(getSetIndex);
  const selectedTrainingName = useAppSelector(getSelectedTrainingName);
  const exerciseMetaData = useAppSelector(getExerciseMetaDataRaw);
  const doneSets = useMemo(() => Object.values(doneSetsThisExercise), [doneSetsThisExercise]);
  const numberOfSets = useAppSelector(getNumberOfSets);
  const dispatch = useAppDispatch();
  const handleEditDoneSet = useCallback(
    (index: number) => {
      dispatch(setSetIndex(index));
    },
    [dispatch],
  );

  return (
    <Center style={{ flex: 1, justifyContent: "flex-start" }}>
      <View style={{ alignSelf: "stretch", borderColor: "black", borderWidth: 1, borderRadius: 5, paddingTop: 10, paddingBottom: 5 }}>
        <TrainingHeader />
        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: "black", paddingBottom: 5 }}></View>
        <View style={{ paddingTop: 5, paddingBottom: 5 }}>
          {doneSets.map((exerciseMetaData, index) => (
            <SetInputRow
              onSetDone={(plainExerciseData) => handleSetDone(plainExerciseData, index)}
              setIndex={index + 1}
              onEdit={() => handleEditDoneSet(index)}
              edited={index === currentSetIndex}
              key={`${index}-${selectedTrainingName}`}
              metaData={exerciseMetaData}
            />
          ))}
          {numberOfSets - 1 >= doneSets.length && (
            <SetInputRow
              onEdit={() => handleEditDoneSet(doneSets.length)}
              setIndex={doneSets.length + 1}
              metaData={exerciseMetaData}
              edited={currentSetIndex === Object.values(doneSetsThisExercise).length}
              onSetDone={handleSetDone}
            />
          )}
        </View>
      </View>
    </Center>
  );
};
