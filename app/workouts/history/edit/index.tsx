import { getAnyHasFallbackSets, getDoneWorkoutById } from "../../../../store/reducers/workout/workoutSelectors";
import { AppState, useAppDispatch, useAppSelector } from "../../../../store";
import { ThemedView } from "../../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { RoutesParamaters, useNavigate } from "../../../../hooks/navigate";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WeightBasedEditedExercise } from "../../../../components/App/history/EditedExercise/WeightBased";
import { Text } from "../../../../components/Themed/ThemedText/Text";
import { FlatList } from "react-native";
import { DoneExerciseData } from "../../../../store/reducers/workout/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { ThemedPressable } from "../../../../components/Themed/Pressable/Pressable";
import { deleteFallbackSets, discardChangesToDoneExercises } from "../../../../store/reducers/workout";
import { PageContent } from "../../../../components/PageContent/PageContent";
import { AnswerText } from "../../../../components/HelpQuestionAnswer/AnswerText";
import { HStack } from "../../../../components/Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { TimeBasedEditedExercise } from "../../../../components/App/history/EditedExercise/TimeBased";

const saveButtonConfig = { name: "content-save-outline", size: 34 } as const;

export const WorkoutHistoryEdit = ({
    route: {
        params: { doneWorkoutId },
    },
}: NativeStackScreenProps<RoutesParamaters, "workouts/history/edit/index">) => {
    const doneWorkout = useAppSelector((state: AppState) => getDoneWorkoutById(state, doneWorkoutId));
    const hasFallbackSet = useAppSelector((state: AppState) => getAnyHasFallbackSets(state, doneWorkoutId));
    const { bottom } = useSafeAreaInsets();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const pageTitle = useMemo(() => t("workout_history_edit_title"), [t]);
    const [ref, open] = useBottomSheetRef();
    const dispatch = useAppDispatch();

    const handleNavigateToHistory = useCallback(() => {
        navigate("history");
        if (hasFallbackSet) {
            dispatch(deleteFallbackSets({ doneWorkoutId }));
        }
    }, [dispatch, doneWorkoutId, hasFallbackSet, navigate]);

    const handleDiscardChanges = useCallback(() => {
        dispatch(discardChangesToDoneExercises({ doneWorkoutId }));
        handleNavigateToHistory();
    }, [dispatch, doneWorkoutId, handleNavigateToHistory]);

    const handleBackButton = useCallback(() => {
        if (hasFallbackSet) {
            open();
            return;
        }
        handleNavigateToHistory();
    }, [handleNavigateToHistory, hasFallbackSet, open]);

    const renderedExercise = useCallback(
        ({ item, index }: { item: DoneExerciseData | undefined; index: number }) => {
            if (item?.sets.length === 0) return null;

            return (
                <ThemedView input round style={{ padding: 10, margin: 10 }}>
                    <Text style={{ fontSize: 20, marginBottom: 10 }} ghost>
                        {item?.name}
                    </Text>
                    {item?.type === "WEIGHT_BASED" ? (
                        <WeightBasedEditedExercise index={index} doneWorkoutId={doneWorkoutId} />
                    ) : (
                        <TimeBasedEditedExercise index={index} doneWorkoutId={doneWorkoutId} />
                    )}
                </ThemedView>
            );
        },
        [doneWorkoutId],
    );

    const warningTitle = useMemo(() => t("workout_history_edit_warning_title"), [t]);
    const warningContent = useMemo(() => t("workout_history_edit_warning_message"), [t]);
    const saveActionText = useMemo(() => t("workout_history_edit_save_action"), [t]);
    const discardActionText = useMemo(() => t("workout_history_edit_discard_action"), [t]);

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons title={pageTitle} handleBack={handleBackButton} handleConfirmIcon={saveButtonConfig} handleConfirm={handleNavigateToHistory} />
            <FlatList showsVerticalScrollIndicator={false} horizontal={false} contentInset={{ bottom }} data={doneWorkout?.doneExercises} renderItem={renderedExercise} />
            <ThemedBottomSheetModal title={warningTitle} ref={ref}>
                <PageContent paddingTop={20} ghost>
                    <AnswerText>{warningContent}</AnswerText>
                    <HStack style={{ gap: 10, marginTop: 30 }} ghost>
                        <ThemedPressable stretch secondary padding round onPress={handleNavigateToHistory}>
                            <HStack ghost style={{ gap: 10 }}>
                                <ThemedMaterialCommunityIcons ghost name="content-save-outline" size={26} />
                                <Text style={{ fontSize: 20, alignSelf: "center" }} center ghost>
                                    {saveActionText}
                                </Text>
                            </HStack>
                        </ThemedPressable>
                    </HStack>
                    <HStack style={{ gap: 10 }} ghost>
                        <ThemedPressable stretch secondary padding round onPress={handleDiscardChanges}>
                            <HStack ghost style={{ gap: 10 }}>
                                <ThemedMaterialCommunityIcons ghost name="delete" size={26} />
                                <Text style={{ fontSize: 20, alignSelf: "center" }} center ghost>
                                    {discardActionText}
                                </Text>
                            </HStack>
                        </ThemedPressable>
                    </HStack>
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
