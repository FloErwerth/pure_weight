import { useAppDispatch, useAppSelector } from "../../store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { trainStyles } from "./trainStyles";
import { PlainExerciseData } from "../../store/types";
import { addSetDataToTrainingDay, setExerciseIndex, setSelectedDay, setSetIndex } from "../../store/reducer";
import { AlertModal } from "../../components/AlertModal/AlertModal";
import { useTrainingProps } from "../../hooks/training/useTrainingProps";
import { useNavigate } from "../../utils/navigate";
import { Routes } from "../../types/routes";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { ExerciseMetaDataDisplay } from "../components/train/ExerciseMetaDataDisplay";
import { ScrollView, View } from "react-native";
import { Inputs } from "../components/train/Inputs";
import { Button } from "../../components/Button/Button";
import { HStack } from "../../components/HStack/HStack";
import { getNumberOfSets, getSelectedTrainingDay } from "../../store/selectors";
import { SafeAreaView } from "../../components/SafeAreaView/SafeAreaView";
import { PreviousTraining } from "../../components/PreviousTraining/PreviousTraining";

const useInitialExerciseDataState = () => {
  const trainingDay = useAppSelector(getSelectedTrainingDay);

  const [doneSetsThisExercise, setDoneSetsThisExercise] = useState<Array<(PlainExerciseData | undefined)[]>>(
    trainingDay?.exercises.map((exercise) => Array(parseInt(exercise.sets)).fill(undefined)) ?? [],
  );

  const getFilledArray = useCallback(() => {
    return (
      trainingDay?.exercises.map((exercise, exerciseIndex) =>
        Array(parseInt(exercise.sets))
          .fill(undefined)
          .map((_, setIndex) => {
            if (doneSetsThisExercise[exerciseIndex][setIndex]) {
              return doneSetsThisExercise[exerciseIndex][setIndex];
            } else return undefined;
          }),
      ) ?? []
    );
  }, [doneSetsThisExercise, trainingDay?.exercises]);

  useEffect(() => {
    if (trainingDay) {
      setDoneSetsThisExercise(getFilledArray());
    }
  }, [trainingDay]);

  return [doneSetsThisExercise, setDoneSetsThisExercise] as const;
};

export default function Index() {
  const { showPreviousExercise, hasNextExercise, previousExerciseName, nextExerciseName, currentExerciseIndex, selectedTrainingName } = useTrainingProps();
  const [showModal, setShowAlert] = useState(false);
  const [doneSetsThisExercise, setDoneSetsThisExercise] = useInitialExerciseDataState();
  const [showEdit, setShowEdit] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const numberOfSets = useAppSelector(getNumberOfSets);

  const isDone = useMemo(() => {
    //TODO: check if all exercises are done and make a warning if any is not done (with name of the exercise)
    return numberOfSets === Object.values(doneSetsThisExercise).length;
  }, [doneSetsThisExercise, numberOfSets]);

  const handlePreviousExercise = useCallback(() => {
    dispatch(setExerciseIndex(currentExerciseIndex - 1));
  }, [dispatch, currentExerciseIndex]);

  const handleSaveTrainingData = useCallback(() => {
    dispatch(addSetDataToTrainingDay(doneSetsThisExercise));
  }, [dispatch, doneSetsThisExercise]);

  const handleSavePartialData = useCallback(() => {
    const partialData = [...doneSetsThisExercise].map((set) => set.filter((entry) => entry !== undefined));
    dispatch(addSetDataToTrainingDay(partialData.filter((set) => set.length !== 0)));
  }, [dispatch, doneSetsThisExercise]);

  const handleReset = useCallback(() => {
    dispatch(setExerciseIndex(0));
    dispatch(setSelectedDay(undefined));
    dispatch(setSetIndex(0));
    setDoneSetsThisExercise([]);
    navigate(Routes.HOME);
  }, [dispatch, navigate, setDoneSetsThisExercise]);

  const handleDone = useCallback(() => {
    handleSaveTrainingData();
    handleReset();
  }, [handleReset, handleSaveTrainingData]);

  const handleCloseAlert = useCallback(() => setShowAlert(false), []);

  const handleNotDoneConfirm = useCallback(() => {
    setShowAlert(false);
    handleSavePartialData();
    handleReset();
  }, [handleReset, handleSavePartialData]);

  const handleNavigateToNextExercise = useCallback(() => {
    dispatch(setExerciseIndex(currentExerciseIndex + 1));
    dispatch(setSetIndex(0));
    setShowAlert(false);
  }, [currentExerciseIndex, dispatch]);

  const handleNextOrDone = useCallback(() => {
    if (!hasNextExercise) {
      if (!isDone) {
        setShowAlert(true);
        return;
      }
      handleDone();
    } else {
      handleNavigateToNextExercise();
    }
  }, [hasNextExercise, isDone, handleDone, handleNavigateToNextExercise]);

  const handleCloseButton = useCallback(() => {
    if (!isDone) {
      setShowAlert(true);
    } else {
      handleSaveTrainingData();
      handleReset();
    }
  }, [handleReset, handleSaveTrainingData, isDone]);

  const handleSetDone = useCallback(
    (data: PlainExerciseData, setIndex: number) => {
      doneSetsThisExercise[currentExerciseIndex][setIndex] = data;
      setDoneSetsThisExercise(doneSetsThisExercise);
    },
    [currentExerciseIndex, doneSetsThisExercise, setDoneSetsThisExercise],
  );

  return (
    <SafeAreaView>
      <View style={trainStyles.header}>
        <SiteNavigationButtons disabled={showEdit} handleBack={handleCloseButton} titleFontSize={30} title={selectedTrainingName} />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={trainStyles.wrapper}>
        <ExerciseMetaDataDisplay showEdit={showEdit} setShowEdit={setShowEdit} />
        <View style={{ flex: 1 }}>{!showEdit && <Inputs setData={doneSetsThisExercise[currentExerciseIndex]} onSetDone={handleSetDone} />}</View>
        {!showEdit && <PreviousTraining />}
        <AlertModal title="Quit training early?" content="The progress so far will be saved." isVisible={showModal} onConfirm={handleNotDoneConfirm} onCancel={handleCloseAlert}></AlertModal>
      </ScrollView>
      <HStack style={trainStyles.buttons}>
        <View style={{ flex: 1 }}>{showPreviousExercise && <Button title={previousExerciseName} theme="secondary" disabled={showEdit} onPress={handlePreviousExercise} />}</View>
        <Button style={{ button: { flex: 1, borderWidth: 0 } }} theme="primary" title={hasNextExercise ? nextExerciseName : "Done"} disabled={showEdit} onPress={handleNextOrDone} />
      </HStack>
    </SafeAreaView>
  );
}
