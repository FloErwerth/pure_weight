import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback, useMemo, useState } from "react";
import { trainStyles } from "../../../components/App/train/trainStyles";
import { ExerciseMetaData, PlainExerciseData } from "../../../store/types";
import { addSetDataToTrainingDay, setExerciseIndex, setSetIndex, setTrainingDayIndex } from "../../../store/reducer";
import { AlertModal } from "../../../components/AlertModal/AlertModal";
import { useTrainingProps } from "../../../hooks/training/useTrainingProps";
import { useNavigate } from "../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { ExerciseMetaDataDisplay } from "../../../components/App/train/ExerciseMetaDataDisplay/ExerciseMetaDataDisplay";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { Inputs } from "../../../components/App/train/Inputs/Inputs";
import { HStack } from "../../../components/HStack/HStack";
import { getNumberOfExercises, getSelectedTrainingDay, getSpecificNumberOfSets } from "../../../store/selectors";
import { PreviousTraining } from "../../../components/PreviousTraining/PreviousTraining";
import { useTranslation } from "react-i18next";
import { AddNoteModal } from "../../../components/AddNoteModal/AddNoteModal";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { StopwatchPopover } from "../../../components/StopwatchPopover/StopwatchPopover";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel/src/Carousel";
import { useTheme } from "../../../theme/context";

export function Train() {
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const numberOfExercises = useAppSelector(getNumberOfExercises);
  const trainingDay = useAppSelector(getSelectedTrainingDay);
  const { currentExerciseIndex, selectedTrainingName } = useTrainingProps();
  const [showModal, setShowAlert] = useState(false);
  const [doneSetsThisExercise, setDoneSetsThisExercise] = useState<PlainExerciseData[][]>(Array(numberOfExercises ?? 0).fill([]));
  const [note, setNote] = useState<string | undefined>(undefined);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const getNumberOfSetsWithIndex = useAppSelector(getSpecificNumberOfSets);
  const { mainColor } = useTheme();

  const isDone = useMemo(() => {
    return doneSetsThisExercise.every((exercise, index) => {
      const numberOfSets = getNumberOfSetsWithIndex(index);
      return numberOfSets === exercise.length;
    });
  }, [doneSetsThisExercise, getNumberOfSetsWithIndex]);

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
  const handleShowEditNoteModal = useCallback(() => setShowEditNoteModal(true), []);
  const handleCloseEditNoteModal = useCallback(() => setShowEditNoteModal(false), []);
  const handleCancelEditNoteModal = useCallback(() => {
    setNote(undefined);
    handleCloseEditNoteModal();
  }, [handleCloseEditNoteModal]);
  const buttonsStyle = useMemo(() => [trainStyles.buttons, { marginBottom: bottom }], [bottom]);
  const showEditNoteModalTitleStyle = useMemo(() => ({ padding: 10, paddingHorizontal: 15, alignSelf: "center" }) as const, []);
  const alertModalConfig = useMemo(() => ({ title: t("alert_quit_title"), content: t("alert_quit_message") }), [t]);

  const mappedExercises = useMemo(() => {
    if (!trainingDay) {
      navigate("workouts");
      return [] as { metaData: ExerciseMetaData }[];
    }
    return trainingDay.exercises.map((exercise) => ({
      metaData: { reps: exercise.reps, weight: exercise.weight, name: exercise.name, sets: exercise.sets, pause: exercise.pause } satisfies ExerciseMetaData,
    }));
  }, [navigate, trainingDay]);

  const renderItem = useCallback(
    ({ item: { metaData }, index }: { item: { metaData: ExerciseMetaData }; index: number }) => {
      return (
        <View key={metaData.name.length * Math.random() * 10} style={trainStyles.carouselWrapper}>
          <HStack style={trainStyles.headerWrapper}>
            <ExerciseMetaDataDisplay exerciseMetaData={metaData} exerciseIndex={index} />
            <ThemedView component style={trainStyles.noteButtonWrapper}>
              <Pressable style={showEditNoteModalTitleStyle} onPress={handleShowEditNoteModal}>
                <MaterialCommunityIcons name="note-edit-outline" color={mainColor} size={30} />
              </Pressable>
            </ThemedView>
          </HStack>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={trainStyles.innerWrapper}>
            <Inputs setData={doneSetsThisExercise[currentExerciseIndex] ?? []} onSetDone={handleSetDone} />
            <PreviousTraining exerciseIndex={index} />
          </ScrollView>
        </View>
      );
    },
    [currentExerciseIndex, doneSetsThisExercise, handleSetDone, handleShowEditNoteModal, showEditNoteModalTitleStyle],
  );

  const handleScrollEnd = useCallback(
    (index: number) => {
      dispatch(setExerciseIndex(index));
    },
    [dispatch],
  );

  return (
    <ThemedView style={trainStyles.wrapper} stretch>
      <ThemedView style={trainStyles.navigationWrapper}>
        <SiteNavigationButtons handleBack={handleCloseButton} titleFontSize={30} title={selectedTrainingName} />
      </ThemedView>
      <View style={{ flex: 1 }}>
        <Carousel
          scrollAnimationDuration={200}
          onSnapToItem={handleScrollEnd}
          width={Dimensions.get("screen").width}
          loop={false}
          vertical={false}
          windowSize={0}
          renderItem={renderItem}
          data={mappedExercises}
        />
      </View>
      <HStack style={buttonsStyle}>
        <StopwatchPopover />
      </HStack>
      {showModal && <AlertModal title={alertModalConfig.title} content={alertModalConfig.content} isVisible={showModal} onConfirm={handleNotDoneConfirm} onCancel={handleCloseAlert}></AlertModal>}
      {showEditNoteModal && <AddNoteModal onConfirm={handleCloseEditNoteModal} setNote={handleCloseEditNoteModal} note={note} onCancel={handleCancelEditNoteModal} showModal={showEditNoteModal} />}
    </ThemedView>
  );
}
