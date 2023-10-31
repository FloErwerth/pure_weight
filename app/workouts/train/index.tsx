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

function mapOfMapsTo2DArray(map: Map<number, Map<number, PlainExerciseData>>) {
  const result: PlainExerciseData[][] = [];
  map.forEach((innerMap, key) => {
    result[key] = [...innerMap.values()];
  });
  return result;
}

export function Train() {
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const trainingDay = useAppSelector(getSelectedTrainingDay);
  const [showModal, setShowAlert] = useState(false);
  const [doneSetsThisExercise, setDoneSetsThisExercise] = useState<Map<number, Map<number, PlainExerciseData>>>(new Map());
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
      if (exercise.size !== getNumberOfSetsWithIndex(index)) {
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
    dispatch(addSetDataToTrainingDay(doneSetsArray));
  }, [dispatch, doneSetsThisExercise]);

  const handleSavePartialData = useCallback(() => {
    const doneSetsArray = Array.of(doneSetsThisExercise.values()).map(([_, entryMap]) => Array.from(entryMap.values()));
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

  const handleSetsDone = useCallback(
    (sets: Map<number, PlainExerciseData>, exerciseIndex: number) => {
      const newDoneSets = new Map(doneSetsThisExercise.entries());
      newDoneSets.set(exerciseIndex, sets);
      setDoneSetsThisExercise(newDoneSets);
    },
    [doneSetsThisExercise],
  );

  const buttonsStyle = useMemo(() => [trainStyles.buttons, { marginBottom: bottom }], [bottom]);
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

  const requestSets = useCallback(
    (exerciseIndex: number, sets: Map<number, PlainExerciseData>) => {
      const newDoneSets = new Map(doneSetsThisExercise.entries());
      newDoneSets.set(exerciseIndex, sets);
      setDoneSetsThisExercise(newDoneSets);
    },
    [doneSetsThisExercise],
  );

  const renderItem = useCallback(
    ({ item: { metaData }, index }: { item: { metaData: ExerciseMetaData }; index: number }) => {
      const handleRequest = (sets: Map<number, PlainExerciseData>) => {
        return requestSets(index, sets);
      };
      return <Exercise onRequestSets={handleRequest} handleSetsDone={handleSetsDone} exerciseIndex={index} metaData={metaData} />;
    },
    [handleSetsDone, requestSets],
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
