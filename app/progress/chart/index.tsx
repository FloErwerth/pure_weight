import { lazy, Suspense, useCallback } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useAppSelector } from "../../../store";
import { getSelectedTrainingDayData } from "../../../store/selectors";
import { Dimensions, ScrollView } from "react-native";
import { Skeleton } from "../../../components/Skeleton/Skeleton";
import { borderRadius } from "../../../components/App/theme/border";
import { VStack } from "../../../components/VStack/VStack";
import { ThemedView } from "../../../components/View/View";
import { PageContent } from "../../../components/PageContent/PageContent";
import { HStack } from "../../../components/HStack/HStack";
import { componentBackgroundColor } from "../../../components/App/theme/colors";

const ExerciseCharts = lazy(() => import("../../../components/App/progress/chart/components/ExerciseCharts"));

const PromiseTrigger = () => {
  throw new Promise(() => {});
};

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
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center", backgroundColor: componentBackgroundColor, gap: 20, borderRadius }}>
        {exerciseNames?.map((name) => (
          <VStack key={`${name}-skeleton`} style={{ borderRadius, padding: 10, paddingBottom: 0, gap: 10 }}>
            <HStack style={{ justifyContent: "space-between", paddingHorizontal: 10 }}>
              <Skeleton borderRadius={borderRadius} width={140} height={40} />
              <Skeleton borderRadius={borderRadius} width={140} height={40} />
            </HStack>
            <Skeleton borderRadius={borderRadius} width={Dimensions.get("screen").width - 40} height={Dimensions.get("screen").height * 0.35} />
          </VStack>
        ))}
      </ScrollView>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons handleBack={handleNavigateToProgress} title={trainingDayData?.name} />
      <PageContent>
        <Suspense fallback={<Fallback />}>
          <ExerciseCharts />
        </Suspense>
      </PageContent>
    </ThemedView>
  );
}
