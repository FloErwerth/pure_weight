import { Text } from "../../../components/Themed/ThemedText/Text";
import React, { useCallback, useMemo, useState } from "react";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { ColorPickerButton, ColorPickerModal } from "../../../components/ColorPickerWithModal/ColorPickerWithModal";
import { ThemedTextInput } from "../../../components/Themed/ThemedTextInput/ThemedTextInput";
import { cleanErrors, setError } from "../../../store/reducers/errors";
import {
    createNewExercise,
    deleteExerciseFromEditedWorkout,
    recoverExercise,
    saveEditedWorkout,
    setEditedExercise,
    setEditedWorkoutName,
    sortExercisesOnDragEnd,
    storeEditedExercise,
} from "../../../store/reducers/workout";

import { getEditedWorkout, getIsEditedWorkout } from "../../../store/reducers/workout/workoutSelectors";
import { EditableExerciseModal } from "../../../components/EditableExerciseModal/EditableExerciseModal";
import { ExerciseMetaData } from "../../../store/reducers/workout/types";
import { BottomToast } from "../../../components/BottomToast/BottomToast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { ThemedMaterialCommunityIcons } from "../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";

type MappedExercises = {
    onDelete: () => void;
    handleCancel: () => void;
    onEdit: () => void;
    exercise: ExerciseMetaData;
    index: number;
    handleOnConfirmEdit: (exercise: ExerciseMetaData) => void;
};
type RenderedItem = { index: number; exercise: ExerciseMetaData; onEdit: () => void; onDelete: () => void };
export function Create() {
    const navigate = useNavigate();
    const { bottom } = useSafeAreaInsets();
    const { t } = useTranslation();
    const editedWorkout = useAppSelector(getEditedWorkout);
    const isEditedWorkout = useAppSelector(getIsEditedWorkout);
    const title = useMemo(() => (isEditedWorkout ? t("edit_workout") : t("create_workout")), [isEditedWorkout, t]);
    const dispatch = useAppDispatch();
    const [alertRef, open, closeAlert] = useBottomSheetRef();
    const [addRef, openAdd, closeAdd] = useBottomSheetRef();
    const [colorPickerRef, openPicker] = useBottomSheetRef();
    const [showToast, setShowToast] = useState(false);

    const handleSetWorkoutName = useCallback(
        (value?: string) => {
            dispatch(setEditedWorkoutName(value));
        },
        [dispatch],
    );

    const handleAddExercise = useCallback(() => {
        dispatch(createNewExercise());
        openAdd();
    }, [addRef, dispatch]);

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
                            exercise,
                            index,
                        }),
                    );
                    openAdd();
                };

                const handleDelete = () => {
                    void Haptics.notificationAsync(NotificationFeedbackType.Success);
                    dispatch(deleteExerciseFromEditedWorkout(index));
                    setShowToast(true);
                };

                const handleOnConfirmEdit = () => {
                    dispatch(storeEditedExercise());
                    dispatch(setEditedExercise(undefined));
                    closeAdd();
                };

                const handleCancel = () => {
                    closeAlert();
                    dispatch(setEditedExercise(undefined));
                };
                return { onDelete: handleDelete, handleCancel, onEdit, exercise, index, handleOnConfirmEdit };
            }) ?? []
        );
    }, [closeAdd, closeAlert, dispatch, editedWorkout?.workout.exercises, openAdd]);

    const handleNavigateHome = useCallback(() => {
        handleCleanErrors();
        navigate("workouts");
    }, [dispatch, handleCleanErrors, navigate]);

    const handleSaveWorkout = useCallback(() => {
        if (!editedWorkout?.workout?.name || editedWorkout.workout.exercises.length === 0) {
            if (!editedWorkout?.workout.name) {
                dispatch(setError(["workout_name"]));
            }
            if (editedWorkout?.workout.exercises.length === 0) {
                dispatch(setError(["create_exercises_empty"]));
            }
            return;
        }
        if (editedWorkout) {
            dispatch(saveEditedWorkout());
        }
        handleNavigateHome();
    }, [editedWorkout, handleNavigateHome, dispatch]);

    const handleBackButton = useCallback(() => {
        if (editedWorkout?.workout.exercises.length === 0) {
            handleNavigateHome();
        } else if (editedWorkout?.workout.exercises.length !== 0 || editedWorkout.workout.name) {
            open();
        } else {
            handleNavigateHome();
        }
    }, [editedWorkout?.workout.exercises.length, editedWorkout?.workout.name, handleNavigateHome, open]);

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
                        Icon2={(editedWorkout?.workout.exercises?.length ?? 0) > 1 ? { icon: "drag", onLongPress: drag } : undefined}
                    >
                        <Text style={styles.text}>{exercise.name}</Text>
                    </PressableRowWithIconSlots>
                </View>
            </ScaleDecorator>
        ),
        [editedWorkout?.workout.exercises?.length],
    );

    const handleRecoverExercise = useCallback(() => {
        dispatch(recoverExercise());
        setShowToast(false);
    }, [dispatch]);

    const confirmButtonConfig = useMemo(
        () => ({ localeKey: isEditedWorkout ? "alert_edit_workout_confirm_cancel" : "alert_create_workout_confirm_cancel", onPress: handleDeleteWorkout }) as const,
        [handleDeleteWorkout, isEditedWorkout],
    );

    const alertContent = useMemo(() => t(isEditedWorkout ? "alert_edit_workout_discard_content" : "alert_create_workout_discard_content"), [t, isEditedWorkout]);
    const alertTitle = useMemo(() => t(isEditedWorkout ? "alert_edit_workout_discard_title" : "alert_create_workout_discard_title"), [t, isEditedWorkout]);

    return (
        <ThemedView stretch>
            <ThemedView background style={styles.innerWrapper}>
                <SiteNavigationButtons handleBack={handleBackButton} handleConfirm={handleSaveWorkout} titleFontSize={30} title={title} />
                <PageContent background safeBottom stretch style={styles.contentWrapper}>
                    <HStack style={styles.nameColorStack} ghost>
                        <ThemedTextInput style={styles.workoutNameInput} showClear value={editedWorkout?.workout.name} onChangeText={handleSetWorkoutName} placeholder={t("workout_name")} />
                        <ColorPickerButton openPicker={openPicker} />
                    </HStack>
                    <View style={styles.listContainer}>
                        {mappedExercises?.length > 0 ? (
                            <DraggableFlatList
                                scrollsToTop
                                removeClippedSubviews
                                keyboardShouldPersistTaps="handled"
                                keyExtractor={(item) => `${item.index}${item.exercise.name}${item.exercise.pause}`}
                                data={mappedExercises}
                                onDragEnd={handleOnDragEnd}
                                renderItem={renderItem}
                            />
                        ) : (
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <MaterialCommunityIcons style={{ alignSelf: "center" }} name="clipboard-search-outline" size={256} color="#444" />
                            </View>
                        )}
                    </View>
                    <AddButton onPress={handleAddExercise} />
                </PageContent>
            </ThemedView>
            <BottomToast
                bottom={bottom}
                padding={40}
                onRequestClose={() => setShowToast(false)}
                open={showToast}
                messageKey={"undo_message"}
                titleKey={"exercise_deleted_title"}
                onRedo={handleRecoverExercise}
            />
            <ThemedBottomSheetModal snapPoints={["35%"]} title={alertTitle} ref={alertRef}>
                <PageContent stretch paddingTop={20} ghost>
                    <Text style={{ fontSize: 20 }} stretch ghost>
                        {alertContent}
                    </Text>
                    <ThemedView ghost style={{ gap: 10, marginBottom: 20 }}>
                        <ThemedPressable round padding secondary onPress={confirmButtonConfig.onPress}>
                            <HStack ghost style={{ alignItems: "center", gap: 10 }}>
                                <ThemedMaterialCommunityIcons name={"delete"} size={24} />
                                <Text>{t(confirmButtonConfig.localeKey)}</Text>
                            </HStack>
                        </ThemedPressable>
                    </ThemedView>
                </PageContent>
            </ThemedBottomSheetModal>
            <EditableExerciseModal reference={addRef} />
            <ColorPickerModal reference={colorPickerRef} />
        </ThemedView>
    );
}
