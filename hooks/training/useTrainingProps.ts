import { useAppSelector } from "../../store";
import { getExerciseIndex, getExerciseMetaDataRaw, getExerciseNames, getSelectedTrainingName, getSetIndex } from "../../store/selectors";
import { useMemo } from "react";

export const useTrainingProps = () => {
  const currentExerciseIndex = useAppSelector(getExerciseIndex);
  const currentSetIndex = useAppSelector(getSetIndex);
  const exerciseMetaData = useAppSelector(getExerciseMetaDataRaw);
  const selectedTrainingName = useAppSelector(getSelectedTrainingName);
  const mappedExerciseNames = useAppSelector(getExerciseNames);
  const extractedNumberOfSets = exerciseMetaData?.sets;
  const showPreviousExercise = useMemo(() => currentExerciseIndex > 0, [currentExerciseIndex]);
  const hasNextExercise = useMemo(() => currentExerciseIndex + 1 < (mappedExerciseNames?.length ?? -1), [currentExerciseIndex, mappedExerciseNames?.length]);
  const previousExerciseName = useMemo(() => mappedExerciseNames?.[currentExerciseIndex - 1], [currentExerciseIndex, mappedExerciseNames]);
  const nextExerciseName = useMemo(() => mappedExerciseNames?.[currentExerciseIndex + 1], [currentExerciseIndex, mappedExerciseNames]);

  return useMemo(
    () => ({
      showPreviousExercise,
      hasNextExercise,
      currentExerciseIndex,
      currentSetIndex,
      exerciseMetaData,
      selectedTrainingName,
      extractedNumberOfSets,
      nextExerciseName,
      previousExerciseName,
    }),
    [currentExerciseIndex, currentSetIndex, exerciseMetaData, extractedNumberOfSets, hasNextExercise, nextExerciseName, previousExerciseName, selectedTrainingName, showPreviousExercise],
  );
};
