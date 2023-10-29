import { Keyboard, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigate } from "../../hooks/navigate";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getExerciseIndex, getTrainingIndex } from "../../store/selectors";
import { PlainExerciseData } from "../../store/types";
import { HStack } from "../HStack/HStack";
import { Button } from "../Themed/Button/Button";
import { Center } from "../Center/Center";
import { Text } from "../Themed/ThemedText/Text";
import { borderRadius } from "../../theme/border";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { setSetIndex } from "../../store/reducer";
import { useTheme } from "../../theme/context";

interface SetInputRowProps {
  setIndex: number;
  isActiveSet: boolean;
  onSetDone?: (plainExerciseData: PlainExerciseData) => void;
  hasData: boolean;
  data: PlainExerciseData | undefined;
  isEditable: boolean;
}

export const SetInputRow = ({ onSetDone, setIndex, isActiveSet, hasData, data, isEditable = true }: SetInputRowProps) => {
  const navigate = useNavigate();
  const { primaryColor, mainColor, secondaryBackgroundColor, componentBackgroundColor, inputFieldBackgroundColor, textDisabled, secondaryColor } = useTheme();
  const trainingIndex = useAppSelector(getTrainingIndex);
  const exerciseIndex = useAppSelector(getExerciseIndex);
  const [weight, setWeight] = useState(data?.weight);
  const [reps, setReps] = useState(data?.reps);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setWeight(data?.weight);
    setReps(data?.reps);
  }, [data, exerciseIndex]);

  const handleOnFocus = useCallback(() => {
    dispatch(setSetIndex(setIndex - 1));
  }, [dispatch, setIndex]);

  const handleSetDone = useCallback(() => {
    if (isActiveSet) {
      Keyboard.dismiss();
      if (weight && reps) {
        onSetDone?.({ weight, reps });
      }
    } else {
      handleOnFocus();
    }
  }, [isActiveSet, weight, reps, onSetDone, handleOnFocus]);
  const activeStackStyles = useMemo(() => ({ backgroundColor: isActiveSet ? inputFieldBackgroundColor : "transparent" }), [inputFieldBackgroundColor, isActiveSet]);

  const computedTextfieldBackgroundColor = useMemo(() => {
    if (!isActiveSet) {
      if (isEditable) {
        return secondaryBackgroundColor;
      }
      return "transparent";
    }
    return secondaryBackgroundColor;
  }, [isActiveSet, isEditable, secondaryBackgroundColor]);

  const computedButtonBackgroundColor = useMemo(() => {
    if (!isActiveSet) {
      if (isEditable) {
        return componentBackgroundColor;
      }
      return "transparent";
    }
    return componentBackgroundColor;
  }, [componentBackgroundColor, isActiveSet, isEditable]);

  const computedColor = useMemo(() => {
    if (!isEditable) {
      return textDisabled;
    }
    if (!isActiveSet) {
      return secondaryColor;
    }
    return mainColor;
  }, [isActiveSet, isEditable, mainColor, secondaryColor, textDisabled]);

  const textNumberStyles = useMemo(() => [styles.textNumber, { color: computedColor }], [computedColor]);
  const textInputStyles = useMemo(() => [styles.textInput, { backgroundColor: computedTextfieldBackgroundColor, color: computedColor }], [computedTextfieldBackgroundColor, computedColor]);
  const buttonStyles = useMemo(() => ({ button: { ...styles.button, ...{ backgroundColor: computedButtonBackgroundColor } } }), [computedButtonBackgroundColor]);
  const iconStyle = useMemo(() => ({ color: hasData ? "green" : isActiveSet ? primaryColor : textDisabled }), [hasData, isActiveSet, secondaryColor, textDisabled]);

  if (trainingIndex === undefined) {
    navigate("workouts");
    return null;
  }
  return (
    <HStack style={[styles.vStack, activeStackStyles]}>
      <Center style={styles.numberCenter}>
        <View style={{ borderRadius }}>
          <Text style={textNumberStyles}>{setIndex}</Text>
        </View>
      </Center>
      <HStack stretch>
        <Center style={styles.center}>
          <ThemedTextInput
            editable={isEditable}
            returnKeyType="done"
            onFocus={handleOnFocus}
            style={textInputStyles}
            value={weight}
            onChangeText={setWeight}
            textAlign="center"
            inputMode="decimal"
          ></ThemedTextInput>
        </Center>
        <Center style={styles.center}>
          <ThemedTextInput
            editable={isEditable}
            returnKeyType="done"
            onFocus={handleOnFocus}
            style={textInputStyles}
            value={reps}
            onChangeText={setReps}
            textAlign="center"
            inputMode="decimal"
          ></ThemedTextInput>
        </Center>
        <Center style={styles.center}>
          <Button disabled={!isEditable} style={buttonStyles} onPress={handleSetDone}>
            <MaterialCommunityIcons size={24} style={iconStyle} name="check-bold" />
          </Button>
        </Center>
      </HStack>
    </HStack>
  );
};
