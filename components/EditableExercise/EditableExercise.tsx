import { Pressable, TextInput } from "react-native";
import { useCallback, useMemo, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ErrorFields, ExerciseMetaData } from "../../store/types";
import { EditableExerciseTheme, styles } from "./styles";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../store";
import { setError } from "../../store/reducer";
import { EditableExerciseInputRow } from "./EditableExerciseInputRow";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";
import { ThemedView } from "../Themed/ThemedView/View";
import { EditedExercise, emptyExercise } from "../App/create/context";

export interface EditableExerciseProps {
  onConfirmEdit: (exercise: ExerciseMetaData) => void;
  theme?: EditableExerciseTheme;
  editedExercise?: EditedExercise;
  handleEditExercise?: (field: keyof ExerciseMetaData, value: string) => void;
}

const validateData = (data: Partial<ExerciseMetaData>) => {
  const errors: ErrorFields[] = [];
  if (!data.sets) {
    errors.push("create_sets");
  }
  if (!data.name) {
    errors.push("create_name");
  }
  if (!data.reps) {
    errors.push("create_reps");
  }
  if (!data.weight) {
    errors.push("create_weight");
  }
  return errors;
};

export const EditableExercise = ({ onConfirmEdit, theme, editedExercise = emptyExercise, handleEditExercise }: EditableExerciseProps) => {
  const { t } = useTranslation();
  const { mainColor } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const classes = useMemo(() => styles(theme), [theme]);
  const dispatch = useAppDispatch();
  const isEditing = useMemo(() => Boolean(editedExercise), [editedExercise]);

  const handleConfirm = useCallback(() => {
    if (editedExercise) {
      const { name, sets, reps, weight, pause } = editedExercise;
      const possibleErrors = validateData({ reps, sets, weight, name });
      if (possibleErrors.length > 0) {
        dispatch(setError(possibleErrors));
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onConfirmEdit({ name: name ?? "", reps: reps ?? "", sets: sets ?? "", weight: weight ?? "", pause });
      }
    }
  }, [dispatch, editedExercise, onConfirmEdit]);

  return (
    <ThemedView style={classes.innerWrapper}>
      <HStack ghost style={classes.headerWrapper}>
        <ThemedTextInput
          bottomSheet
          clearButtonMode="while-editing"
          autoFocus
          errorKey="create_name"
          placeholder={t("exercise_name")}
          reference={inputRef}
          value={editedExercise?.name}
          onChangeText={(name) => handleEditExercise?.("name", name)}
          style={classes.title}
        />
      </HStack>
      <HStack style={classes.inputWrapper}>
        <EditableExerciseInputRow i18key="weight" setValue={(weight) => handleEditExercise?.("weight", weight)} errorKey={"create_weight"} value={editedExercise?.weight} />
        <EditableExerciseInputRow i18key="sets" setValue={(sets) => handleEditExercise?.("sets", sets)} errorKey={"create_sets"} value={editedExercise?.sets} />
        <EditableExerciseInputRow i18key="reps" setValue={(reps) => handleEditExercise?.("reps", reps)} errorKey={"create_reps"} value={editedExercise?.reps} />
        <EditableExerciseInputRow i18key="pause" setValue={(pause) => handleEditExercise?.("pause", pause)} value={editedExercise?.pause} />
      </HStack>
      <Pressable onPress={handleConfirm}>
        <HStack input style={classes.button}>
          <Text input style={classes.buttonText}>
            {t(isEditing ? "edit_exercise" : "create_exercise")}
          </Text>
          <MaterialCommunityIcons color={mainColor} name="pencil-plus-outline" size={20}></MaterialCommunityIcons>
        </HStack>
      </Pressable>
    </ThemedView>
  );
};
