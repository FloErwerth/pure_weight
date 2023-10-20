import { ScrollView, Text, View } from "react-native";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { PressableRowWithIconSlots } from "../../components/PressableRowWithIconSlots/PressableRowWithIconSlots";
import { useNavigate } from "../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../store";
import { getLanguage, getSavedTrainings } from "../../store/selectors";
import { cleanErrors, removeTrainingDay, setExerciseIndex, setMockState, setSetIndex, setState, setTrainingDayIndex } from "../../store/reducer";
import { styles } from "../../components/App/index/styles";
import { AlertModal } from "../../components/AlertModal/AlertModal";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { Button } from "../../components/Button/Button";
import { useTranslation } from "react-i18next";
import * as Locale from "expo-localization";
import { ThemedView } from "../../components/View/View";

export function Workouts() {
  const language = useAppSelector(getLanguage);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language ?? Locale.getLocales()[0].languageCode ?? "en");
    dispatch(setExerciseIndex(0));
    dispatch(setTrainingDayIndex(undefined));
    dispatch(setExerciseIndex(0));
    dispatch(setSetIndex(0));
    dispatch(cleanErrors());
  }, []);

  const navigate = useNavigate();

  const [Alert, setAlert] = useState<ReactNode | null>(null);

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
      setAlert(undefined);
    },
    [dispatch],
  );
  const handleShowAlert = useCallback(
    (index: number) => setAlert(<AlertModal onCancel={() => setAlert(null)} onConfirm={() => handleDelete(index)} title="Delete training?" content="This action can't be undone" isVisible={true} />),
    [handleDelete],
  );
  const handleEdit = useCallback(
    (index: number) => {
      dispatch(setTrainingDayIndex(index));
      handleNavigateToCreateTraining();
    },
    [dispatch, handleNavigateToCreateTraining],
  );

  return (
    <ThemedView style={styles.view}>
      <View style={styles.center}>
        <View style={styles.stack}>
          <SiteNavigationButtons title={t("workouts")} handleConfirmIcon={{ name: "plus", size: 40 }} handleConfirm={handlePress} />
          <ScrollView style={styles.view}>
            <View style={styles.savedTrainings}>
              {savedTrainings.map((trainingDay, index) => (
                <PressableRowWithIconSlots
                  key={trainingDay.name.concat("-key").concat(index.toString())}
                  onClick={() => handleNavigateToTrain(index)}
                  Icon2={{ icon: "pencil", onPress: () => handleEdit(index) }}
                  Icon1={{ icon: "delete", onPress: () => handleShowAlert(index) }}
                >
                  <Text style={styles.trainingDayName}>{trainingDay.name}</Text>
                </PressableRowWithIconSlots>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      {Alert}
      <Button title={"Use Mock State"} onPress={() => dispatch(setMockState())} />
      <Button
        title={"Use empty state"}
        onPress={() => dispatch(setState({ exerciseIndex: 0, errors: [], settings: { language: "en" }, trainingDayIndex: undefined, trainingDays: [], setIndex: 0, isFirstTimeRendered: false }))}
      />
    </ThemedView>
  );
}
