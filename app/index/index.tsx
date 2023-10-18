import { ScrollView, Text, View } from "react-native";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { PressableRowWithIconSlots } from "../../components/PressableRowWithIconSlots/PressableRowWithIconSlots";
import { useNavigate } from "../../utils/navigate";
import { Routes } from "../../types/routes";
import { useAppDispatch, useAppSelector } from "../../store";
import { getLanguage, getSavedTrainings } from "../../store/selectors";
import { removeTrainingDay, setMockState, setSelectedDay } from "../../store/reducer";
import { styles } from "./styles";
import { AlertModal } from "../../components/AlertModal/AlertModal";
import { SafeAreaView } from "../../components/SafeAreaView/SafeAreaView";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { Button } from "../../components/Button/Button";
import { useTranslation } from "react-i18next";
import * as Locale from "expo-localization";

export default function Main() {
  const language = useAppSelector(getLanguage);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language ?? Locale.getLocales()[0].languageCode ?? "en");
  }, []);

  const navigate = useNavigate();

  const [Alert, setAlert] = useState<ReactNode | null>(null);

  const savedTrainings = useAppSelector(getSavedTrainings);

  const handleNavigateToCreateTraining = useCallback(() => {
    navigate(Routes.CREATE_TRAINING);
  }, [navigate]);

  const handleNavigateToTrain = useCallback(
    (index: number) => {
      dispatch(setSelectedDay(index));
      navigate(Routes.TRAIN);
    },
    [dispatch, navigate],
  );

  const handlePress = useCallback(() => {
    dispatch(setSelectedDay(undefined));
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
      dispatch(setSelectedDay(index));
      handleNavigateToCreateTraining();
    },
    [dispatch, handleNavigateToCreateTraining],
  );

  return (
    <SafeAreaView style={styles.view}>
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
    </SafeAreaView>
  );
}
