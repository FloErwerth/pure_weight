import { Text } from "../../../components/Themed/ThemedText/Text";
import React, { useCallback, useMemo } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../../store";
import { AddButton } from "../../../components/AddButton/AddButton";
import { styles } from "../../../components/App/create/styles";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PressableRowWithIconSlots } from "../../../components/PressableRowWithIconSlots/PressableRowWithIconSlots";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { NotificationFeedbackType } from "expo-haptics";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { useTranslation } from "react-i18next";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { ThemedTextInput } from "../../../components/Themed/ThemedTextInput/ThemedTextInput";
import { cleanErrors, setError } from "../../../store/reducers/errors";
import {
    createNewExercise,
    deleteExerciseFromEditedWorkout,
    recoverExercise,
    saveEditedExercise,
    saveEditedWorkout,
    setEditedExercise,
    setEditedWorkoutName,
    sortExercisesOnDragEnd,
} from "../../../store/reducers/workout";

import { getEditedWorkout, getIsEditedWorkout } from "../../../store/reducers/workout/workoutSelectors";
import { ExerciseMetaData } from "../../../store/reducers/workout/types";
import { BottomToast } from "../../../components/BottomToast/BottomToast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { ThemedMaterialCommunityIcons } from "../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { useToast } from "../../../components/BottomToast/useToast";
import { AnswerText } from "../../../components/HelpQuestionAnswer/AnswerText";

type MappedExercises = {
    onDelete: () => void;
    handleCancel: () => void;
    onEdit: () => void;
    exercise: ExerciseMetaData;
    index: number;
    handleOnConfirmEdit: (exercise: ExerciseMetaData) => void;
};
type RenderedItem = { index: number; exercise: ExerciseMetaData; onEdit: () => void; onDelete: () => void };

const useValidateWorkout = () => {
    const dispatch = useAppDispatch();
    const editedWorkout = useAppSelector(getEditedWorkout);

    return useCallback(() => {
        let isValid = true;
        if (!editedWorkout?.workout.name || editedWorkout.workout.exercises.length === 0) {
            isValid = false;
            if (!editedWorkout?.workout.name) {
                dispatch(setError(["create_workout_name"]));
            }
            if (editedWorkout?.workout.exercises.length === 0) {
                dispatch(setError(["create_exercises_empty"]));
            }
        }
        return isValid;
    }, [dispatch, editedWorkout?.workout.exercises.length, editedWorkout?.workout.name]);
};

export const Create = () => {
    const navigate = useNavigate();
    const { bottom } = useSafeAreaInsets();
    const { t } = useTranslation();
    const editedWorkout = useAppSelector(getEditedWorkout);
    const isEditedWorkout = useAppSelector(getIsEditedWorkout);
    const title = useMemo(() => (isEditedWorkout ? t("edit_workout") : t("create_workout")), [isEditedWorkout, t]);
    const dispatch = useAppDispatch();
    const { ref: alertRef, openBottomSheet: openAlert, closeBottomSheet: closeAlert } = useBottomSheetRef();
    const { toastRef, openToast, closeToast, showToast } = useToast();
    const getIsValidWorkout = useValidateWorkout();

    const handleSetWorkoutName = useCallback(
        (value?: string) => {
            dispatch(setEditedWorkoutName(value));
        },
        [dispatch],
    );

    const handleAddExercise = useCallback(() => {
        dispatch(createNewExercise());
        navigate("workouts/create/exercise");
    }, [dispatch, navigate]);

    const handleCleanErrors = useCallback(() => {
        dispatch(cleanErrors());
    }, [dispatch]);

    const handleDeleteWorkout = useCallback(() => {
        closeAlert();
        handleCleanErrors();
        navigate("workouts");
    }, [closeAlert, handleCleanErrors, navigate]);

    const mappedExercises = useMemo(() => {
        return (
            editedWorkout?.workout.exercises?.map((exercise, index) => {
                const onEdit = () => {
                    void Haptics.selectionAsync();
                    dispatch(
                        setEditedExercise({
                            exerciseId: exercise.exerciseId,
                        }),
                    );
                    navigate("workouts/create/exercise", { to: "workouts/create" });
                };

                const handleDelete = () => {
                    void Haptics.notificationAsync(NotificationFeedbackType.Success);
                    dispatch(deleteExerciseFromEditedWorkout(index));
                    if (showToast && toastRef.current) {
                        toastRef.current.restart();
                    } else {
                        openToast();
                    }
                };

                const handleOnConfirmEdit = () => {
                    dispatch(saveEditedExercise());
                    dispatch(setEditedExercise(undefined));
                };

                const handleCancel = () => {
                    closeAlert();
                    dispatch(setEditedExercise(undefined));
                };
                return { onDelete: handleDelete, handleCancel, onEdit, exercise, index, handleOnConfirmEdit };
            }) ?? []
        );
    }, [editedWorkout?.workout.exercises, dispatch, navigate, showToast, toastRef, openToast, closeAlert]);

    const handleNavigateHome = useCallback(() => {
        handleCleanErrors();
        navigate("workouts");
    }, [handleCleanErrors, navigate]);

    const handleSaveWorkout = useCallback(() => {
        if (!getIsValidWorkout()) {
            return;
        }
        if (editedWorkout) {
            dispatch(saveEditedWorkout());
        }
        handleNavigateHome();
    }, [getIsValidWorkout, editedWorkout, handleNavigateHome, dispatch]);

    const handleBackButton = useCallback(() => {
        if (editedWorkout?.workout.exercises.length !== 0 || editedWorkout.workout.name.length !== 0) {
            openAlert();
        } else {
            handleNavigateHome();
        }
    }, [editedWorkout?.workout.exercises.length, editedWorkout?.workout.name, handleNavigateHome, openAlert]);

    const handleOnDragEnd = useCallback(
        ({ data }: { data: MappedExercises[] }) => {
            const newExercises = data.map((dataPoint) => dataPoint.exercise);
            dispatch(sortExercisesOnDragEnd(newExercises));
        },
        [dispatch],
    );

    const renderItem = useCallback(
        ({ drag, item: { index, exercise, onEdit, onDelete } }: RenderItemParams<RenderedItem>) => (
            <ScaleDecorator activeScale={0.95}>
                <View style={{ marginBottom: 10 }}>
                    <PressableRowWithIconSlots
                        onClick={onEdit}
                        key={exercise.name.concat(index.toString())}
                        Icon1={{ icon: "delete", onPress: onDelete }}
                        Icon2={(editedWorkout?.workout.exercises?.length ?? 0) > 1 ? { icon: "drag", onLongPress: drag } : undefined}>
                        <Text style={styles.text}>{exercise.name}</Text>
                    </PressableRowWithIconSlots>
                </View>
            </ScaleDecorator>
        ),
        [editedWorkout?.workout.exercises?.length],
    );

    const handleRecoverExercise = useCallback(() => {
        dispatch(recoverExercise());
    }, [dispatch]);

    const confirmButtonConfig = useMemo(
        () =>
            ({
                localeKey: isEditedWorkout ? "alert_edit_confirm_cancel" : "alert_create_confirm_cancel",
                onPress: handleDeleteWorkout,
            }) as const,
        [handleDeleteWorkout, isEditedWorkout],
    );

    const alertContent = useMemo(
        () => t(isEditedWorkout ? "alert_edit_workout_discard_content" : "alert_create_workout_discard_content"),
        [t, isEditedWorkout],
    );
    const alertTitle = useMemo(() => t(isEditedWorkout ? "alert_edit_discard_title" : "alert_create_discard_title"), [t, isEditedWorkout]);

    return (
        <ThemedView stretch>
            <ThemedView background style={styles.innerWrapper}>
                <SiteNavigationButtons
                    backButtonAction={handleBackButton}
                    handleConfirm={handleSaveWorkout}
                    titleFontSize={30}
                    title={title}
                />
                <PageContent background safeBottom stretch style={styles.contentWrapper}>
                    <ThemedTextInput
                        style={styles.workoutNameInput}
                        errorKey="create_workout_name"
                        showClear
                        value={editedWorkout?.workout.name}
                        onChangeText={handleSetWorkoutName}
                        placeholder={t("workout_name")}
                    />
                    <View style={styles.listContainer}>
                        {mappedExercises?.length > 0 && (
                            <DraggableFlatList
                                scrollsToTop
                                removeClippedSubviews
                                keyboardShouldPersistTaps="handled"
                                keyExtractor={(item) => `${item.index}${item.exercise.name}${item.exercise.pause}`}
                                data={mappedExercises}
                                onDragEnd={handleOnDragEnd}
                                renderItem={renderItem}
                            />
                        )}
                    </View>
                    <BottomToast
                        reference={toastRef}
                        topCorrection={30}
                        leftCorrection={-20}
                        bottom={bottom}
                        padding={40}
                        onRequestClose={closeToast}
                        open={showToast}
                        messageKey={"undo_message"}
                        titleKey={"exercise_deleted_title"}
                        onRedo={handleRecoverExercise}
                    />
                    <AddButton onPress={handleAddExercise} />
                </PageContent>
            </ThemedView>
            <ThemedBottomSheetModal title={alertTitle} ref={alertRef}>
                <PageContent stretch ghost>
                    <AnswerText>{alertContent}</AnswerText>
                </PageContent>
                <PageContent ghost paddingTop={30}>
                    <ThemedView ghost style={{ gap: 10 }}>
                        <ThemedPressable round padding secondary onPress={confirmButtonConfig.onPress}>
                            <HStack ghost style={{ alignItems: "center", gap: 10 }}>
                                <ThemedMaterialCommunityIcons ghost name={"delete"} size={24} />
                                <Text ghost>{t(confirmButtonConfig.localeKey)}</Text>
                            </HStack>
                        </ThemedPressable>
                    </ThemedView>
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
