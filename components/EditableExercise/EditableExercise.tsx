import { Pressable, Text, TextInput, View } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ExerciseMetaData } from "../../store/types";
import { EditableExerciseTheme, styles } from "./styles";

interface EditableExerciseProps {
  exercise: ExerciseMetaData;
  onConfirmEdit: (exercise: ExerciseMetaData) => void;
  onCancel: () => void;
  theme?: EditableExerciseTheme;
}

export const EditableExercise = ({ exercise, onConfirmEdit, onCancel, theme }: EditableExerciseProps) => {
  const [name, setName] = useState(exercise?.name);
  const [weight, setWeight] = useState(exercise?.weight);
  const [sets, setSets] = useState(exercise?.sets);
  const [reps, setReps] = useState(exercise?.reps);
  const [pause, setPause] = useState(exercise?.pause);
  const inputRef = useRef<TextInput>(null);
  const classes = useMemo(() => styles(theme), [theme]);

  const handleConfirm = useCallback(() => {
    onConfirmEdit({ name, reps, sets, weight, pause });
  }, [onConfirmEdit, name, reps, sets, weight, pause]);

  return (
    <View style={classes.wrapper}>
      <View style={classes.headerWrapper}>
        <TextInput ref={inputRef} value={name} onChangeText={setName} style={classes.title} />
        <View style={classes.buttons}>
          <Pressable onPress={onCancel}>
            <MaterialCommunityIcons color={"rgb(64,64,64)"} name="cancel" size={26}></MaterialCommunityIcons>
          </Pressable>
          <Pressable onPress={handleConfirm}>
            <MaterialCommunityIcons color={"rgb(64,64,64)"} name="check" size={26}></MaterialCommunityIcons>
          </Pressable>
        </View>
      </View>
      <View style={classes.inputWrapper}>
        <View style={{ gap: 10, justifyContent: "space-between" }}>
          <View style={{ width: "25%" }}>
            <TextInput inputMode="decimal" style={{ backgroundColor: "lightgrey", alignSelf: "stretch", padding: 10, borderRadius: 8 }} onChangeText={setWeight} value={weight}></TextInput>
            <Text>Weight</Text>
          </View>
          <View style={{ width: "25%" }}>
            <TextInput inputMode="decimal" style={{ backgroundColor: "lightgrey", alignSelf: "stretch", padding: 10, borderRadius: 8 }} onChangeText={setSets} value={sets}></TextInput>
            <Text>Sets</Text>
          </View>
          <View style={{ width: "25%" }}>
            <TextInput inputMode="decimal" style={{ backgroundColor: "lightgrey", alignSelf: "stretch", padding: 10, borderRadius: 8 }} onChangeText={setReps} value={reps}></TextInput>
            <Text>Reps</Text>
          </View>
          <View style={{ width: "25%" }}>
            <TextInput inputMode="decimal" style={{ backgroundColor: "lightgrey", alignSelf: "stretch", padding: 10, borderRadius: 8 }} onChangeText={setPause} value={pause}></TextInput>
            <Text>Pause</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
