import { useAppDispatch } from "../store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { trainStyles } from "./trainStyles";
import { DoneExerciseData, PlainExerciseData } from "../store/types";
import { addExerciseDataEntry, setExerciseIndex, setSelectedDay, setSetIndex } from "../store/reducer";
import { AlertModal } from "../components/AlertModal/AlertModal";
import { useTrainingProps } from "../hooks/training/useTrainingProps";
import { useNavigate } from "../utils/navigate";
import { Routes } from "../types/routes";
import { SiteNavigationButtons } from "../components/SiteNavigationButtons/SiteNavigationButtons";
import { ExerciseMetaDataDisplay } from "./components/train/ExerciseMetaDataDisplay";
import { TrainingHeader } from "./components/train/TrainingHeader";
import { LayoutAnimation, Pressable, Text, View } from "react-native";
import { Inputs } from "./components/train/Inputs";

function Train() {
  const { showPreviousExercise, hasNextExercise, previousExerciseName, nextExerciseName, exerciseMetaData, currentExerciseIndex, currentSetIndex, selectedTrainingName, extractedNumberOfSets } =
    useTrainingProps();
  const [doneSetsThisExercise, setDoneSetsThisExercise] = useState<DoneExerciseData>({});
  const [showModal, setShowAlert] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const previousDoneExercisesThisSession = useMemo(() => {
    if (exerciseMetaData?.name) {
      return Object.values(doneSetsThisExercise).map((exercise) => exercise);
    }
    return undefined;
  }, [doneSetsThisExercise, exerciseMetaData?.name]);

  const isDone = useMemo(() => {
    const numberOfSets = Object.values(doneSetsThisExercise).length;
    return parseInt(extractedNumberOfSets ?? "-1") === numberOfSets;
  }, [doneSetsThisExercise, extractedNumberOfSets]);
  const handleSetDone = useCallback(
    ({ weight, reps, note }: PlainExerciseData, setIndex?: number) => {
      if (setIndex) {
        const newDoneExercises = { ...doneSetsThisExercise };
        newDoneExercises[setIndex] = { weight, reps, note };
        setDoneSetsThisExercise(newDoneExercises);
      } else {
        const newDoneExercises: DoneExerciseData = {
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
    if (Object.values(doneSetsThisExercise).length > 0) {
      dispatch(addExerciseDataEntry(doneSetsThisExercise));
    }
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
      } else {
        dispatch(addExerciseDataEntry(doneSetsThisExercise));
        return;
      }
    } else {
      handleNavigateToNextExercise();
    }
  }, [hasNextExercise, doneSetsThisExercise, isDone, dispatch, handleNavigateToNextExercise]);

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
        <TrainingHeader disabled={showEdit} />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <Inputs doneSetsThisExercise={doneSetsThisExercise} handleSetDone={handleSetDone} />
        </KeyboardAwareScrollView>
        <View style={trainStyles.buttons}>
          <View style={{ flex: 1 }}>
            {showPreviousExercise && (
              <Pressable disabled={showEdit} onPress={handlePreviousExercise}>
                <Text disabled={showEdit}>{previousExerciseName}</Text>
              </Pressable>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Pressable disabled={showEdit} onPress={handleNextOrDone}>
              <Text>{hasNextExercise ? nextExerciseName : "Done"}</Text>
            </Pressable>
          </View>
        </View>
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

export default Train;
