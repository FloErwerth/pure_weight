import { useCallback } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useAppSelector } from "../../../store";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { PageContent } from "../../../components/PageContent/PageContent";

import { getEditedWorkoutName } from "../../../store/selectors/workout/workoutSelectors";
import ExerciseCharts from "../../../components/App/progress/chart/components/ExerciseCharts";

export function WorkoutProgress() {
    const navigate = useNavigate();
    const trainingDayName = useAppSelector(getEditedWorkoutName);

    const handleNavigateToWorkouts = useCallback(() => {
        navigate("workouts");
    }, [navigate]);

    return (
        <ThemedView background stretch>
            <SiteNavigationButtons backButtonAction={handleNavigateToWorkouts} title={trainingDayName} />
            <PageContent background>
                <ExerciseCharts />
            </PageContent>
        </ThemedView>
    );
}
