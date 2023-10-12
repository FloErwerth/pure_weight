import { SetInputRow } from "../../../components/SetInputRow/SetInputRow";
import { ExerciseSets, PlainExerciseData } from "../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getExerciseMetaDataRaw, getNumberOfSets, getSelectedTrainingName, getSetIndex } from "../../../store/selectors";
import { useCallback, useMemo } from "react";
import { setSetIndex } from "../../../store/reducer";
import { TrainingHeader } from "./TrainingHeader";
import { ThemedView } from "../../../components/View/View";
import { View } from "react-native";
import { borderRadius } from "../../theme/border";
import { textFieldBackgroundColor } from "../../theme/colors";

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
    <View style={{ flex: 1 }}>
      <ThemedView style={{ paddingTop: 15, paddingBottom: 10, alignSelf: "stretch", borderRadius, backgroundColor: textFieldBackgroundColor }}>
        <TrainingHeader />
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
      </ThemedView>
    </View>
  );
};
