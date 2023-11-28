import { Text } from "../../../components/Themed/ThemedText/Text";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { ExerciseMetaData } from "../../../store/types";
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
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedButtomSheetModal";
import { AddExerciseModal } from "../../../components/AddExerciseModal/AddExerciseModal";
import { emptyWeightbasedExercise } from "../../../components/App/create/context";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { useColor, useColorPickerComponents } from "../../../components/ColorPickerWithModal/ColorPickerWithModal";
import { ThemedTextInput } from "../../../components/Themed/ThemedTextInput/ThemedTextInput";
import { cleanErrors, setError } from "../../../store/reducers/errors";
import { addWorkout, editWorkout, overwriteExercise } from "../../../store/reducers/workout";

import { getEditedWorkout } from "../../../store/reducers/workout/workoutSelectors";

function getAreValuesEmpty(exercise: ExerciseMetaData) {
    const values = Object.values(exercise);
    return values.every((value) => {
        if (typeof value === "object") {
            return true;
        }
        return !value;
    });
}

type MappedExercises = {
    onDelete: () => void;
    edited: boolean;
    handleCancel: () => void;
    onEdit: () => void;
    exercise: ExerciseMetaData;
    index: number;
    handleOnConfirmEdit: (exercise: ExerciseMetaData) => void;
};

export function Create() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [alertConfig, setAlertConfig] = useState<AlertConfig | undefined>(undefined);
    const editedWorkout = useAppSelector(getEditedWorkout);
    const title = useMemo(() => (editedWorkout ? t("edit_workout") : t("create_workout")), [editedWorkout, t]);
    const [editedExercise, setEditedExercise] = useState<ExerciseMetaData>(emptyWeightbasedExercise);
    const [editedExerciseIndex, setEditedExerciseIndex] = useState<number | undefined>(undefined);
    const [workoutName, setWorkoutName] = useState(editedWorkout?.workout.name);
    const [createdExercises, setCreatedExercises] = useState<ExerciseMetaData[]>(editedWorkout?.workout.exercises.map((exercise) => exercise) ?? []);
    const dispatch = useAppDispatch();
    const [alertRef, openAlert, closeAlert] = useBottomSheetRef();
    const [addRef, openAdd, closeAdd] = useBottomSheetRef();
    const initialColor = useColor(editedWorkout?.workout.calendarColor);
    const [PickerModal, PickerButton, color] = useColorPickerComponents(initialColor);

    useEffect(() => {
        setWorkoutName(editedWorkout?.workout.name);
        setCreatedExercises(editedWorkout?.workout.exercises ?? []);
    }, [editedWorkout]);

    const handleSetWorkoutName = useCallback((value?: string) => {
        setWorkoutName(value);
    }, []);

    const handleAddExercise = useCallback(() => {
        setEditedExercise(emptyWeightbasedExercise);
        setEditedExerciseIndex(undefined);
        addRef.current?.present();
    }, [addRef]);

    const handleDeleteExercise = useCallback(
        (index: number) => {
            const newExercises = [...createdExercises];
            newExercises.splice(index, 1);
            setCreatedExercises(newExercises);
        },
        [createdExercises],
    );

    const handleConfirmExerciseModal = useCallback(() => {
        if (editedExercise) {
            if (editedExerciseIndex !== undefined) {
                const newExercises = [...createdExercises];
                newExercises.splice(editedExerciseIndex, 1, editedExercise);
                setCreatedExercises(newExercises);
            } else {
                setCreatedExercises([...createdExercises, editedExercise]);
                setEditedExerciseIndex(createdExercises.length);
            }
        }
        setEditedExerciseIndex(undefined);
        addRef.current?.close();
    }, [addRef, createdExercises, editedExercise, editedExerciseIndex]);

    const handleCleanErrors = useCallback(() => {
        dispatch(cleanErrors());
    }, [dispatch]);

    const handleConfirmDiscardChanges = useCallback(() => {
        closeAlert();
        handleCleanErrors();
        navigate("workouts");
    }, [closeAlert, handleCleanErrors, navigate]);

    const mappedExercises = useMemo(() => {
        return createdExercises.map((exercise, index) => {
            const onEdit = () => {
                void Haptics.selectionAsync();
                setEditedExerciseIndex(index);
                setEditedExercise(createdExercises[index]);
                console.log(createdExercises[index]);
                openAdd();
            };

            const handleConfirmDelete = () => {
                void Haptics.notificationAsync(NotificationFeedbackType.Success);
                handleDeleteExercise(index);
                closeAlert();
            };

            const handleOnConfirmEdit = (exercise: ExerciseMetaData) => {
                if (exercise.type === "WEIGHT_BASED") {
                    if (exercise.sets && exercise.name && exercise.weight && exercise.reps) {
                        const newExercises = [...createdExercises];
                        newExercises.splice(index, 1, exercise);
                        setCreatedExercises(newExercises);
                        setEditedExerciseIndex(undefined);
                        closeAdd();
                    }
                }
            };

            const handleCancel = () => {
                if (getAreValuesEmpty(createdExercises[index])) {
                    const newExercises = [...createdExercises];
                    newExercises.splice(index, 1);
                    setCreatedExercises(newExercises);
                }
                setEditedExerciseIndex(undefined);
                closeAlert();
            };

            const onDelete = () => {
                setAlertConfig({
                    title: t("alert_delete_title"),
                    content: t("alert_delete_message"),
                    onConfirm: handleConfirmDelete,
                });
                openAlert();
            };
            const edited = index === editedExerciseIndex;

            return { onDelete, edited, handleCancel, onEdit, exercise, index, handleOnConfirmEdit };
        });
    }, [closeAdd, closeAlert, createdExercises, editedExerciseIndex, handleDeleteExercise, openAdd, openAlert, t]);

    const handleNavigateHome = useCallback(() => {
        handleCleanErrors();
        setAlertConfig(undefined);
        setEditedExerciseIndex(undefined);
        navigate("workouts");
    }, [handleCleanErrors, navigate]);

    const handleConfirm = useCallback(() => {
        if (createdExercises.length === 0 && !workoutName) {
            handleNavigateHome();
            return;
        }
        if (workoutName?.length === 0 || createdExercises.length === 0) {
            if (workoutName?.length === 0) {
                dispatch(setError(["workout_name"]));
            }
            if (createdExercises.length === 0) {
                dispatch(setError(["create_exercises_empty"]));
            }
            return;
        }
        if (editedWorkout) {
            dispatch(editWorkout({ name: workoutName ?? editedWorkout.workout.name, exercises: createdExercises, color }));
        } else {
            dispatch(addWorkout({ name: workoutName ?? "", exercises: createdExercises, color }));
        }
        handleNavigateHome();
    }, [createdExercises, workoutName, editedWorkout, handleNavigateHome, dispatch, color]);

    const handleBackButton = useCallback(() => {
        if (createdExercises.length === 0 && !workoutName) {
            handleNavigateHome();
        } else if (createdExercises.length !== 0 || workoutName?.length !== 0) {
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
    }, [alertRef, createdExercises.length, editedWorkout, handleConfirmDiscardChanges, handleNavigateHome, t, workoutName]);

    const handleOnDragEnd = useCallback(
        ({ data }: { data: MappedExercises[] }) => {
            const newExercises = data.map((dataPoint) => dataPoint.exercise);
            setCreatedExercises(newExercises);
            dispatch(overwriteExercise(newExercises));
        },
        [dispatch],
    );

    const handleEditExercise = useCallback(
        (field: keyof ExerciseMetaData, value: string) => {
            const exercise = { ...editedExercise, [field]: value };
            setEditedExercise(exercise);
        },
        [editedExercise],
    );

    return (
        <>
            <ThemedView background style={styles.innerWrapper}>
                <SiteNavigationButtons handleBack={handleBackButton} handleConfirm={handleConfirm} titleFontSize={30} title={title} />
                <PageContent style={styles.contentWrapper}>
                    <HStack style={styles.nameColorStack} ghost>
                        <ThemedTextInput
                            style={styles.workoutNameInput}
                            showClear
                            value={workoutName}
                            onChangeText={handleSetWorkoutName}
                            placeholder={t("workout_name")}
                        />
                        <PickerButton />
                    </HStack>
                    <View style={styles.listContainer}>
                        {mappedExercises.length > 0 ? (
                            <DraggableFlatList
                                scrollsToTop
                                removeClippedSubviews
                                keyboardShouldPersistTaps="handled"
                                keyExtractor={(item) => `${item.index}${item.exercise.name}${item.exercise.pause}`}
                                data={mappedExercises}
                                onDragEnd={handleOnDragEnd}
                                renderItem={({ drag, item: { index, exercise, onEdit, onDelete } }) => (
                                    <ScaleDecorator activeScale={0.95}>
                                        <View style={{ marginBottom: 10 }}>
                                            <PressableRowWithIconSlots
                                                onClick={onEdit}
                                                key={exercise.name.concat(index.toString())}
                                                Icon1={{ icon: "delete", onPress: onDelete }}
                                                Icon2={mappedExercises.length > 1 ? { icon: "drag", onLongPress: drag } : undefined}
                                            >
                                                <Text style={styles.text}>{exercise.name}</Text>
                                            </PressableRowWithIconSlots>
                                        </View>
                                    </ScaleDecorator>
                                )}
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
            <AlertModal
                reference={alertRef}
                onConfirm={alertConfig?.onConfirm}
                title={alertConfig?.title}
                content={alertConfig?.content}
                onCancel={closeAlert}
            />
            <AddExerciseModal
                isEditingExercise={editedExerciseIndex !== undefined}
                handleEditExercise={handleEditExercise}
                editedExercise={editedExercise}
                reference={addRef}
                onConfirmEdit={handleConfirmExerciseModal}
            />
            <PickerModal />
        </>
    );
}
