import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback, useMemo, useState } from "react";
import { trainStyles } from "../../../components/App/train/trainStyles";
import { PlainExerciseData } from "../../../store/types";
import { addSetDataToTrainingDay, setExerciseIndex, setSetIndex, setTrainingDayIndex } from "../../../store/reducer";
import { AlertModal } from "../../../components/AlertModal/AlertModal";
import { useTrainingProps } from "../../../hooks/training/useTrainingProps";
import { useNavigate } from "../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { ExerciseMetaDataDisplay } from "../../../components/App/train/ExerciseMetaDataDisplay/ExerciseMetaDataDisplay";
import { ScrollView, View } from "react-native";
import { Inputs } from "../../../components/App/train/Inputs/Inputs";
import { Button } from "../../../components/Themed/Button/Button";
import { HStack } from "../../../components/HStack/HStack";
import { getNumberOfExercises, getSpecificNumberOfSets } from "../../../store/selectors";
import { PreviousTraining } from "../../../components/PreviousTraining/PreviousTraining";
import { useTranslation } from "react-i18next";
import { AddNoteModal } from "../../../components/AddNoteModal/AddNoteModal";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { useTheme } from "../../../theme/context";
import { StopwatchModal } from "../../../components/StopwatchModal/StopwatchModal";

export function Train() {
  const { mainColor } = useTheme();

  const { t } = useTranslation();
  const numberOfExercises = useAppSelector(getNumberOfExercises);
  const { showPreviousExercise, hasNextExercise, previousExerciseName, nextExerciseName, currentExerciseIndex, selectedTrainingName } = useTrainingProps();
  const [showModal, setShowAlert] = useState(false);
  const [doneSetsThisExercise, setDoneSetsThisExercise] = useState<PlainExerciseData[][]>(Array(numberOfExercises ?? 0).fill([]));
  const [note, setNote] = useState<string | undefined>(undefined);
  const [showEdit, setShowEdit] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const getNumberOfSetsWithIndex = useAppSelector(getSpecificNumberOfSets);
  const [showTimerModal, setShowTimerModal] = useState(false);

  const isDone = useMemo(() => {
    return doneSetsThisExercise.every((exercise, index) => {
      const numberOfSets = getNumberOfSetsWithIndex(index);
      return numberOfSets === exercise.length;
    });
  }, [doneSetsThisExercise, getNumberOfSetsWithIndex]);

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
    dispatch(setTrainingDayIndex(undefined));
    dispatch(setSetIndex(0));
    setDoneSetsThisExercise([]);
    navigate("workouts");
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
      const newData = Array.from(doneSetsThisExercise.map((exercise) => Array.from(exercise)));
      newData[currentExerciseIndex][setIndex] = data;
      setDoneSetsThisExercise(newData);
    },
    [currentExerciseIndex, doneSetsThisExercise, setDoneSetsThisExercise],
  );

  const showTimer = useCallback(() => {
    setShowTimerModal(true);
  }, []);
  const hideTimer = useCallback(() => {
    setShowTimerModal(false);
  }, []);
  const handleShowEditNoteModal = useCallback(() => setShowEditNoteModal(true), []);
  const handleCloseEditNoteModal = useCallback(() => setShowEditNoteModal(false), []);
  const handleCancelEditNoteModal = useCallback(() => {
    setNote(undefined);
    handleCloseEditNoteModal();
  }, [handleCloseEditNoteModal]);
  const showEditNoteModalTitleStyle = useMemo(() => ({ button: { alignSelf: "stretch" }, text: { textAlign: "center", flex: 1, fontSize: 16, color: mainColor } }) as const, [mainColor]);
  const noteButtonTitle = useMemo(() => t(note ? "show_note_title" : "edit_note_title"), [note, t]);
  const alertModalConfig = useMemo(() => ({ title: t("alert_quit_title"), content: t("alert_quit_message") }), [t]);
  return (
    <ThemedView stretch>
      <ThemedView style={trainStyles.header}>
        <SiteNavigationButtons disabled={showEdit} handleBack={handleCloseButton} titleFontSize={30} title={selectedTrainingName} />
      </ThemedView>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={trainStyles.innerWrapper}>
        <ExerciseMetaDataDisplay showEdit={showEdit} setShowEdit={setShowEdit} />
        <View style={trainStyles.noteButtonWrapper}>
          <Button onPress={handleShowEditNoteModal} theme="ghost" style={showEditNoteModalTitleStyle} title={noteButtonTitle} />
        </View>
        <ThemedView stretch>{!showEdit && <Inputs setData={doneSetsThisExercise[currentExerciseIndex] ?? []} onSetDone={handleSetDone} />}</ThemedView>
        {!showEdit && <PreviousTraining />}
        {showModal && <AlertModal title={alertModalConfig.title} content={alertModalConfig.content} isVisible={showModal} onConfirm={handleNotDoneConfirm} onCancel={handleCloseAlert}></AlertModal>}
      </ScrollView>
      <Button title="Timer" onPress={showTimer} />
      {showTimerModal && <StopwatchModal onRequestClose={hideTimer} isVisible={true} />}
      <HStack style={trainStyles.singleButton}>
        <ThemedView stretch>{showPreviousExercise && <Button title={previousExerciseName} disabled={showEdit} onPress={handlePreviousExercise} />}</ThemedView>
        <Button theme="primary" title={hasNextExercise ? nextExerciseName : t("training_done")} disabled={showEdit} onPress={handleNextOrDone} />
      </HStack>
      {showEditNoteModal && <AddNoteModal onConfirm={handleCloseEditNoteModal} setNote={handleCloseEditNoteModal} note={note} onCancel={handleCancelEditNoteModal} showModal={showEditNoteModal} />}
    </ThemedView>
  );
}
