import { FlatList, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../store";
import { getLanguage, getOverallTrainingTrend, getSavedTrainings } from "../../store/selectors";
import { cleanErrors, recoverWorkout, removeTrainingDay, setExerciseIndex, setSetIndex, setTrainingDayIndex } from "../../store/reducer";
import { styles } from "../../components/App/index/styles";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import * as Locale from "expo-localization";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { PageContent } from "../../components/PageContent/PageContent";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { Text } from "../../components/Themed/ThemedText/Text";
import { ProgressDisplay } from "../../components/WorkoutCard/components/ProgressDisplay/ProgressDisplay";
import { BottomToast } from "../../components/BottomToast/BottomToast";
import { HStack } from "../../components/Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";

export function Workouts() {
  const language = useAppSelector(getLanguage);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const previousTrainingByIndex = useAppSelector(getOverallTrainingTrend);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(language ?? Locale.getLocales()[0].languageCode ?? "en");
    dispatch(setExerciseIndex(0));
    dispatch(setTrainingDayIndex(undefined));
    dispatch(setExerciseIndex(0));
    dispatch(setSetIndex(0));
    dispatch(cleanErrors());
  }, []);

  const navigate = useNavigate();

  const savedTrainings = useAppSelector(getSavedTrainings);

  const handleNavigateToCreateTraining = useCallback(() => {
    navigate("create");
  }, [navigate]);

  const handleNavigateToTrain = useCallback(
    (index: number) => {
      dispatch(setTrainingDayIndex(index));
      navigate("train");
    },
    [dispatch, navigate],
  );

  const handlePress = useCallback(() => {
    dispatch(setTrainingDayIndex(undefined));
    handleNavigateToCreateTraining();
  }, [dispatch, handleNavigateToCreateTraining]);

  const handleDelete = useCallback(
    (index: number) => {
      dispatch(removeTrainingDay(index));
      setShowToast(true);
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (index: number) => {
      handleNavigateToCreateTraining();
      dispatch(setTrainingDayIndex(index));
    },
    [dispatch, handleNavigateToCreateTraining],
  );

  const confirmIcon = useMemo((): { name: "plus"; size: number } => ({ name: "plus", size: 40 }), []);

  const mappedTrainings = useMemo(() => {
    return savedTrainings.map((trainingDay, index) => {
      const onEdit = () => handleEdit(index);
      const onDelete = () => handleDelete(index);
      const key = trainingDay.name.concat("-key").concat((index * Math.random() * 2).toString());
      const onClick = () => handleNavigateToTrain(index);
      const overallTrainingData = previousTrainingByIndex(index);
      const handleNavigateToProgress = () => {
        dispatch(setTrainingDayIndex(index));
        navigate("progress");
      };

      return { handleNavigateToProgress, onEdit, onDelete, key, onClick, workoutName: trainingDay.name, overallTrainingData };
    });
  }, [dispatch, handleDelete, handleEdit, handleNavigateToTrain, navigate, previousTrainingByIndex, savedTrainings]);

  const handleRecoverWorkout = useCallback(() => {
    dispatch(recoverWorkout());
    setShowToast(false);
  }, [dispatch]);

  const renderItem = useCallback(
    ({
      item: { handleNavigateToProgress, workoutName, key, onEdit, onDelete, onClick, overallTrainingData },
    }: {
      item: {
        handleNavigateToProgress: () => void;
        workoutName: string;
        key: string;
        onEdit: () => void;
        onDelete: () => void;
        onClick: () => void;
        overallTrainingData: { name: string; percent: number } | undefined;
      };
    }) => {
      return (
        <Swipeable onEdit={onEdit} onDelete={onDelete} onClick={onClick} key={key}>
          <HStack style={styles.trainWrapper}>
            <Text style={styles.title}>{workoutName}</Text>
            <ThemedMaterialCommunityIcons ghost name="chevron-right" size={30} />
          </HStack>
          {overallTrainingData && (
            <View style={styles.progressWrapper}>
              <ProgressDisplay type="Workout" onPress={handleNavigateToProgress} name={overallTrainingData.name} percent={overallTrainingData.percent} />
            </View>
          )}
        </Swipeable>
      );
    },
    [],
  );

  return (
    <ThemedView background style={styles.view}>
      <View style={styles.vStack}>
        <SiteNavigationButtons title={t("workouts")} handleConfirmIcon={confirmIcon} handleConfirm={handlePress} />
        <PageContent>
          <FlatList decelerationRate="normal" keyExtractor={(item) => item.key} style={styles.savedTrainings} data={mappedTrainings} renderItem={renderItem}></FlatList>
        </PageContent>
      </View>
      <BottomToast onRequestClose={() => setShowToast(false)} open={showToast} messageKey={"workout_deleted_message"} titleKey={"workout_deleted_title"} onRedo={handleRecoverWorkout} />
    </ThemedView>
  );
}
