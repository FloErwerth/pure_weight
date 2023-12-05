import { lazy, Suspense, useCallback, useMemo } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useAppSelector } from "../../../store";
import { Dimensions, ScrollView } from "react-native";
import { Skeleton } from "../../../components/Skeleton/Skeleton";
import { borderRadius } from "../../../theme/border";
import { VStack } from "../../../components/Stack/VStack/VStack";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { PageContent } from "../../../components/PageContent/PageContent";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { styles } from "../../../components/App/progress/chart/components/styles";
import { useTheme } from "../../../theme/context";

import { getEditedWorkoutName, getWorkoutExercises } from "../../../store/reducers/workout/workoutSelectors";

const ExerciseCharts = lazy(() => import("../../../components/App/progress/chart/components/ExerciseCharts"));

const PromiseTrigger = () => {
    throw new Promise(() => {});
};

export function Progress() {
    const navigate = useNavigate();
    const exercises = useAppSelector(getWorkoutExercises);
    const trainingDayName = useAppSelector(getEditedWorkoutName);

    const handleNavigateToWorkouts = useCallback(() => {
        navigate("workouts");
    }, [navigate]);

    const Fallback = () => {
        const { componentBackgroundColor } = useTheme();
        const containerStyles = useMemo(() => [styles.vStack, { backgroundColor: componentBackgroundColor }], [componentBackgroundColor]);
        return (
            <ScrollView contentContainerStyle={styles.scrollView}>
                {exercises?.map(() => (
                    <VStack key={Math.random() * 10000} style={containerStyles}>
                        <HStack style={styles.hStack}>
                            <Skeleton borderRadius={borderRadius} width={140} height={40} />
                            <Skeleton borderRadius={borderRadius} width={140} height={40} />
                        </HStack>
                        <Skeleton borderRadius={borderRadius} width={Dimensions.get("screen").width - 40} height={283} />
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
