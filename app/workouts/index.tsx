import { FlatList, View } from "react-native";
import { ComponentProps, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../store";
import { getLanguage, getOverallTrainingTrend, getSavedTrainings } from "../../store/selectors";
import { cleanErrors, removeTrainingDay, setExerciseIndex, setSetIndex, setTrainingDayIndex } from "../../store/reducer";
import { styles } from "../../components/App/index/styles";
import { AlertModal } from "../../components/AlertModal/AlertModal";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import * as Locale from "expo-localization";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { PageContent } from "../../components/PageContent/PageContent";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { WorkoutCard } from "../../components/WorkoutCard/WorkoutCard";

export function Workouts() {
  const language = useAppSelector(getLanguage);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const previousTrainingByIndex = useAppSelector(getOverallTrainingTrend);

  useEffect(() => {
    i18n.changeLanguage(language ?? Locale.getLocales()[0].languageCode ?? "en");
    dispatch(setExerciseIndex(0));
    dispatch(setTrainingDayIndex(undefined));
    dispatch(setExerciseIndex(0));
    dispatch(setSetIndex(0));
    dispatch(cleanErrors());
  }, []);

  const navigate = useNavigate();

  const [deleteIndex, setDeleteIndex] = useState<number | undefined>(undefined);

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
    },
    [dispatch],
  );
  const handleShowAlert = useCallback((index: number) => setDeleteIndex(index), []);

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
      const Icon1 = { icon: "delete" as ComponentProps<typeof MaterialCommunityIcons>["name"], onPress: () => handleShowAlert(index) };
      const Icon2 = { icon: "pencil" as ComponentProps<typeof MaterialCommunityIcons>["name"], onPress: () => handleEdit(index) };
      const key = trainingDay.name.concat("-key").concat((index * Math.random() * 2).toString());
      const onClick = () => handleNavigateToTrain(index);
      const overallTrainingData = previousTrainingByIndex(index);
      const handleNavigateToProgress = () => {
        dispatch(setTrainingDayIndex(index));
        navigate("progress");
      };

      return { handleNavigateToProgress, Icon1, Icon2, key, onClick, workoutName: trainingDay.name, overallTrainingData };
    });
  }, [dispatch, handleEdit, handleNavigateToTrain, handleShowAlert, navigate, previousTrainingByIndex, savedTrainings]);

  const handleCancelAlert = useCallback(() => {
    setDeleteIndex(undefined);
  }, []);

  const handleConfirmAlert = useCallback(() => {
    if (deleteIndex !== undefined) {
      handleDelete(deleteIndex);
      handleCancelAlert();
    }
  }, [deleteIndex, handleCancelAlert, handleDelete]);

  const alertModalConfig = useMemo(() => ({ title: "Delete training?", content: "This action can't be undone" }), []);

  return (
    <ThemedView style={styles.view}>
      <View style={styles.vStack}>
        <SiteNavigationButtons title={t("workouts")} handleConfirmIcon={confirmIcon} handleConfirm={handlePress} />
        <PageContent>
          <FlatList
            keyExtractor={(item) => item.key}
            style={styles.savedTrainings}
            data={mappedTrainings}
            renderItem={({ item: { handleNavigateToProgress, workoutName, key, Icon1, Icon2, onClick, overallTrainingData } }) => (
              <WorkoutCard
                handleNavigateToProgress={handleNavigateToProgress}
                overallTrainingData={overallTrainingData}
                Icon1={Icon1}
                Icon2={Icon2}
                onClick={onClick}
                key={key}
                workoutName={workoutName}
              />
            )}
          ></FlatList>
        </PageContent>
      </View>
      {deleteIndex !== undefined && <AlertModal title={alertModalConfig.title} content={alertModalConfig.content} isVisible={true} onCancel={handleCancelAlert} onConfirm={handleConfirmAlert} />}
    </ThemedView>
  );
}
