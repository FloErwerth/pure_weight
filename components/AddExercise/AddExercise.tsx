import { styles } from "./styles";
import { Pressable, Text } from "react-native";
import { useCallback, useMemo } from "react";
import { mainColor, mainDisabledColor } from "../../app/theme/colors";

interface AddExerciseProps {
  onPress?: () => void;
  exerciseName?: string;
  disabled?: boolean;
}
export const AddExercise = ({ onPress, exerciseName, disabled = false }: AddExerciseProps) => {
  const text = useMemo(() => exerciseName ?? "Add new exercise", [exerciseName]);
  const handlePress = useCallback(() => onPress?.(), [onPress]);
  const textStyles = useMemo(() => ({ ...styles.text, color: disabled ? mainDisabledColor : mainColor }), [disabled]);

  return (
    <Pressable disabled={disabled} style={styles.add} onPress={handlePress}>
      <Text style={textStyles}>{text}</Text>
    </Pressable>
  );
};
