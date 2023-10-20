import { lazy, Suspense, useCallback } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useAppSelector } from "../../../store";
import { getSelectedTrainingDayData } from "../../../store/selectors";
import { Dimensions, ScrollView } from "react-native";
import { Skeleton } from "../../../components/Skeleton/Skeleton";
import { borderRadius } from "../../../components/App/theme/border";
import { VStack } from "../../../components/VStack/VStack";
import { componentBackgroundColor } from "../../../components/App/theme/colors";
import { ThemedView } from "../../../components/View/View";

const ExerciseCharts = lazy(() => import("../../../components/App/progress/chart/components/ExerciseCharts"));
export function Charts() {
  const navigate = useNavigate();
  const trainingDayData = useAppSelector(getSelectedTrainingDayData);

  const handleNavigateToProgress = useCallback(() => {
    navigate("progress");
  }, [navigate]);

  if (trainingDayData === undefined) {
    navigate("progress");
  }

  const Fallback = () => {
    const exerciseNames = trainingDayData?.exercises.map((exercise) => exercise.name);
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center", gap: 20, padding: 10 }}>
        {exerciseNames?.map((name) => (
          <VStack key={`${name}-skeleton`} style={{ borderRadius, backgroundColor: componentBackgroundColor, padding: 10, gap: 10 }}>
            <Skeleton borderRadius={borderRadius} width={Dimensions.get("screen").width / 2 - 20} height={40} />
            <Skeleton borderRadius={borderRadius} width={Dimensions.get("screen").width - 40} height={Dimensions.get("screen").height * 0.33} />
            <Skeleton borderRadius={borderRadius} style={{ alignSelf: "center" }} width={Dimensions.get("screen").width - 100} height={40} />
          </VStack>
        ))}
      </ScrollView>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons handleBack={handleNavigateToProgress} title={trainingDayData?.name} />
      <Suspense fallback={<Fallback />}>
        <ExerciseCharts />
      </Suspense>
    </ThemedView>
  );
}
