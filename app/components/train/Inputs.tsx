import { SetInputRow } from "../../../components/SetInputRow/SetInputRow";
import { DoneExerciseData, PlainExerciseData } from "../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getExerciseMetaDataRaw, getSelectedTrainingName, getSetIndex } from "../../../store/selectors";
import { useCallback, useMemo } from "react";
import { setSetIndex } from "../../../store/reducer";
import { View } from "react-native";

interface InputsProps {
  doneSetsThisExercise: DoneExerciseData;
  handleSetDone: (data: PlainExerciseData, setIndex?: number) => void;
}
export const Inputs = ({ doneSetsThisExercise, handleSetDone }: InputsProps) => {
  const currentSetIndex = useAppSelector(getSetIndex);
  const selectedTrainingName = useAppSelector(getSelectedTrainingName);
  const exerciseMetaData = useAppSelector(getExerciseMetaDataRaw);
  const doneSets = useMemo(() => Object.values(doneSetsThisExercise), [doneSetsThisExercise]);
  const dispatch = useAppDispatch();
  const handleEditDoneSet = useCallback(
    (index: number) => {
      dispatch(setSetIndex(index));
    },
    [dispatch],
  );

  return (
    <View>
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
      <SetInputRow
        onEdit={() => handleEditDoneSet(doneSets.length)}
        setIndex={doneSets.length + 1}
        metaData={exerciseMetaData}
        edited={currentSetIndex === Object.values(doneSetsThisExercise).length}
        onSetDone={handleSetDone}
      />
    </View>
  );
};
