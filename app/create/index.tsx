import { Text } from "../../components/Text/Text";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "../../utils/navigate";
import { Routes } from "../../types/routes";
import { DoneExerciseData, ExerciseMetaData } from "../../store/types";
import { useAppDispatch, useAppSelector } from "../../store";
import { addTrainingDay, adjustTrainingDayExercises, editTrainingDay } from "../../store/reducer";
import { AddExercise } from "../../components/AddExercise/AddExercise";
import { styles } from "./styles";
import { PlainInput } from "../../components/PlainInput/PlainInput";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { EditableExercise } from "../../components/EditableExercise/EditableExercise";
import { PressableRowWithIconSlots } from "../../components/PressableRowWithIconSlots/PressableRowWithIconSlots";
import { AlertModal } from "../../components/AlertModal/AlertModal";
import { SafeAreaView } from "../../components/SafeAreaView/SafeAreaView";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { NotificationFeedbackType } from "expo-haptics";
import { getSelectedTrainingDay, getSelectedTrainingDayIndex } from "../../store/selectors";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { useTranslation } from "react-i18next";

function getAreValuesEmpty(exercise: ExerciseMetaData) {
  const values = Object.values(exercise);
  return values.every((value) => {
    if (typeof value === "object") {
      return true;
    }
    return !value;
  });
}

export default function Index() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [Alert, setAlert] = useState<ReactNode | null>(null);
  const editedDay = useAppSelector(getSelectedTrainingDay);
  const title = useMemo(() => (editedDay ? t("edit_workout") : t("create_workout")), [editedDay, t]);
  const editedDayIndex = useAppSelector(getSelectedTrainingDayIndex);
  const [editedExerciseIndex, setEditedExerciseIndex] = useState<number | undefined>(undefined);
  const [workoutName, setWorkoutName] = useState(editedDay?.name);
  const [createdExercises, setCreatedExercises] = useState<({ doneExerciseEntries: DoneExerciseData } & ExerciseMetaData)[]>(editedDay?.exercises.map((exercise) => exercise) ?? []);
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

  const handleAddNewExercise = useCallback(() => {
    setCreatedExercises([...createdExercises, { doneExerciseEntries: {}, pause: "", reps: "", weight: "", name: "", sets: "" }]);
    setEditedExerciseIndex(createdExercises.length);
  }, [createdExercises]);

  const mappedExercises = useMemo(() => {
    return createdExercises.map((exercise, index) => {
      const onEdit = () => {
        void Haptics.selectionAsync();
        setEditedExerciseIndex(index);
      };
      const handleConfirmDelete = () => {
        void Haptics.notificationAsync(NotificationFeedbackType.Success);
        handleDeleteExercise(index);
        setAlert(null);
      };
      const handleCancel = () => {
        if (getAreValuesEmpty(createdExercises[index])) {
          const newExercises = [...createdExercises];
          newExercises.splice(index, 1);
          setCreatedExercises(newExercises);
        }
        setEditedExerciseIndex(undefined);
      };
      const onDelete = () =>
        setAlert(<AlertModal onCancel={() => setAlert(null)} onConfirm={handleConfirmDelete} title={t("alert_delete_title")} content={t("alert_delete_message")} isVisible={true} />);
      const edited = index === editedExerciseIndex;

      return { onDelete, edited, handleCancel, onEdit, exercise, index };
    });
  }, [createdExercises, editedExerciseIndex, handleDeleteExercise, t]);

  const handleConfirm = useCallback(() => {
    if (!workoutName || createdExercises.length === 0) {
      return;
    }

    if (editedDay) {
      dispatch(editTrainingDay({ index: editedDayIndex ?? 0, trainingDay: { name: workoutName ?? editedDay.name, exercises: createdExercises } }));
    } else {
      dispatch(addTrainingDay({ name: workoutName, exercises: createdExercises }));
    }
    navigate(Routes.HOME);
  }, [workoutName, createdExercises, editedDay, navigate, dispatch, editedDayIndex]);

  const handleNavigateHome = useCallback(() => navigate(Routes.HOME), [navigate]);

  return (
    <>
      <SafeAreaView style={styles.innerWrapper}>
        <SiteNavigationButtons disabled={editedExerciseIndex !== undefined} handleBack={handleNavigateHome} handleConfirm={handleConfirm} titleFontSize={30} title={title} />
        <View style={styles.contentWrapper}>
          <PlainInput value={workoutName} setValue={handleSetWorkoutName} fontSize={30} placeholder={t("workout_name")} />
          <DraggableFlatList
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => `${item.index}${item.exercise.name}${item.exercise.pause}`}
            data={mappedExercises}
            onDragEnd={({ from, to }) => {
              const newExercises = [...createdExercises];
              const toExercise = createdExercises[to];
              newExercises.splice(to, 1, newExercises[from]);
              newExercises.splice(from, 1, toExercise);
              setCreatedExercises(newExercises);
              dispatch(adjustTrainingDayExercises({ from, to }));
            }}
            renderItem={({ drag, item: { index, exercise, onEdit, edited, handleCancel, onDelete } }) => (
              <ScaleDecorator activeScale={0.95}>
                <View style={{ marginBottom: 10 }}>
                  {edited ? (
                    <EditableExercise
                      exercise={exercise}
                      onCancel={handleCancel}
                      onConfirmEdit={(exercise) => {
                        const newExercises = [...createdExercises];
                        newExercises.splice(index, 1, { doneExerciseEntries: createdExercises[index].doneExerciseEntries, ...exercise });
                        setCreatedExercises(newExercises);
                        setEditedExerciseIndex(undefined);
                      }}
                    />
                  ) : (
                    <PressableRowWithIconSlots
                      onClick={onEdit}
                      key={exercise.name.concat(index.toString())}
                      Icon1={{ icon: "delete", onPress: onDelete, disabled: editedExerciseIndex !== undefined }}
                      Icon2={{ icon: "drag", onLongPress: drag, disabled: editedExerciseIndex !== undefined }}
                    >
                      <Text style={styles.text}>{exercise.name}</Text>
                    </PressableRowWithIconSlots>
                  )}
                </View>
              </ScaleDecorator>
            )}
          />
          <AddExercise disabled={editedExerciseIndex !== undefined} onPress={handleAddNewExercise} />
        </View>
      </SafeAreaView>
      {Alert}
    </>
  );
}
