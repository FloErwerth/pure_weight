import { ThemedView } from "../../../../components/Themed/ThemedView/View";
import { RoutesParamaters, useNavigateBack } from "../../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../../components/PageContent/PageContent";
import { useTranslation } from "react-i18next";
import { AppState, useAppDispatch, useAppSelector } from "../../../../store";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ThemedBottomSheetModal,
    useBottomSheetRef,
} from "../../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { discardChangesToDoneExercises, saveEditedExercise } from "../../../../store/reducers/workout";
import * as Haptics from "expo-haptics";
import { cleanError } from "../../../../store/reducers/errors";
import { ThemedPressable } from "../../../../components/Themed/Pressable/Pressable";
import { HStack } from "../../../../components/Stack/HStack/HStack";
import { Text } from "../../../../components/Themed/ThemedText/Text";
import { ThemedMaterialCommunityIcons } from "../../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { AnswerText } from "../../../../components/HelpQuestionAnswer/AnswerText";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DoneExerciseData, ExerciseId, WorkoutId } from "../../../../store/reducers/workout/types";
import { HistorySetInput } from "../../../../components/App/history/HistorySetInput/HistorySetInput";
import { HistoryContextProvider } from "../../../../components/App/history/HistoryContext/HistoryContext";
import { getDoneExerciseById } from "../../../../store/reducers/workout/workoutSelectors";

const getIsZeroOrNullish = (values: Array<string | undefined>) => values.some((value) => !value || value === "0");
const useValidateExercise = (exercise: DoneExerciseData) => {
    ///todo

    return () => true;
};

const useWasEdited = (doneWorkoutId: WorkoutId, doneExerciseId: ExerciseId) => {
    const doneExerciseData = useAppSelector((state: AppState) =>
        getDoneExerciseById(state, doneWorkoutId, doneExerciseId),
    );
    const [stringifiedDoneWorkout, setStringifiedWorkout] = useState("");

    useEffect(() => {
        setStringifiedWorkout(JSON.stringify(doneExerciseData?.sets ?? []));
    }, [doneWorkoutId]);

    return useMemo(() => {
        return stringifiedDoneWorkout !== JSON.stringify(doneExerciseData?.sets ?? []);
    }, [doneExerciseData?.sets, stringifiedDoneWorkout]);
};

export const WorkoutHistoryEdit = ({
    route: {
        params: { doneWorkoutId, doneExercise },
    },
}: NativeStackScreenProps<RoutesParamaters, "workouts/history/exercise_edit/index">) => {
    const { t } = useTranslation();
    const title = useMemo(() => t("exercise_edit_title"), [t]);
    const dispatch = useAppDispatch();
    const { ref, openBottomSheet } = useBottomSheetRef();
    const navigateBack = useNavigateBack();
    const validateExercise = useValidateExercise(doneExercise);
    const isMutated = useWasEdited(doneWorkoutId, doneExercise.doneExerciseId);

    const saveExercise = useCallback(() => {
        if (!validateExercise()) {
            return;
        }
        dispatch(saveEditedExercise());
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigateBack();
    }, [dispatch, navigateBack, validateExercise]);

    const warningTitle = useMemo(() => t("workout_history_edit_warning_title"), [t]);
    const warningContent = useMemo(() => t("workout_history_edit_warning_message"), [t]);
    const discardActionText = useMemo(() => t("workout_history_edit_discard_action"), [t]);

    const clearExerciseErrors = useCallback(() => {
        dispatch(
            cleanError([
                "create_exercise_name",
                "create_exercise_sets",
                "create_exercise_reps",
                "create_exercise_weight",
                "create_exercise_duration",
            ]),
        );
    }, [dispatch]);

    const handleDiscardChanges = useCallback(() => {
        dispatch(discardChangesToDoneExercises({ doneWorkoutId }));
    }, [dispatch, doneWorkoutId]);

    const handleNavigateBack = useCallback(() => {
        if (isMutated) {
            openBottomSheet();
            return;
        }
        clearExerciseErrors();
        navigateBack();
    }, [clearExerciseErrors, isMutated, navigateBack, openBottomSheet]);

    const handleDiscardExercise = useCallback(() => {
        handleDiscardChanges();
        clearExerciseErrors();
        navigateBack();
    }, [clearExerciseErrors, handleDiscardChanges, navigateBack]);

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons title={title} backButtonAction={handleNavigateBack} handleConfirm={saveExercise} />
            <PageContent safeBottom stretch ghost paddingTop={20}>
                <Text style={{ fontSize: 26, marginBottom: 25 }} ghost>
                    {doneExercise.name}
                </Text>
                <ThemedView input padding style={{ gap: 5 }} round>
                    <HistoryContextProvider>
                        {doneExercise.sets.map((_, index) => {
                            return (
                                <HistorySetInput
                                    key={doneExercise.doneExerciseId.concat(index.toString())}
                                    doneWorkoutId={doneWorkoutId}
                                    setIndex={index}
                                    exerciseId={doneExercise.doneExerciseId}
                                />
                            );
                        })}
                    </HistoryContextProvider>
                </ThemedView>
            </PageContent>
            <ThemedBottomSheetModal title={warningTitle} ref={ref}>
                <PageContent stretch ghost>
                    <AnswerText>{warningContent}</AnswerText>
                </PageContent>
                <PageContent ghost paddingTop={30}>
                    <ThemedView ghost style={{ gap: 10 }}>
                        <ThemedPressable round padding secondary onPress={handleDiscardExercise}>
                            <HStack ghost style={{ alignItems: "center", gap: 10 }}>
                                <ThemedMaterialCommunityIcons ghost name="delete" size={24} />
                                <Text ghost>{discardActionText}</Text>
                            </HStack>
                        </ThemedPressable>
                    </ThemedView>
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
