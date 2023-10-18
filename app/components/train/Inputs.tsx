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
import * as Haptics from "expo-haptics";
import { componentBackgroundColor } from "../../theme/colors";

interface InputsProps {
  onSetDone: (data: PlainExerciseData, index: number) => void;
  setData: (PlainExerciseData | undefined)[];
}

const useGeneratedSetData = (setData: (PlainExerciseData | undefined)[]) => {
  const exerciseMetaData = useAppSelector(getExerciseMetaDataRaw);
  const numberOfSets = useAppSelector(getNumberOfSets);

  const [sets, setSets] = useState<(PlainExerciseData | undefined)[]>([]);

  useEffect(() => {
    if (numberOfSets) {
      const prefilledArray = Array(numberOfSets).fill({ weight: exerciseMetaData?.weight, reps: exerciseMetaData?.reps, note: "" });
      setData?.forEach((data, index) => {
        if (setData[index] !== undefined) {
          prefilledArray[index] = data;
        }
      });
      setSets(prefilledArray);
    }
  }, [exerciseMetaData, numberOfSets, setData]);

  return [sets, setSets] as const;
};

export const Inputs = ({ onSetDone, setData }: InputsProps) => {
  const currentSetIndex = useAppSelector(getSetIndex);
  const selectedTrainingName = useAppSelector(getSelectedTrainingName);
  const [sets, setSets] = useGeneratedSetData(setData);
  const dispatch = useAppDispatch();

  const handleSetDone = useCallback(
    ({ weight, reps, note }: PlainExerciseData, setIndex: number) => {
      if (setIndex !== undefined) {
        const newSets = [...sets];
        newSets.splice(setIndex, 1, { weight, reps, note });
        onSetDone({ weight, reps, note }, setIndex);
        setSets(newSets);
        dispatch(setSetIndex(currentSetIndex + 1));
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [currentSetIndex, dispatch, onSetDone, setSets, sets],
  );

  useEffect(() => {
    dispatch(setSetIndex(0));
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      <ThemedView style={{ paddingTop: 15, paddingBottom: 10, alignSelf: "stretch", borderRadius, backgroundColor: componentBackgroundColor }}>
        <TrainingHeader />
        {sets.map((exerciseMetaData, index) => {
          return (
            <SetInputRow
              data={exerciseMetaData}
              hasData={Boolean(setData?.[index])}
              onSetDone={(plainExerciseData) => handleSetDone(plainExerciseData, index)}
              setIndex={index + 1}
              isActiveSet={index === currentSetIndex}
              key={`${index}-${selectedTrainingName}`}
            />
          );
        })}
      </ThemedView>
    </View>
  );
};
