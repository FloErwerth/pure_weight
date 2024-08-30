import React, { useCallback, useMemo, useState } from "react";
import { trainStyles } from "../../components/App/train/trainStyles";
import { RenderedWorkout } from "../../components/App/workout/RenderedWorkout";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../components/BottomSheetModal/ThemedBottomSheetModal";
import { BottomToast } from "../../components/BottomToast/BottomToast";
import { useToast } from "../../components/BottomToast/useToast";
import { PageContent } from "../../components/PageContent/PageContent";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { Sorting } from "../../components/Sorting/Sorting";
import { HStack } from "../../components/Stack/HStack/HStack";
import { ThemedPressable } from "../../components/Themed/Pressable/Pressable";
import { ThemedMaterialCommunityIcons } from "../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { Text } from "../../components/Themed/ThemedText/Text";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { useNavigate } from "../../hooks/navigate";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import {
	createNewWorkout,
	recoverWorkout,
	removeWorkout,
	resumeTrainedWorkout,
	setEditedWorkout,
	setSearchedWorkout,
	startWorkout,
} from "../../store/reducers/workout";
import { WorkoutId } from "../../store/reducers/workout/types";
import { getLanguage } from "../../store/selectors/settings/settingsSelectors";
import { getIsOngoingWorkout, getSearchedWorkout, getSortedWorkouts, getTrainedWorkout } from "../../store/selectors/workout/workoutSelectors";

import { RemainingWorkoutsText } from "../../components/CreationBarrierTexts/RemainingWorkoutsText";
import { AnswerText } from "../../components/HelpQuestionAnswer/AnswerText";
import { ExpandableSearchbar } from "../../components/Searchbar/ExpandableSearchbar";
import { WorkoutCompleteModal } from "../../components/WorkoutCompleteModal/WorkoutCompleteModal";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";
import { getIsPro } from "../../store/selectors/purchases";

const usePauseWarningContent = () => {
	const language = useAppSelector(getLanguage);

	if (language === "de") {
		return {
			title: "Bereits pausiertes Training",
			message: "Bitte beachte, dass ein Workout pausiert ist. Bitte wähle, ob Du ein neues Workout starten oder dein pausiertes Training fortsetzen möchtest.",
			resumeTrainingText: "Training fortsetzen",
			newTrainingText: "Neues Training starten",
		};
	}

	return {
		title: "Paused workout",
		message: "Please note that a workout is paused. Please choose whether you want to start a new workout or continue your paused training.",
		resumeTrainingText: "Resume training",
		newTrainingText: "Start new workout",
	};
};

export function Workouts() {
	const dispatch = useAppDispatch();
	const { t } = useTypedTranslation();
	const savedWorkouts = useAppSelector(getSortedWorkouts);
	const workoutFilter = useAppSelector(getSearchedWorkout);
	const isPro = useAppSelector(getIsPro);
	const navigate = useNavigate();
	const numberOfWorkouts = useMemo(() => savedWorkouts.length, [savedWorkouts]);
	const isAllowedToCreateWorkout = useMemo(() => isPro || numberOfWorkouts < 3, [isPro, numberOfWorkouts]);

	const filteredWorkouts = useMemo(
		() =>
			savedWorkouts.filter((workout) => {
				if (!workoutFilter) {
					return true;
				}

				return workout.name.toLowerCase().includes(workoutFilter?.toLowerCase());
			}),
		[savedWorkouts, workoutFilter],
	);

	const trainedWorkout = useAppSelector(getTrainedWorkout);
	const { ref, openBottomSheet, closeBottomSheet } = useBottomSheetRef();
	const { ref: deleteWarningRef, openBottomSheet: openDeleteWarning, closeBottomSheet: closeDeleteWarning } = useBottomSheetRef();
	const [newWorkoutId, setNewWorkoutId] = useState<WorkoutId | undefined>(undefined);
	const isOngoingWorkout = useAppSelector((state: AppState) => getIsOngoingWorkout(state, newWorkoutId));
	const { toastRef, openToast, closeToast, showToast } = useToast();
	const { resumeTrainingText, title, message, newTrainingText } = usePauseWarningContent();
	const [deletedWorkoutId, setDeletedWorkoutId] = useState<WorkoutId | undefined>(undefined);

	const handleCreateWorkout = useCallback(() => {
		dispatch(createNewWorkout());
		navigate("create");
	}, [dispatch, navigate]);

	const confirmIcon = useMemo((): { name: "plus"; size: number } => ({ name: "plus", size: 40 }), []);

	const onEdit = useCallback(
		(workoutId: WorkoutId) => {
			dispatch(setEditedWorkout({ workoutId }));
			navigate("create");
		},
		[dispatch, navigate],
	);

	const confirmWorkoutDeletion = useCallback(() => {
		if (deletedWorkoutId) {
			dispatch(removeWorkout(deletedWorkoutId));
			closeDeleteWarning();
			if (showToast && toastRef.current) {
				toastRef.current.restart();
			} else {
				openToast();
			}
		}
	}, [closeDeleteWarning, deletedWorkoutId, dispatch, openToast, showToast, toastRef]);

	const onDelete = useCallback(
		(workoutId: WorkoutId) => {
			setDeletedWorkoutId(workoutId);
			openDeleteWarning();
		},
		[openDeleteWarning],
	);

	const handleStartWorkout = useCallback(
		(workoutId?: WorkoutId) => {
			if (workoutId === undefined && newWorkoutId !== undefined) {
				dispatch(startWorkout(newWorkoutId));
			} else if (workoutId !== undefined) {
				dispatch(startWorkout(workoutId));
			} else {
				navigate("workouts");
				return;
			}
			navigate("train");
		},
		[dispatch, navigate, newWorkoutId],
	);

	const handleStartWorkoutCases = useCallback(
		(workoutId: WorkoutId) => {
			if (trainedWorkout) {
				openBottomSheet();
				setNewWorkoutId(workoutId);
				return;
			}
			handleStartWorkout(workoutId);
		},
		[handleStartWorkout, openBottomSheet, trainedWorkout],
	);

	const handleConfirmResume = useCallback(() => {
		dispatch(resumeTrainedWorkout());
		navigate("train");
		closeBottomSheet();
	}, [closeBottomSheet, dispatch, navigate]);

	const handleConfirmOverwrite = useCallback(() => {
		handleStartWorkout();
		closeBottomSheet();
	}, [closeBottomSheet, handleStartWorkout]);

	const handleRecoverWorkout = useCallback(() => {
		dispatch(recoverWorkout());
		closeToast();
	}, [closeToast, dispatch]);

	const mappedWorkouts = useMemo(
		() =>
			filteredWorkouts.map(({ name, workoutId }) => (
				<Swipeable
					key={name.concat(workoutId?.toString())}
					onClick={() => handleStartWorkoutCases(workoutId)}
					onDelete={() => onDelete(workoutId)}
					onEdit={() => onEdit(workoutId)}
				>
					<RenderedWorkout workoutId={workoutId} />
				</Swipeable>
			)),
		[filteredWorkouts, handleStartWorkoutCases, onDelete, onEdit],
	);

	const handleSetSearchedWorkouts = useCallback(
		(searchString?: string) => {
			dispatch(setSearchedWorkout(searchString));
		},
		[dispatch],
	);

	return (
		<ThemedView stretch background>
			<SiteNavigationButtons
				titleFontSize={40}
				title={t(TranslationKeys.WORKOUTS)}
				handleConfirmIcon={confirmIcon}
				confirmButtonDisabled={!isAllowedToCreateWorkout}
				handleConfirm={handleCreateWorkout}
			/>
			{numberOfWorkouts > 1 && (
				<PageContent ghost>
					<HStack ghost style={trainStyles.searchAndFilterBar}>
						<Sorting type="Workout" />
						<ExpandableSearchbar handleSetSearchManual={handleSetSearchedWorkouts} />
					</HStack>
				</PageContent>
			)}
			<PageContent scrollable background ignoreGap stretch>
				<ThemedView stretch ghost style={trainStyles.workoutWrapper}>
					{mappedWorkouts}
				</ThemedView>
				<RemainingWorkoutsText />
			</PageContent>
			<BottomToast
				reference={toastRef}
				bottom={5}
				onRequestClose={closeToast}
				open={showToast}
				messageKey={TranslationKeys.UNDO_MESSAGE}
				titleKey={TranslationKeys.WORKOUT_DELETED_TITLE}
				onRedo={handleRecoverWorkout}
			/>
			<ThemedBottomSheetModal title={title} ref={ref}>
				<PageContent paddingTop={20} stretch ghost>
					<AnswerText>{message}</AnswerText>
				</PageContent>
				<PageContent ghost paddingTop={20}>
					{isOngoingWorkout && (
						<ThemedPressable round onPress={handleConfirmResume}>
							<HStack style={trainStyles.confirmOverwriteWrapper} round center>
								<ThemedMaterialCommunityIcons ghost name="play" size={24} />
								<Text center ghost style={trainStyles.button}>
									{resumeTrainingText}
								</Text>
							</HStack>
						</ThemedPressable>
					)}
					<ThemedPressable round onPress={handleConfirmOverwrite}>
						<HStack style={trainStyles.confirmOverwriteWrapper} round center>
							<ThemedMaterialCommunityIcons ghost name="restart" size={24} />
							<Text center ghost style={trainStyles.button}>
								{newTrainingText}
							</Text>
						</HStack>
					</ThemedPressable>
				</PageContent>
			</ThemedBottomSheetModal>
			<ThemedBottomSheetModal title={t(TranslationKeys.ALERT_DELETE_WORKOUT_TITLE)} ref={deleteWarningRef}>
				<PageContent paddingTop={20} stretch ghost>
					<AnswerText>{t(TranslationKeys.ALERT_DELETE_WORKOUT_CONTENT)}</AnswerText>
				</PageContent>
				<PageContent ghost paddingTop={20}>
					<ThemedPressable style={trainStyles.deleteButtonWrapper} round onPress={confirmWorkoutDeletion}>
						<HStack style={trainStyles.confirmOverwriteWrapper} round center>
							<ThemedMaterialCommunityIcons ghost name="delete" size={24} />
							<Text center ghost style={trainStyles.button}>
								{t(TranslationKeys.ALERT_WORKOUT_DELETE_CONFIRM)}
							</Text>
						</HStack>
					</ThemedPressable>
				</PageContent>
			</ThemedBottomSheetModal>
			<WorkoutCompleteModal />
		</ThemedView>
	);
}
