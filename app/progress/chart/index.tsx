import { SafeAreaView } from "../../../components/SafeAreaView/SafeAreaView";
import { lazy, Suspense, useCallback } from "react";
import { useNavigate } from "../../../utils/navigate";
import { Routes } from "../../../types/routes";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useAppSelector } from "../../../store";
import { getSelectedTrainingDayData } from "../../../store/selectors";
import { Dimensions, ScrollView } from "react-native";
import { Skeleton } from "../../../components/Skeleton/Skeleton";
import { borderRadius } from "../../theme/border";
import { VStack } from "../../../components/VStack/VStack";
import { textFieldBackgroundColor } from "../../theme/colors";

const ExerciseCharts = lazy(() => import("./components/ExerciseCharts"));

export default function Index() {
  const navigate = useNavigate();
  const trainingDayData = useAppSelector(getSelectedTrainingDayData);

  const handleNavigateToProgress = useCallback(() => {
    navigate(Routes.PROGRESS);
  }, [navigate]);

  if (trainingDayData === undefined) {
    navigate(Routes.PROGRESS);
  }

  const Fallback = () => {
    const exerciseNames = trainingDayData?.exercises.map((exercise) => exercise.name);
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center", gap: 20, padding: 10 }}>
        {exerciseNames?.map(() => (
          <VStack style={{ borderRadius, backgroundColor: textFieldBackgroundColor, padding: 10, gap: 10 }}>
            <Skeleton borderRadius={borderRadius} width={Dimensions.get("screen").width / 2 - 20} height={40} />
            <Skeleton borderRadius={borderRadius} width={Dimensions.get("screen").width - 40} height={Dimensions.get("screen").height * 0.33} />
            <Skeleton borderRadius={borderRadius} style={{ alignSelf: "center" }} width={Dimensions.get("screen").width - 100} height={40} />
          </VStack>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView>
      <SiteNavigationButtons handleBack={handleNavigateToProgress} title={trainingDayData?.name} />
      <Suspense fallback={<Fallback />}>
        <ExerciseCharts />
      </Suspense>
    </SafeAreaView>
  );
}
