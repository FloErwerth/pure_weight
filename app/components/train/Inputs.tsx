import { SetInputRow } from "../../../components/SetInputRow/SetInputRow";
import { PlainExerciseData } from "../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getExerciseMetaDataRaw, getNumberOfSets, getSelectedTrainingName, getSetIndex } from "../../../store/selectors";
import { useCallback, useEffect, useState } from "react";
import { setSetIndex } from "../../../store/reducer";
import { TrainingHeader } from "./TrainingHeader";
import { ThemedView } from "../../../components/View/View";
import { View } from "react-native";
import { borderRadius } from "../../theme/border";
import { textFieldBackgroundColor } from "../../theme/colors";

interface InputsProps {
  onDoneExercise: (data: PlainExerciseData[]) => void;
  onSetDone: (data: PlainExerciseData, index: number) => void;
}

export const Inputs = ({ onDoneExercise, onSetDone }: InputsProps) => {
  const currentSetIndex = useAppSelector(getSetIndex);
  const selectedTrainingName = useAppSelector(getSelectedTrainingName);
  const exerciseMetaData = useAppSelector(getExerciseMetaDataRaw);
  const numberOfSets = useAppSelector(getNumberOfSets);
  const [sets, setSets] = useState(Array(numberOfSets).fill({ weight: exerciseMetaData.weight, reps: exerciseMetaData.reps, note: "" }));
  const dispatch = useAppDispatch();

  const handleSetDone = useCallback(
    ({ weight, reps, note }: PlainExerciseData, setIndex: number) => {
      if (setIndex !== undefined) {
        const newSets = [...sets];
        newSets.splice(setIndex, 1, { weight, reps, note });
        onSetDone({ weight, reps, note }, setIndex);
        setSets(newSets);
        dispatch(setSetIndex(currentSetIndex + 1));
      }
      if (currentSetIndex === numberOfSets - 1) {
        onDoneExercise(sets);
      }
    },
    [currentSetIndex, dispatch, numberOfSets, onDoneExercise, onSetDone, sets],
  );

  useEffect(() => {
    dispatch(setSetIndex(0));
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      <ThemedView style={{ paddingTop: 15, paddingBottom: 10, alignSelf: "stretch", borderRadius, backgroundColor: textFieldBackgroundColor }}>
        <TrainingHeader />
        {sets.map((exerciseMetaData, index) => (
          <SetInputRow
            onSetDone={(plainExerciseData) => handleSetDone(plainExerciseData, index)}
            setIndex={index + 1}
            isActiveSet={index === currentSetIndex}
            key={`${index}-${selectedTrainingName}`}
            metaData={exerciseMetaData}
          />
        ))}
      </ThemedView>
    </View>
  );
};
