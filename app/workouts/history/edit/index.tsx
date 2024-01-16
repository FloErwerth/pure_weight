import { getDoneWorkoutDataByIndex, getEditedWorkout } from "../../../../store/reducers/workout/workoutSelectors";
import { AppState, useAppSelector } from "../../../../store";
import { ThemedView } from "../../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../../components/PageContent/PageContent";
import { Text } from "../../../../components/Themed/ThemedText/Text";
import { RoutesParamaters, useNavigate } from "../../../../hooks/navigate";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export const WorkoutHistoryEdit = ({
    route: {
        params: { doneExerciseIndex, doneWorkoutId },
    },
}: NativeStackScreenProps<RoutesParamaters, "workouts/history/edit/index">) => {
    const editedWorkout = useAppSelector(getEditedWorkout);
    const doneWorkoutData = useAppSelector((state: AppState) => getDoneWorkoutDataByIndex(state, doneExerciseIndex, doneWorkoutId));

    const navigate = useNavigate();
    const { t } = useTranslation();
    const pageTitle = t("workout_history_edit_title");

    const handleNavigatetoHistory = useCallback(() => {
        navigate("history");
    }, [navigate]);

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons title={pageTitle} handleBack={handleNavigatetoHistory} />
            <PageContent></PageContent>
            <Text>{editedWorkout?.workout.workoutId}</Text>
        </ThemedView>
    );
};
