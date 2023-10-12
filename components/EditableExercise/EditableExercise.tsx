import { Pressable, Text, TextInput, View } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ExerciseMetaData } from "../../store/types";
import { EditableExerciseTheme, styles } from "./styles";
import { HStack } from "../HStack/HStack";
import { Center } from "../Center/Center";
import { ThemedTextInput } from "../TextInput/ThemedTextInput";
import { mainColor } from "../../app/theme/colors";

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
        <ThemedTextInput placeholder="Exercise name" ref={inputRef} value={name} onChangeText={setName} style={classes.title} />
        <HStack style={classes.buttons}>
          <Pressable onPress={onCancel}>
            <MaterialCommunityIcons color={mainColor} name="cancel" size={26}></MaterialCommunityIcons>
          </Pressable>
          <Pressable onPress={handleConfirm}>
            <MaterialCommunityIcons color={mainColor} name="check" size={26}></MaterialCommunityIcons>
          </Pressable>
        </HStack>
      </HStack>
      <View style={classes.inputWrapper}>
        <HStack style={{ gap: 10, justifyContent: "space-between" }}>
          <Center style={{ width: "25%" }}>
            <ThemedTextInput inputMode="decimal" textAlign="center" style={classes.input} onChangeText={setWeight} value={weight}></ThemedTextInput>
            <Text style={classes.text}>Weight</Text>
          </Center>
          <Center style={{ width: "25%" }}>
            <ThemedTextInput inputMode="decimal" textAlign="center" style={classes.input} onChangeText={setSets} value={sets}></ThemedTextInput>
            <Text style={classes.text}>Sets</Text>
          </Center>
          <Center style={{ width: "25%" }}>
            <ThemedTextInput inputMode="decimal" textAlign="center" style={classes.input} onChangeText={setReps} value={reps}></ThemedTextInput>
            <Text style={classes.text}>Reps</Text>
          </Center>
          <Center style={{ width: "25%" }}>
            <ThemedTextInput inputMode="decimal" textAlign="center" style={classes.input} onChangeText={setPause} value={pause}></ThemedTextInput>
            <Text style={classes.text}>Pause</Text>
          </Center>
        </HStack>
      </View>
    </View>
  );
};
