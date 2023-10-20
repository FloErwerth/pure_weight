import { Text } from "../../../components/Text/Text";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { ExerciseMetaData, ExerciseMetaDataWithDoneEntries } from "../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../store";
import { addTrainingDay, cleanErrors, editTrainingDay, overwriteTrainingDayExercises, setError, setTrainingDayIndex } from "../../../store/reducer";
import { AddExercise } from "../../../components/AddExercise/AddExercise";
import { styles } from "../../../components/App/create/styles";
import { PlainInput } from "../../../components/PlainInput/PlainInput";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PressableRowWithIconSlots } from "../../../components/PressableRowWithIconSlots/PressableRowWithIconSlots";
import { AlertConfig, AlertModal } from "../../../components/AlertModal/AlertModal";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { NotificationFeedbackType } from "expo-haptics";
import { getSelectedTrainingDay, getSelectedTrainingDayIndex } from "../../../store/selectors";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { useTranslation } from "react-i18next";
import { AddExerciseModal } from "../../../components/AddExerciseModal/AddExerciseModal";
import { ThemedView } from "../../../components/View/View";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { backgroundColor } from "../../../components/App/theme/colors";

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
const emptyExercise: ExerciseMetaData = { reps: "", pause: "", sets: "", weight: "", name: "" };
export function Create() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [alertConfig, setAlertConfig] = useState<AlertConfig | undefined>(undefined);
  const editedDay = useAppSelector(getSelectedTrainingDay);
  const title = useMemo(() => (editedDay ? t("edit_workout") : t("create_workout")), [editedDay, t]);
  const editedDayIndex = useAppSelector(getSelectedTrainingDayIndex);
  const [editedExerciseIndex, setEditedExerciseIndex] = useState<number | undefined>(undefined);
  const [workoutName, setWorkoutName] = useState(editedDay?.name);
  const [createdExercises, setCreatedExercises] = useState<ExerciseMetaDataWithDoneEntries>(editedDay?.exercises.map((exercise) => exercise) ?? []);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setWorkoutName(editedDay?.name);
    setCreatedExercises(editedDay?.exercises ?? []);
  }, [editedDay]);

  const handleSetWorkoutName = useCallback((value?: string) => {
    setWorkoutName(value);
  }, []);

  const handleDeleteExercise = useCallback(
    (index: number) => {
      const newExercises = [...createdExercises];
      newExercises.splice(index, 1);
      setCreatedExercises(newExercises);
    },
    [createdExercises],
  );

  const handleConfirmExerciseModal = useCallback(
    (exercise: ExerciseMetaData) => {
      if (editedExerciseIndex !== undefined && editedExerciseIndex !== -1) {
        const extractedExercise = createdExercises[editedExerciseIndex];
        const newExercises = [...createdExercises];
        newExercises.splice(editedExerciseIndex, 1, { ...exercise, doneExerciseEntries: extractedExercise.doneExerciseEntries });
        setCreatedExercises(newExercises);
      } else {
        setCreatedExercises([...createdExercises, { doneExerciseEntries: {}, ...exercise }]);
        setEditedExerciseIndex(createdExercises.length);
      }
      setEditedExerciseIndex(undefined);
    },
    [createdExercises, editedExerciseIndex],
  );

  const handleCleanErrors = useCallback(() => {
    dispatch(cleanErrors());
  }, [dispatch]);

  const handleConfirmDiscardChanges = useCallback(() => {
    setAlertConfig(undefined);
    handleCleanErrors();
    navigate("workouts");
  }, [handleCleanErrors, navigate]);

  const mappedExercises = useMemo(() => {
    return createdExercises.map((exercise, index) => {
      const onEdit = () => {
        void Haptics.selectionAsync();
        setEditedExerciseIndex(index);
      };

      const handleConfirmDelete = () => {
        void Haptics.notificationAsync(NotificationFeedbackType.Success);
        handleDeleteExercise(index);
        setAlertConfig(undefined);
      };

      const handleOnConfirmEdit = (exercise: ExerciseMetaData) => {
        if (exercise.sets && exercise.name && exercise.weight && exercise.reps) {
          const newExercises = [...createdExercises];
          newExercises.splice(index, 1, { doneExerciseEntries: createdExercises[index].doneExerciseEntries, ...exercise });
          setCreatedExercises(newExercises);
          setEditedExerciseIndex(-1);
        }
      };
      const handleCancel = () => {
        if (getAreValuesEmpty(createdExercises[index])) {
          const newExercises = [...createdExercises];
          newExercises.splice(index, 1);
          setCreatedExercises(newExercises);
        }
        setEditedExerciseIndex(-1);
      };
      const onDelete = () => setAlertConfig({ title: t("alert_delete_title"), content: t("alert_delete_message"), onConfirm: handleConfirmDelete, onCancel: handleConfirmDiscardChanges });
      const edited = index === editedExerciseIndex;

      return { onDelete, edited, handleCancel, onEdit, exercise, index, handleOnConfirmEdit };
    });
  }, [createdExercises, editedExerciseIndex, handleConfirmDiscardChanges, handleDeleteExercise, t]);

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
      dispatch(editTrainingDay({ index: editedDayIndex ?? 0, trainingDay: { name: workoutName ?? editedDay.name, exercises: createdExercises } }));
    } else {
      dispatch(addTrainingDay({ name: workoutName ?? "", exercises: createdExercises }));
    }
    handleNavigateHome();
  }, [workoutName, createdExercises, editedDay, handleNavigateHome, dispatch, editedDayIndex]);

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
    } else {
      handleNavigateHome();
    }
  }, [createdExercises.length, editedDay, handleNavigateHome, t, workoutName]);

  const handleOnDragEnd = useCallback(
    ({ data }: { data: MappedExercises[] }) => {
      const newExercises = data.map((dataPoint, index) => ({ ...dataPoint.exercise, doneExerciseEntries: createdExercises[index].doneExerciseEntries }));
      setCreatedExercises(newExercises);
      dispatch(overwriteTrainingDayExercises(newExercises));
    },
    [createdExercises, dispatch],
  );

  return (
    <>
      <ThemedView style={styles.innerWrapper}>
        <SiteNavigationButtons handleBack={handleBackButton} handleConfirm={handleConfirm} titleFontSize={30} title={title} />
        <View style={styles.contentWrapper}>
          <PlainInput value={workoutName} setValue={handleSetWorkoutName} fontSize={30} placeholder={t("workout_name")} />
          <View style={styles.listContainer}>
            {mappedExercises.length > 0 ? (
              <DraggableFlatList
                scrollsToTop
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
              <MaterialCommunityIcons style={{ alignSelf: "center", flex: 1, marginTop: "25%" }} name="clipboard-search-outline" size={256} color={backgroundColor} />
            )}
          </View>
        </View>
        <AddExercise onPress={() => setEditedExerciseIndex(-1)} />
      </ThemedView>
      {alertConfig && <AlertModal title={alertConfig.title} content={alertConfig.content} onConfirm={alertConfig.onConfirm} onCancel={() => setAlertConfig(undefined)} />}
      {editedExerciseIndex !== undefined && (
        <AddExerciseModal
          onRequestClose={() => setEditedExerciseIndex(undefined)}
          exercise={editedExerciseIndex !== -1 ? createdExercises[editedExerciseIndex] : emptyExercise}
          onConfirmEdit={handleConfirmExerciseModal}
        />
      )}
    </>
  );
}
