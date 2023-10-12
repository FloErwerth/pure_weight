import { useAppDispatch, useAppSelector } from "../store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { trainStyles } from "./trainStyles";
import { ExerciseSets, PlainExerciseData } from "../store/types";
import { addExerciseDataEntry, setExerciseIndex, setSelectedDay, setSetIndex } from "../store/reducer";
import { AlertModal } from "../components/AlertModal/AlertModal";
import { useTrainingProps } from "../hooks/training/useTrainingProps";
import { useNavigate } from "../utils/navigate";
import { Routes } from "../types/routes";
import { SiteNavigationButtons } from "../components/SiteNavigationButtons/SiteNavigationButtons";
import { ExerciseMetaDataDisplay } from "./components/train/ExerciseMetaDataDisplay";
import { LayoutAnimation, View } from "react-native";
import { Inputs } from "./components/train/Inputs";
import { Button } from "../components/Button/Button";
import { HStack } from "../components/HStack/HStack";
import { getNumberOfSets } from "../store/selectors";
import { SafeAreaView } from "../components/SafeAreaView/SafeAreaView";
import { textFieldBackgroundColor } from "./theme/colors";

export default function Train() {
  const { showPreviousExercise, hasNextExercise, previousExerciseName, nextExerciseName, currentExerciseIndex, currentSetIndex, selectedTrainingName } = useTrainingProps();
  const [doneSetsThisExercise, setDoneSetsThisExercise] = useState<ExerciseSets>({});
  const [showModal, setShowAlert] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const numberOfSets = useAppSelector(getNumberOfSets);

  const isDone = useMemo(() => {
    return numberOfSets === Object.values(doneSetsThisExercise).length;
  }, [doneSetsThisExercise, numberOfSets]);

  const handleSetDone = useCallback(
    ({ weight, reps, note }: PlainExerciseData, setIndex?: number) => {
      if (setIndex) {
        const newDoneExercises = { ...doneSetsThisExercise };
        newDoneExercises[setIndex] = { weight, reps, note };
        setDoneSetsThisExercise(newDoneExercises);
      } else {
        const newDoneExercises: ExerciseSets = {
          ...doneSetsThisExercise,
          [currentSetIndex]: {
            weight,
            reps,
            note,
          },
        };
        setDoneSetsThisExercise({ ...newDoneExercises });
      }
      dispatch(setSetIndex(currentSetIndex + 1));
    },
    [currentSetIndex, dispatch, doneSetsThisExercise],
  );

  const handlePreviousExercise = useCallback(() => {
    dispatch(setExerciseIndex(currentExerciseIndex - 1));
  }, [dispatch, currentExerciseIndex]);

  const handleSaveTrainingData = useCallback(() => {
    dispatch(addExerciseDataEntry(doneSetsThisExercise));
  }, [dispatch, doneSetsThisExercise]);

  const handleReset = useCallback(() => {
    dispatch(setExerciseIndex(0));
    dispatch(setSelectedDay(undefined));
    dispatch(setSetIndex(0));
    setDoneSetsThisExercise({});
    navigate(Routes.HOME);
  }, [dispatch, navigate]);

  const handleDone = useCallback(() => {
    handleSaveTrainingData();
    handleReset();
  }, [handleReset, handleSaveTrainingData]);

  const handleCloseAlert = useCallback(() => setShowAlert(false), []);

  const handleNotDoneConfirm = useCallback(() => {
    setShowAlert(false);
    handleDone();
  }, [handleDone]);

  const handleNavigateToNextExercise = useCallback(() => {
    handleSaveTrainingData();
    setDoneSetsThisExercise({});
    dispatch(setExerciseIndex(currentExerciseIndex + 1));
    dispatch(setSetIndex(0));
    setShowAlert(false);
  }, [currentExerciseIndex, dispatch, handleSaveTrainingData]);

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
    if (!isDone && Object.values(doneSetsThisExercise).length > 0) {
      setShowAlert(true);
    } else {
      handleReset();
    }
  }, [doneSetsThisExercise, handleReset, isDone]);

  useEffect(() => {
    LayoutAnimation.configureNext({ duration: 250, create: { duration: 125, type: "easeInEaseOut", property: "opacity" }, delete: { duration: 125, type: "easeInEaseOut", property: "opacity" } });
  }, [showEdit]);

  return (
    <>
      <SafeAreaView style={trainStyles.wrapper}>
        <View style={trainStyles.header}>
          <SiteNavigationButtons disabled={showEdit} handleBack={handleCloseButton} titleFontSize={30} title={selectedTrainingName} />
        </View>
        <ExerciseMetaDataDisplay showEdit={showEdit} setShowEdit={setShowEdit} />
        <View style={{ flex: 1 }}>{!showEdit && <Inputs doneSetsThisExercise={doneSetsThisExercise} handleSetDone={handleSetDone} />}</View>
        <HStack style={trainStyles.buttons}>
          <View style={{ flex: 1 }}>{showPreviousExercise && <Button title={previousExerciseName} theme="secondary" disabled={showEdit} onPress={handlePreviousExercise} />}</View>
          <Button
            style={{ button: { flex: 1, borderWidth: 0, backgroundColor: textFieldBackgroundColor } }}
            theme="primary"
            title={hasNextExercise ? nextExerciseName : "Done"}
            disabled={showEdit}
            onPress={handleNextOrDone}
          />
        </HStack>
      </SafeAreaView>
      <AlertModal
        title="Your training is not complete"
        content="Are you sure to quit this training early? The progress so far will be saved."
        isVisible={showModal}
        onConfirm={handleNotDoneConfirm}
        onCancel={handleCloseAlert}
      ></AlertModal>
    </>
  );
}
