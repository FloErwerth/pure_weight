import { SafeAreaView } from "../../../components/SafeAreaView/SafeAreaView";
import { useCallback } from "react";
import { useNavigate } from "../../../utils/navigate";
import { Routes } from "../../../types/routes";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useAppSelector } from "../../../store";
import { getSelectedTrainingDayData } from "../../../store/selectors";
import { ExerciseChart } from "./components/ExerciseChart";
import { ScrollView } from "react-native";

export default function Index() {
  const navigate = useNavigate();
  const trainingDayData = useAppSelector(getSelectedTrainingDayData);

  if (!trainingDayData) {
    navigate(Routes.HOME);
  }

  const handleNavigateToProgress = useCallback(() => {
    navigate(Routes.PROGRESS);
  }, [navigate]);

  return (
    <SafeAreaView>
      <SiteNavigationButtons handleBack={handleNavigateToProgress} title={trainingDayData?.name} />
      <ScrollView>{trainingDayData?.exercises?.map((exercise) => <ExerciseChart key={`${exercise.sets}${exercise.name}${exercise.weight}`} exercise={exercise} />)}</ScrollView>
    </SafeAreaView>
  );
}
