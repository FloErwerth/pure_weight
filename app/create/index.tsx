import { Text } from "../../components/Text/Text";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { useNavigate } from "../../utils/navigate";
import { Routes } from "../../types/routes";
import { DoneExerciseData, ExerciseMetaData } from "../../store/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppDispatch, useAppSelector } from "../../store";
import { addTrainingDay, editTrainingDay } from "../../store/reducer";
import { getEditedTrainingDay, getEditedTrainingDayIndex } from "../../store/selectors";
import { AddExercise } from "../../components/AddExercise/AddExercise";
import { styles } from "./styles";
import { PlainInput } from "../../components/PlainInput/PlainInput";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { EditableExercise } from "../../components/EditableExercise/EditableExercise";
import { PressableRowWithIconSlots } from "../../components/PressableRowWithIconSlots/PressableRowWithIconSlots";
import { AlertModal } from "../../components/AlertModal/AlertModal";
import { Center } from "../../components/Center/Center";
import { VStack } from "../../components/VStack/VStack";
import { SafeAreaView } from "../../components/SafeAreaView/SafeAreaView";
import { View } from "react-native";

const errorText = { ["workoutNameEmpty"]: "A workout name is required", ["createdExercisesEmpty"]: "The training requires at least 1 exercise" };

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

  const [Alert, setAlert] = useState<ReactNode | null>(null);
  const editedDay = useAppSelector(getEditedTrainingDay);
  const title = useMemo(() => (editedDay ? "Edit workout" : "Create workout"), [editedDay]);
  const editedDayIndex = useAppSelector(getEditedTrainingDayIndex);
  const [editedExerciseIndex, setEditedExerciseIndex] = useState<number | undefined>(undefined);
  const [workoutName, setWorkoutName] = useState(editedDay?.name);
  const [workoutErrorText, setWorkoutErrorText] = useState<string | undefined>("");
  const [createdExerciseErrorText, setCreatedExerciseErrorText] = useState<string | undefined>("");
  const [createdExercises, setCreatedExercises] = useState<({ doneExerciseEntries: DoneExerciseData } & ExerciseMetaData)[]>(editedDay?.exercises.map((exercise) => exercise) ?? []);
  const dispatch = useAppDispatch();

  const handleSetWorkoutName = useCallback((value?: string) => {
    setWorkoutErrorText("");
    setWorkoutName(value);
  }, []);

  const handleDeleteExercise = useCallback(
    (index: number) => {
      if (editedDay) {
        const newExercises = [...editedDay.exercises];
        newExercises.splice(index, 1);
        setCreatedExercises(newExercises);
      }
    },
    [editedDay],
  );

  const handleAddNewExercise = useCallback(() => {
    setCreatedExercises([...createdExercises, { doneExerciseEntries: {}, pause: "", reps: "", weight: "", name: "", sets: "" }]);
    setEditedExerciseIndex(createdExercises.length);
  }, [createdExercises]);

  const mappedExercises = useMemo(() => {
    return createdExercises.map((exercise, index) => {
      const onEdit = () => {
        setEditedExerciseIndex(index);
      };
      const handleConfirmDelete = () => {
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
      const onDelete = () => setAlert(<AlertModal onCancel={() => setAlert(null)} onConfirm={handleConfirmDelete} title="Delete exercise?" content="This action can't be undone" isVisible={true} />);
      const edited = index === editedExerciseIndex;

      if (!edited) {
        return (
          <PressableRowWithIconSlots key={exercise.name.concat(index.toString())} Icon2={{ icon: "delete", onPress: onDelete, disabled: editedExerciseIndex !== undefined }}>
            <AddExercise onPress={onEdit} exerciseName={exercise.name} />
          </PressableRowWithIconSlots>
        );
      }
      return (
        <EditableExercise
          key={exercise.name.concat(index.toString())}
          exercise={exercise}
          onCancel={handleCancel}
          onConfirmEdit={(exercise) => {
            const newExercises = [...createdExercises];
            newExercises.splice(index, 1, { doneExerciseEntries: createdExercises[index].doneExerciseEntries, ...exercise });
            setCreatedExercises(newExercises);
            setEditedExerciseIndex(undefined);
          }}
        />
      );
    });
  }, [createdExercises, editedExerciseIndex, handleDeleteExercise]);

  const handleConfirm = useCallback(() => {
    if (!workoutName || createdExercises.length === 0) {
      if (!workoutName) {
        setWorkoutErrorText(errorText["workoutNameEmpty"]);
      }
      if (createdExercises.length === 0) {
        setCreatedExerciseErrorText(errorText["createdExercisesEmpty"]);
      }
      return;
    }

    if (editedDay) {
      dispatch(editTrainingDay({ index: editedDayIndex ?? 0, trainingDay: { name: workoutName ?? editedDay.name, exercises: createdExercises } }));
    } else {
      dispatch(addTrainingDay({ name: workoutName, exercises: createdExercises }));
    }
    navigate(Routes.HOME);
  }, [workoutName, createdExercises, editedDay, navigate, dispatch, editedDayIndex]);

  const exercisesWrapperStyles = useMemo(() => {
    return { ...styles.savedTrainings, ...(createdExerciseErrorText ? { borderWidth: 1, borderColor: "red", borderRadius: 5 } : {}) };
  }, [createdExerciseErrorText]);

  const handleNavigateHome = useCallback(() => navigate(Routes.HOME), [navigate]);

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <SiteNavigationButtons disabled={editedExerciseIndex !== undefined} handleBack={handleNavigateHome} handleConfirm={handleConfirm} titleFontSize={30} title={title} />
        <Center style={styles.center}>
          <VStack style={styles.stack}>
            <PlainInput value={workoutName} setValue={handleSetWorkoutName} fontSize={30} placeholder="Workout name" />
            <View style={styles.contentWrapper}>
              <Text style={styles.errorBox}>{createdExerciseErrorText}</Text>
              <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" keyboardOpeningTime={0}>
                <View style={exercisesWrapperStyles}>
                  <>
                    {mappedExercises}
                    <View style={styles.addWrapper}>
                      <AddExercise disabled={editedExerciseIndex !== undefined} onPress={handleAddNewExercise} />
                    </View>
                  </>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </VStack>
        </Center>
      </SafeAreaView>
      {Alert}
    </>
  );
}
