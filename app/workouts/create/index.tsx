import { Text } from "../../../components/Themed/ThemedText/Text";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { ExerciseMetaData, ExerciseMetaDataWithDoneEntries } from "../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../store";
import { addTrainingDay, cleanErrors, editTrainingDay, overwriteTrainingDayExercises, setError, setTrainingDayIndex } from "../../../store/reducer";
import { AddButton } from "../../../components/AddButton/AddButton";
import { styles } from "../../../components/App/create/styles";
import { PlainInput } from "../../../components/PlainInput/PlainInput";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PressableRowWithIconSlots } from "../../../components/PressableRowWithIconSlots/PressableRowWithIconSlots";
import { AlertConfig, AlertModal } from "../../../components/AlertModal/AlertModal";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { NotificationFeedbackType } from "expo-haptics";
import { getSelectedTrainingDay } from "../../../store/selectors";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedButtomSheetModal";
import { AddExerciseModal } from "../../../components/AddExerciseModal/AddExerciseModal";
import { EditedExercise, emptyExercise } from "../../../components/App/create/context";

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
  const editedDay = useAppSelector(getSelectedTrainingDay);
  const title = useMemo(() => (editedDay ? t("edit_workout") : t("create_workout")), [editedDay, t]);
  const [editedExercise, setEditedExercise] = useState<EditedExercise>(emptyExercise);
  const [editedExerciseIndex, setEditedExerciseIndex] = useState<number | undefined>(undefined);
  const [workoutName, setWorkoutName] = useState(editedDay?.name);
  const [createdExercises, setCreatedExercises] = useState<ExerciseMetaDataWithDoneEntries>(editedDay?.exercises.map((exercise) => exercise) ?? []);
  const dispatch = useAppDispatch();
  const [alertRef] = useBottomSheetRef();
  const [addRef] = useBottomSheetRef();

  useEffect(() => {
    setWorkoutName(editedDay?.name);
    setCreatedExercises(editedDay?.exercises ?? []);
  }, [editedDay]);

  const handleSetWorkoutName = useCallback((value?: string) => {
    setWorkoutName(value);
  }, []);

  const handleAddExercise = useCallback(() => {
    setEditedExercise(emptyExercise);
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

  const closeAlert = useCallback(() => {
    alertRef.current?.close();
  }, [alertRef]);

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
        addRef.current?.present();
      };

      const handleConfirmDelete = () => {
        void Haptics.notificationAsync(NotificationFeedbackType.Success);
        handleDeleteExercise(index);
        closeAlert();
      };

      const handleOnConfirmEdit = (exercise: ExerciseMetaData) => {
        if (exercise.sets && exercise.name && exercise.weight && exercise.reps) {
          const newExercises = [...createdExercises];
          newExercises.splice(index, 1, { doneExerciseEntries: createdExercises[index].doneExerciseEntries, ...exercise });
          setCreatedExercises(newExercises);
          setEditedExerciseIndex(undefined);
          addRef.current?.close();
        }
      };

      const handleCancel = () => {
        if (getAreValuesEmpty(createdExercises[index])) {
          const newExercises = [...createdExercises];
          newExercises.splice(index, 1);
          setCreatedExercises(newExercises);
        }
        setEditedExerciseIndex(undefined);
        addRef.current?.close();
      };

      const onDelete = () => {
        setAlertConfig({ title: t("alert_delete_title"), content: t("alert_delete_message"), onConfirm: handleConfirmDelete, onCancel: handleConfirmDiscardChanges });
        alertRef.current?.present();
      };
      const edited = index === editedExerciseIndex;

      return { onDelete, edited, handleCancel, onEdit, exercise, index, handleOnConfirmEdit };
    });
  }, [addRef, alertRef, closeAlert, createdExercises, editedExerciseIndex, handleConfirmDiscardChanges, handleDeleteExercise, t]);

  const handleNavigateHome = useCallback(() => {
    handleCleanErrors();
    dispatch(setTrainingDayIndex(undefined));
    setAlertConfig(undefined);
    setEditedExerciseIndex(undefined);
    navigate("workouts");
  }, [dispatch, handleCleanErrors, navigate]);

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
    if (editedDay) {
      dispatch(editTrainingDay({ trainingDay: { name: workoutName ?? editedDay.name, exercises: createdExercises } }));
    } else {
      dispatch(addTrainingDay({ name: workoutName ?? "", exercises: createdExercises }));
    }
    handleNavigateHome();
  }, [workoutName, createdExercises, editedDay, handleNavigateHome, dispatch]);

  const handleBackButton = useCallback(() => {
    if (createdExercises.length === 0 && !workoutName) {
      handleNavigateHome();
    } else if (createdExercises.length !== 0 || workoutName?.length !== 0) {
      const title = t(editedDay ? "alert_edit_workout_discard_title" : "alert_create_workout_discard_title");
      const content = t(editedDay ? "alert_edit_workout_discard_content" : "alert_create_workout_discard_content");
      setAlertConfig({
        title,
        content,
        onConfirm: handleNavigateHome,
      });
      alertRef.current?.present();
    } else {
      handleNavigateHome();
    }
  }, [alertRef, createdExercises.length, editedDay, handleNavigateHome, t, workoutName]);

  const handleOnDragEnd = useCallback(
    ({ data }: { data: MappedExercises[] }) => {
      const newExercises = data.map((dataPoint, index) => ({ ...dataPoint.exercise, doneExerciseEntries: createdExercises[index].doneExerciseEntries }));
      setCreatedExercises(newExercises);
      dispatch(overwriteTrainingDayExercises(newExercises));
    },
    [createdExercises, dispatch],
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
          <PlainInput showClear value={workoutName} setValue={handleSetWorkoutName} fontSize={30} placeholder={t("workout_name")} />
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
      <AlertModal reference={alertRef} title={alertConfig?.title} content={alertConfig?.content} onConfirm={handleNavigateHome} onCancel={() => setAlertConfig(undefined)} />
      <AddExerciseModal
        isEditingExercise={editedExerciseIndex !== undefined}
        handleEditExercise={handleEditExercise}
        editedExercise={editedExercise}
        reference={addRef}
        onConfirmEdit={handleConfirmExerciseModal}
      />
    </>
  );
}
