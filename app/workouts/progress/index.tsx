import { lazy, Suspense, useCallback, useMemo } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useAppSelector } from "../../../store";
import { getExerciseNames, getSelectedTrainingName } from "../../../store/selectors";
import { Dimensions, ScrollView } from "react-native";
import { Skeleton } from "../../../components/Skeleton/Skeleton";
import { borderRadius } from "../../../theme/border";
import { VStack } from "../../../components/VStack/VStack";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { PageContent } from "../../../components/PageContent/PageContent";
import { HStack } from "../../../components/HStack/HStack";
import { styles } from "../../../components/App/progress/chart/components/styles";
import { useTheme } from "../../../theme/context";

const ExerciseCharts = lazy(() => import("../../../components/App/progress/chart/components/ExerciseCharts"));

const PromiseTrigger = () => {
  throw new Promise(() => {});
};

export function Progress() {
  const navigate = useNavigate();
  const exerciseNames = useAppSelector(getExerciseNames);
  const trainingDayName = useAppSelector(getSelectedTrainingName);

  const handleNavigateToWorkouts = useCallback(() => {
    navigate("workouts");
  }, [navigate]);

  if (exerciseNames === undefined) {
    handleNavigateToWorkouts();
  }

  const Fallback = () => {
    const { componentBackgroundColor } = useTheme();
    const containerStyles = useMemo(() => [styles.vStack, { backgroundColor: componentBackgroundColor }], [componentBackgroundColor]);

    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <VStack key={Math.random() * 10000} style={containerStyles}>
          <HStack style={styles.hStack}>
            <Skeleton borderRadius={borderRadius} width={140} height={40} />
            <Skeleton borderRadius={borderRadius} width={140} height={40} />
          </HStack>
          <Skeleton borderRadius={borderRadius} width={Dimensions.get("screen").width - 40} height={300} />
        </VStack>
        {exerciseNames?.map(() => (
          <VStack key={Math.random() * 10000} style={containerStyles}>
            <HStack style={styles.hStack}>
              <Skeleton borderRadius={borderRadius} width={140} height={40} />
              <Skeleton borderRadius={borderRadius} width={140} height={40} />
            </HStack>
            <Skeleton borderRadius={borderRadius} width={Dimensions.get("screen").width - 40} height={300} />
          </VStack>
        ))}
      </ScrollView>
    );
  };

  return (
    <ThemedView stretch>
      <SiteNavigationButtons handleBack={handleNavigateToWorkouts} title={trainingDayName} />
      <PageContent>
        <Suspense fallback={<Fallback />}>
          <ExerciseCharts />
        </Suspense>
      </PageContent>
    </ThemedView>
  );
}
