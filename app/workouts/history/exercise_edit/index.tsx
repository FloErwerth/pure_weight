import { ThemedView } from "../../../../components/Themed/ThemedView/View";
import { useNavigateBack } from "../../../../hooks/navigate";
import { SiteNavigationButtons } from "../../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../../components/PageContent/PageContent";
import { AppState, useAppDispatch, useAppSelector } from "../../../../store";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { discardChangesToDoneExercises, saveEditedHistoryExercise } from "../../../../store/reducers/workout";
import * as Haptics from "expo-haptics";
import { cleanError } from "../../../../store/reducers/errors";
import { ThemedPressable } from "../../../../components/Themed/Pressable/Pressable";
import { HStack } from "../../../../components/Stack/HStack/HStack";
import { Text } from "../../../../components/Themed/ThemedText/Text";
import { ThemedMaterialCommunityIcons } from "../../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { AnswerText } from "../../../../components/HelpQuestionAnswer/AnswerText";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ExerciseId, WorkoutId } from "../../../../store/reducers/workout/types";
import { HistorySetInput } from "../../../../components/App/history/HistorySetInput/HistorySetInput";
import { HistoryContextProvider } from "../../../../components/App/history/HistoryContext/HistoryContext";
import { getDoneExerciseById } from "../../../../store/selectors/workout/workoutSelectors";
import { RoutesParamaters } from "../../../../types/navigation";
import { useTypedTranslation } from "../../../../locales/i18next";
import { TranslationKeys } from "../../../../locales/translationKeys";

const useGetWasEdited = (doneWorkoutId: WorkoutId, doneExerciseId: ExerciseId) => {
	const doneExerciseData = useAppSelector((state: AppState) => getDoneExerciseById(state, doneWorkoutId, doneExerciseId));
	const [stringifiedDoneWorkout, setStringifiedWorkout] = useState("");

	useEffect(() => {
		setStringifiedWorkout(JSON.stringify(doneExerciseData?.sets ?? []));
	}, [doneWorkoutId]);

	return useCallback(() => {
		return stringifiedDoneWorkout !== JSON.stringify(doneExerciseData?.sets ?? []);
	}, [doneExerciseData?.sets, stringifiedDoneWorkout]);
};

export const WorkoutHistoryEdit = ({
	route: {
		params: { doneWorkoutId, doneExercise },
	},
}: NativeStackScreenProps<RoutesParamaters, "workouts/history/exercise_edit/index">) => {
	const { t } = useTypedTranslation();
	const title = useMemo(() => t(TranslationKeys.HISTORY_EXERCISE_EDIT_TITLE), [t]);
	const dispatch = useAppDispatch();
	const { ref, openBottomSheet } = useBottomSheetRef();
	const navigateBack = useNavigateBack();
	const getWasEdited = useGetWasEdited(doneWorkoutId, doneExercise.doneExerciseId);
	const saveExercise = useCallback(() => {
		dispatch(saveEditedHistoryExercise(doneWorkoutId));
		void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		navigateBack();
	}, [dispatch, doneWorkoutId, navigateBack]);

	const warningTitle = useMemo(() => t(TranslationKeys.WORKOUT_HISTORY_EDIT_WARNING_TITLE), [t]);
	const warningContent = useMemo(() => t(TranslationKeys.WORKOUT_HISTORY_EDIT_WARNING_MESSAGE), [t]);
	const discardActionText = useMemo(() => t(TranslationKeys.WORKOUT_HISTORY_EDIT_DISCARD_ACTION), [t]);

	const clearHistoryErrors = useCallback(() => {
		dispatch(
			cleanError(["edit_history_reps", "edit_history_duration", "edit_history_exercise_weightbased_weight", "edit_history_exercise_weightbased_weight"]),
		);
	}, [dispatch]);

	const handleDiscardChanges = useCallback(() => {
		dispatch(discardChangesToDoneExercises({ doneWorkoutId }));
	}, [dispatch, doneWorkoutId]);

	const handleNavigateBack = useCallback(() => {
		if (getWasEdited()) {
			openBottomSheet();
			return;
		}
		clearHistoryErrors();
		navigateBack();
	}, [clearHistoryErrors, getWasEdited, navigateBack, openBottomSheet]);

	const handleDiscardExercise = useCallback(() => {
		handleDiscardChanges();
		clearHistoryErrors();
		navigateBack();
	}, [clearHistoryErrors, handleDiscardChanges, navigateBack]);

	return (
		<ThemedView stretch background>
			<SiteNavigationButtons title={title} backButtonAction={handleNavigateBack} handleConfirm={saveExercise} />
			<PageContent safeBottom stretch ghost paddingTop={20}>
				<Text style={{ fontSize: 26, marginBottom: 10 }} ghost>
					{doneExercise.name}
				</Text>
				<ThemedView input padding style={{ gap: 5, paddingLeft: 0 }} round>
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
