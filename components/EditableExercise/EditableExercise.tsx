import { Pressable, Text, TextInput, View } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ExerciseMetaData } from "../../store/types";
import { EditableExerciseTheme, styles } from "./styles";
import { HStack } from "../HStack/HStack";
import { Center } from "../Center/Center";

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
      <HStack style={classes.headerWrapper}>
        <TextInput ref={inputRef} value={name} onChangeText={setName} style={classes.title} />
        <HStack style={classes.buttons}>
          <Pressable onPress={onCancel}>
            <MaterialCommunityIcons color={"rgb(64,64,64)"} name="cancel" size={26}></MaterialCommunityIcons>
          </Pressable>
          <Pressable onPress={handleConfirm}>
            <MaterialCommunityIcons color={"rgb(64,64,64)"} name="check" size={26}></MaterialCommunityIcons>
          </Pressable>
        </HStack>
      </HStack>
      <View style={classes.inputWrapper}>
        <HStack style={{ gap: 10, justifyContent: "space-between" }}>
          <Center style={{ width: "25%" }}>
            <TextInput inputMode="decimal" style={{ backgroundColor: "lightgrey", alignSelf: "stretch", padding: 10, borderRadius: 8 }} onChangeText={setWeight} value={weight}></TextInput>
            <Text>Weight</Text>
          </Center>
          <Center style={{ width: "25%" }}>
            <TextInput inputMode="decimal" style={{ backgroundColor: "lightgrey", alignSelf: "stretch", padding: 10, borderRadius: 8 }} onChangeText={setSets} value={sets}></TextInput>
            <Text>Sets</Text>
          </Center>
          <Center style={{ width: "25%" }}>
            <TextInput inputMode="decimal" style={{ backgroundColor: "lightgrey", alignSelf: "stretch", padding: 10, borderRadius: 8 }} onChangeText={setReps} value={reps}></TextInput>
            <Text>Reps</Text>
          </Center>
          <Center style={{ width: "25%" }}>
            <TextInput inputMode="decimal" style={{ backgroundColor: "lightgrey", alignSelf: "stretch", padding: 10, borderRadius: 8 }} onChangeText={setPause} value={pause}></TextInput>
            <Text>Pause</Text>
          </Center>
        </HStack>
      </View>
    </View>
  );
};
