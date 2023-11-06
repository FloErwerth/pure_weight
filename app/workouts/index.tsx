import { FlatList, Pressable, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { WorkoutProgress } from "../../components/WorkoutCard/components/ProgressDisplay/WorkoutProgress";
import Toast from "react-native-root-toast";
import { VStack } from "../../components/VStack/VStack";
import { borderRadius } from "../../theme/border";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedToast } from "../../components/Themed/ThemedToast/ThemedToast";
import { useTheme } from "../../theme/context";

export function Workouts() {
  const language = useAppSelector(getLanguage);
  const { mainColor, secondaryColor, secondaryBackgroundColor } = useTheme();
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

  return (
    <ThemedView style={styles.view}>
      <View style={styles.vStack}>
        <SiteNavigationButtons title={t("workouts")} handleConfirmIcon={confirmIcon} handleConfirm={handlePress} />
        <PageContent>
          <FlatList
            decelerationRate="normal"
            keyExtractor={(item) => item.key}
            style={styles.savedTrainings}
            data={mappedTrainings}
            renderItem={({ item: { handleNavigateToProgress, workoutName, key, onEdit, onDelete, onClick, overallTrainingData } }) => (
              <Swipeable onEdit={onEdit} onDelete={onDelete} onClick={onClick} key={key}>
                <Text style={styles.title}>{workoutName}</Text>
                <WorkoutProgress onPress={handleNavigateToProgress} progressData={overallTrainingData} />
              </Swipeable>
            )}
          ></FlatList>
        </PageContent>
      </View>
      <ThemedToast onPress={() => setShowToast(false)} opacity={1} position={Toast.positions.BOTTOM - 75} visible={showToast}>
        <VStack style={{ gap: 10, justifyContent: "space-evenly" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{t("measurement_deleted_message")}</Text>
          <Pressable style={{ padding: 10, justifyContent: "space-between", flexDirection: "row", borderRadius, backgroundColor: secondaryBackgroundColor }} onPress={handleRecoverWorkout}>
            <Text style={{ alignSelf: "center", fontSize: 16, color: secondaryColor }}>{t("measurement_deleted_undo")}</Text>
            <MaterialCommunityIcons color={mainColor} name="undo" size={20} />
          </Pressable>
        </VStack>
      </ThemedToast>
    </ThemedView>
  );
}
