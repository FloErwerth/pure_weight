import { SetInputRow } from "../../../SetInputRow/SetInputRow";
import { PlainExerciseData } from "../../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getExerciseMetaData, getNumberOfSets, getSelectedTrainingName, getSetIndex } from "../../../../store/selectors";
import { useCallback, useEffect, useState } from "react";
import { setSetIndex } from "../../../../store/reducer";
import { TrainingHeader } from "../TrainingHeader/TrainingHeader";
import { View } from "react-native";
import { borderRadius } from "../../../../theme/border";
import * as Haptics from "expo-haptics";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { useTheme } from "../../../../theme/context";

interface InputsProps {
  onSetDone: (data: PlainExerciseData, index: number) => void;
  setData: (PlainExerciseData | undefined)[];
}

const useGeneratedSetData = (setData: (PlainExerciseData | undefined)[]) => {
  const exerciseMetaData = useAppSelector(getExerciseMetaData);
  const numberOfSets = useAppSelector(getNumberOfSets);
  const [sets, setSets] = useState<Map<number, PlainExerciseData | undefined>>(new Map(setData.entries()));

  useEffect(() => {
    if (numberOfSets) {
      const map = new Map<number, PlainExerciseData | undefined>();
      const prefilledMap = Array(numberOfSets).fill({ weight: exerciseMetaData?.weight, reps: exerciseMetaData?.reps, note: "" });
      prefilledMap.forEach((metaData, index) => {
        if (setData?.[index]) {
          map.set(index, setData[index]);
        } else {
          map.set(index, metaData);
        }
      });
      setSets(map);
    }
  }, [exerciseMetaData, numberOfSets, setData]);

  return [Array.from(sets.values())] as const;
};

export const Inputs = ({ onSetDone, setData }: InputsProps) => {
  const { componentBackgroundColor } = useTheme();
  const currentSetIndex = useAppSelector(getSetIndex);
  const selectedTrainingName = useAppSelector(getSelectedTrainingName);
  const [sets] = useGeneratedSetData(setData);
  const dispatch = useAppDispatch();

  const handleSetDone = useCallback(
    ({ weight, reps }: PlainExerciseData, setIndex: number) => {
      if (setIndex !== undefined) {
        onSetDone({ weight, reps }, setIndex);
        dispatch(setSetIndex(currentSetIndex + 1));
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [currentSetIndex, dispatch, onSetDone],
  );

  useEffect(() => {
    dispatch(setSetIndex(0));
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      <ThemedView style={{ paddingTop: 15, paddingBottom: 10, alignSelf: "stretch", borderRadius, backgroundColor: componentBackgroundColor }}>
        <TrainingHeader />
        {sets?.map((exerciseMetaData, index) => {
          return (
            <SetInputRow
              data={exerciseMetaData}
              isEditable={setData?.[index - 1] !== undefined || index === 0}
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