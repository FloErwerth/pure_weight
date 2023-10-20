import { Pressable, TextInput, View } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ErrorFields, ExerciseMetaData } from "../../store/types";
import { EditableExerciseTheme, styles } from "./styles";
import { HStack } from "../HStack/HStack";
import { ThemedTextInput } from "../TextInput/ThemedTextInput";
import { mainColor } from "../App/theme/colors";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../store";
import { setError } from "../../store/reducer";
import { EditableExerciseInputRow } from "./EditableExerciseInputRow";
import { Text } from "../Text/Text";

export interface EditableExerciseProps {
  exercise?: ExerciseMetaData;
  onConfirmEdit: (exercise: ExerciseMetaData) => void;
  theme?: EditableExerciseTheme;
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

export const EditableExercise = ({ exercise, onConfirmEdit, theme }: EditableExerciseProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState<string | undefined>(exercise?.name);
  const [weight, setWeight] = useState<string | undefined>(exercise?.weight);
  const [sets, setSets] = useState<string | undefined>(exercise?.sets);
  const [reps, setReps] = useState<string | undefined>(exercise?.reps);
  const [pause, setPause] = useState<string | undefined>(exercise?.pause);
  const inputRef = useRef<TextInput>(null);
  const classes = useMemo(() => styles(theme), [theme]);
  const dispatch = useAppDispatch();
  const isEditing = useMemo(() => Boolean(exercise), [exercise]);

  const handleConfirm = useCallback(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const possibleErrors = validateData({ reps, sets, weight, name });
    if (possibleErrors.length > 0) {
      dispatch(setError(possibleErrors));
    } else {
      onConfirmEdit({ name: name ?? "", reps: reps ?? "", sets: sets ?? "", weight: weight ?? "", pause });
    }
  }, [reps, sets, weight, name, dispatch, onConfirmEdit, pause]);

  return (
    <View style={classes.innerWrapper}>
      <HStack style={classes.headerWrapper}>
        <ThemedTextInput
          clearButtonMode="while-editing"
          autoFocus={true}
          errorKey="create_name"
          placeholder={t("exercise_name")}
          ref={inputRef}
          value={name}
          onChangeText={setName}
          style={classes.title}
        />
      </HStack>
      <View style={classes.inputWrapper}>
        <HStack style={{ gap: 10, justifyContent: "space-between" }}>
          <EditableExerciseInputRow i18key="weight" setValue={setWeight} errorKey={"create_weight"} value={weight} />
          <EditableExerciseInputRow i18key="sets" setValue={setSets} errorKey={"create_sets"} value={sets} />
          <EditableExerciseInputRow i18key="reps" setValue={setReps} errorKey={"create_reps"} value={reps} />
          <EditableExerciseInputRow i18key="pause" setValue={setPause} value={pause} />
        </HStack>
      </View>
      <Pressable onPress={handleConfirm}>
        <HStack style={classes.button}>
          <Text style={classes.buttonText}>{t(isEditing ? "edit_exercise" : "create_exercise")}</Text>
          <MaterialCommunityIcons color={mainColor} name="pencil-plus-outline" size={20}></MaterialCommunityIcons>
        </HStack>
      </Pressable>
    </View>
  );
};
