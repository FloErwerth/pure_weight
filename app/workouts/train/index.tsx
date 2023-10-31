import { useAppDispatch, useAppSelector } from "../../../store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trainStyles } from "../../../components/App/train/trainStyles";
import { ExerciseMetaData, PlainExerciseData } from "../../../store/types";
import { addSetDataToTrainingDay, setExerciseIndex, setSetIndex, setTrainingDayIndex } from "../../../store/reducer";
import { AlertModal } from "../../../components/AlertModal/AlertModal";
import { useNavigate } from "../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { Animated, Dimensions } from "react-native";
import { HStack } from "../../../components/HStack/HStack";
import { getSelectedTrainingDay, getSpecificNumberOfSets } from "../../../store/selectors";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { StopwatchPopover } from "../../../components/StopwatchPopover/StopwatchPopover";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel/src/Carousel";
import { Exercise } from "../../../components/App/train/Exercise/Exercise";

type DoneExercises = Map<number, { note?: string; sets: Map<number, PlainExerciseData> }>;
function mapOfMapsTo2DArray(map: DoneExercises) {
  const result: Array<{ note?: string; sets: Array<PlainExerciseData> }> = [];
  map.forEach((innerMap, key) => {
    result[key] = { note: innerMap.note, sets: [...innerMap.sets.values()] };
  });
  return result;
}

export function Train() {
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const trainingDay = useAppSelector(getSelectedTrainingDay);
  const [showModal, setShowAlert] = useState(false);
  const [doneSetsThisExercise, setDoneSetsThisExercise] = useState<DoneExercises>(new Map());
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const getNumberOfSetsWithIndex = useAppSelector(getSpecificNumberOfSets);
  const confirmButtonOpacity = useRef(new Animated.Value(0)).current;

  const isDone = useMemo(() => {
    const hasEntryForEveryExercise = doneSetsThisExercise.size === (trainingDay?.exercises.length ?? -1);
    if (!hasEntryForEveryExercise) {
      return false;
    }
    let hasEnoughSets = true;
    doneSetsThisExercise.forEach((exercise, index) => {
      if (exercise.sets.size !== getNumberOfSetsWithIndex(index)) {
        hasEnoughSets = false;
      }
    });
    return hasEnoughSets;
  }, [doneSetsThisExercise, getNumberOfSetsWithIndex, trainingDay?.exercises.length]);

  useEffect(() => {
    if (isDone) {
      Animated.timing(confirmButtonOpacity, {
        duration: 200,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [isDone]);

  const handleSaveTrainingData = useCallback(() => {
    const doneSetsArray = mapOfMapsTo2DArray(doneSetsThisExercise);
    console.log(doneSetsArray);
    dispatch(addSetDataToTrainingDay(doneSetsArray));
  }, [dispatch, doneSetsThisExercise]);

  const handleReset = useCallback(() => {
    dispatch(setExerciseIndex(0));
    dispatch(setTrainingDayIndex(undefined));
    dispatch(setSetIndex(0));
    setDoneSetsThisExercise(new Map());
    navigate("workouts");
  }, [dispatch, navigate, setDoneSetsThisExercise]);

  const handleDone = useCallback(() => {
    handleSaveTrainingData();
    handleReset();
  }, [handleReset, handleSaveTrainingData]);

  const handleCloseAlert = useCallback(() => setShowAlert(false), []);

  const handleNotDoneConfirm = useCallback(() => {
    setShowAlert(false);
    handleSaveTrainingData();
    handleReset();
  }, [handleReset, handleSaveTrainingData]);

  const handleCloseButton = useCallback(() => {
    if (!isDone) {
      setShowAlert(true);
    } else {
      handleSaveTrainingData();
      handleReset();
    }
  }, [handleReset, handleSaveTrainingData, isDone]);

  const handleSetDone = useCallback(
    (exerciseIndex: number, setIndex: number, data: PlainExerciseData) => {
      const newDoneSets = new Map(doneSetsThisExercise.entries());
      const newSetMap = new Map(newDoneSets.get(exerciseIndex)?.sets);
      newSetMap.set(setIndex, data);
      newDoneSets.set(exerciseIndex, { note: newDoneSets.get(exerciseIndex)?.note, sets: newSetMap });
      setDoneSetsThisExercise(newDoneSets);
    },
    [doneSetsThisExercise],
  );

  const handleSaveNote = useCallback(
    (exerciseIndex: number, note: string | undefined) => {
      const newDoneExercises = new Map(doneSetsThisExercise.entries());
      const existingSets = newDoneExercises.get(exerciseIndex)?.sets;
      newDoneExercises.set(exerciseIndex, { note, sets: existingSets ?? new Map() });
      setDoneSetsThisExercise(newDoneExercises);
    },
    [doneSetsThisExercise],
  );

  const buttonsStyle = useMemo(() => [trainStyles.buttons, { marginBottom: bottom }], [bottom]);
  const alertModalConfig = useMemo(() => ({ title: t("alert_quit_title"), content: t("alert_quit_message") }), [t]);

  const mappedExercises = useMemo(() => {
    if (!trainingDay) {
      navigate("workouts");
      return [] as { metaData: ExerciseMetaData; note?: string }[];
    }
    return trainingDay.exercises.map((exercise, index) => ({
      metaData: { reps: exercise.reps, weight: exercise.weight, name: exercise.name, sets: exercise.sets, pause: exercise.pause },
      note: doneSetsThisExercise.get(index)?.note,
    }));
  }, [doneSetsThisExercise, navigate, trainingDay]);

  const renderItem = useCallback(
    ({ item: { metaData, note }, index }: { item: { metaData: ExerciseMetaData; note?: string }; index: number }) => {
      return <Exercise note={note} onSaveNote={handleSaveNote} onSetDone={handleSetDone} exerciseIndex={index} metaData={metaData} />;
    },
    [handleSaveNote, handleSetDone],
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
        <SiteNavigationButtons handleConfirmOpacity={confirmButtonOpacity} handleBack={handleCloseButton} handleConfirm={handleDone} titleFontSize={30} title={trainingDay?.name} />
      </ThemedView>
      <ThemedView stretch>
        <Carousel scrollAnimationDuration={200} onSnapToItem={handleScrollEnd} width={Dimensions.get("screen").width} loop={false} vertical={false} renderItem={renderItem} data={mappedExercises} />
      </ThemedView>
      <HStack style={buttonsStyle}>
        <StopwatchPopover />
      </HStack>
      <AlertModal title={alertModalConfig.title} content={alertModalConfig.content} isVisible={showModal} onConfirm={handleNotDoneConfirm} onCancel={handleCloseAlert} />
    </ThemedView>
  );
}
