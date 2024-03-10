import { getDoneWorkoutById, getWorkoutByIndex } from "../../../../store/selectors/workout/workoutSelectors";
import { AppState, useAppDispatch, useAppSelector } from "../../../../store";
import { ThemedView } from "../../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { RoutesParamaters, useNavigate } from "../../../../hooks/navigate";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text } from "../../../../components/Themed/ThemedText/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedPressable } from "../../../../components/Themed/Pressable/Pressable";
import { cleanupDurationValues } from "../../../../store/reducers/workout";
import { PageContent } from "../../../../components/PageContent/PageContent";
import { HStack } from "../../../../components/Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { View } from "react-native";
import { DoneExerciseData } from "../../../../store/reducers/workout/types";
import { getLocaleDate } from "../../../../utils/date";
import { getLanguage } from "../../../../store/selectors/settings/settingsSelectors";

export const WorkoutHistoryOverview = ({
    route: {
        params: { doneWorkoutId },
    },
}: NativeStackScreenProps<RoutesParamaters, "workouts/history/workout/index">) => {
    const doneWorkout = useAppSelector((state: AppState) => getDoneWorkoutById(state, doneWorkoutId));
    const workoutName = useAppSelector((state: AppState) => getWorkoutByIndex(state, doneWorkout?.originalWorkoutId))?.name;

    const language = useAppSelector(getLanguage);
    const { bottom } = useSafeAreaInsets();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const pageTitle = useMemo(() => t("workout_history_edit_title"), [t]);
    const dispatch = useAppDispatch();

    const handleNavigateToHistory = useCallback(() => {
        navigate("history");
        dispatch(cleanupDurationValues());
    }, [dispatch, navigate]);

    const handleBackButton = useCallback(() => {
        handleNavigateToHistory();
    }, [handleNavigateToHistory]);

    const handleNavigateToHistoryEdit = useCallback(
        (data: DoneExerciseData) => {
            navigate("workouts/history/exercise_edit/index", { doneWorkoutId, doneExercise: data });
        },
        [navigate, doneWorkoutId],
    );

    const date = useMemo(
        () =>
            `${t("history_trained_at")} ${getLocaleDate(doneWorkout?.isoDate, language, {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })}`,
        [t, doneWorkout?.isoDate, language],
    );

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons title={pageTitle} backButtonAction={handleBackButton} />
            <PageContent ghost ignoreGap paddingTop={20}>
                <Text style={{ fontSize: 26 }} ghost>
                    {workoutName}
                </Text>
                <Text italic style={{ fontSize: 16 }} ghost>
                    {date}
                </Text>
            </PageContent>
            <PageContent scrollable paddingTop={15} ghost>
                {doneWorkout?.doneExercises?.map((item) => (
                    <ThemedPressable key={item.originalExerciseId} input padding round style={{ padding: 15 }} onPress={() => handleNavigateToHistoryEdit(item)}>
                        <HStack center style={{ justifyContent: "space-between" }} ghost>
                            <Text ghost>{item?.name}</Text>
                            <ThemedMaterialCommunityIcons ghost name="chevron-right" size={26} />
                        </HStack>
                    </ThemedPressable>
                ))}
                <View style={{ height: bottom }} />
            </PageContent>
        </ThemedView>
    );
};
