import { Text } from "../../../components/Themed/ThemedText/Text";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../../store";
import { AddButton } from "../../../components/AddButton/AddButton";
import { styles } from "../../../components/App/create/styles";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PressableRowWithIconSlots } from "../../../components/PressableRowWithIconSlots/PressableRowWithIconSlots";
import { AlertConfig, AlertModal } from "../../../components/AlertModal/AlertModal";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { NotificationFeedbackType } from "expo-haptics";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
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

import { getEditedWorkout } from "../../../store/reducers/workout/workoutSelectors";
import { EditableExerciseModal } from "../../../components/EditableExerciseModal/EditableExerciseModal";
import { ExerciseMetaData } from "../../../store/reducers/workout/types";
import { BottomToast } from "../../../components/BottomToast/BottomToast";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    const [alertConfig, setAlertConfig] = useState<AlertConfig | undefined>(undefined);
    const editedWorkout = useAppSelector(getEditedWorkout);
    const title = useMemo(() => (editedWorkout ? t("edit_workout") : t("create_workout")), [editedWorkout, t]);
    const dispatch = useAppDispatch();
    const [alertRef, _, closeAlert] = useBottomSheetRef();
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
        addRef.current?.present();
    }, [addRef, dispatch]);

    const handleCleanErrors = useCallback(() => {
        dispatch(cleanErrors());
    }, [dispatch]);

    const handleConfirmDiscardChanges = useCallback(() => {
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
        setAlertConfig(undefined);
        dispatch(setEditedExercise(undefined));
        navigate("workouts");
    }, [dispatch, handleCleanErrors, navigate]);

    const handleConfirm = useCallback(() => {
        if (!editedWorkout?.workout.name || editedWorkout.workout.exercises.length === 0) {
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
            const title = t(editedWorkout ? "alert_edit_workout_discard_title" : "alert_create_workout_discard_title");
            const content = t(editedWorkout ? "alert_edit_workout_discard_content" : "alert_create_workout_discard_content");
            setAlertConfig({
                title,
                content,
                onConfirm: handleConfirmDiscardChanges,
            });
            alertRef.current?.present();
        } else {
            handleNavigateHome();
        }
    }, [alertRef, editedWorkout, handleConfirmDiscardChanges, handleNavigateHome, t]);

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

    return (
        <ThemedView stretch>
            <ThemedView background style={styles.innerWrapper}>
                <SiteNavigationButtons handleBack={handleBackButton} handleConfirm={handleConfirm} titleFontSize={30} title={title} />
                <PageContent safeBottom stretch style={styles.contentWrapper}>
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
            <AlertModal reference={alertRef} onConfirm={alertConfig?.onConfirm} title={alertConfig?.title} content={alertConfig?.content} onCancel={closeAlert} />
            <EditableExerciseModal reference={addRef} />
            <ColorPickerModal reference={colorPickerRef} />
        </ThemedView>
    );
}
