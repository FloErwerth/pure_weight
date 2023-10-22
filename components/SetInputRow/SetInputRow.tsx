import { Keyboard, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigate } from "../../hooks/navigate";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getExerciseIndex, getTrainingIndex } from "../../store/selectors";
import { PlainExerciseData } from "../../store/types";
import { HStack } from "../HStack/HStack";
import { Button } from "../Button/Button";
import { Center } from "../Center/Center";
import { Text } from "../Text/Text";
import { borderRadius } from "../App/theme/border";
import { ThemedTextInput } from "../TextInput/ThemedTextInput";
import { componentBackgroundColor, mainColor, mainDisabledColor, secondaryColor, textFieldBackgroundColor } from "../App/theme/colors";
import { setSetIndex } from "../../store/reducer";

interface SetInputRowProps {
  setIndex: number;
  isActiveSet: boolean;
  onSetDone?: (plainExerciseData: PlainExerciseData) => void;
  hasData: boolean;
  data: PlainExerciseData | undefined;
}
export const SetInputRow = ({ onSetDone, setIndex, isActiveSet, hasData, data }: SetInputRowProps) => {
  const navigate = useNavigate();
  const trainingIndex = useAppSelector(getTrainingIndex);
  const exerciseIndex = useAppSelector(getExerciseIndex);
  const [note, setNote] = useState(data?.note ?? "");
  const [weight, setWeight] = useState(data?.weight);
  const [reps, setReps] = useState(data?.reps);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setNote(data?.note ?? "");
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
        onSetDone?.({ weight, reps, note });
      }
    } else {
      handleOnFocus();
    }
  }, [isActiveSet, weight, reps, onSetDone, note, handleOnFocus]);
  const activeStackStyles = useMemo(() => ({ backgroundColor: isActiveSet ? textFieldBackgroundColor : "transparent" }), [isActiveSet]);

  if (trainingIndex === undefined) {
    navigate("workouts");
    return null;
  }
  return (
    <>
      <HStack style={[styles.stack, activeStackStyles]}>
        <Center style={{ flex: 0.2, height: 50 }}>
          <View style={{ borderRadius }}>
            <Text style={{ padding: 10, color: hasData || isActiveSet ? mainColor : secondaryColor, fontSize: 16 }}>{setIndex}</Text>
          </View>
        </Center>
        <HStack style={{ flex: 1 }}>
          <Center style={{ flex: 1, height: 50 }}>
            <ThemedTextInput
              returnKeyType="done"
              onFocus={handleOnFocus}
              style={{
                padding: 10,
                alignSelf: "stretch",
                backgroundColor: !isActiveSet ? "transparent" : componentBackgroundColor,
                borderRadius,
                fontSize: 16,
                color: !hasData && !isActiveSet ? secondaryColor : mainColor,
              }}
              value={weight}
              onChangeText={setWeight}
              textAlign="center"
              inputMode="decimal"
            ></ThemedTextInput>
          </Center>
          <Center style={{ flex: 1, height: 50 }}>
            <ThemedTextInput
              returnKeyType="done"
              onFocus={handleOnFocus}
              style={{
                padding: 10,
                borderRadius,
                alignSelf: "stretch",
                backgroundColor: !isActiveSet ? "transparent" : componentBackgroundColor,
                fontSize: 16,
                color: !hasData && !isActiveSet ? secondaryColor : mainColor,
              }}
              value={reps}
              onChangeText={setReps}
              textAlign="center"
              inputMode="decimal"
            ></ThemedTextInput>
          </Center>
          <Center style={{ flex: 1, height: 50 }}>
            <Button style={{ button: { width: 40, padding: 7, borderRadius, backgroundColor: !isActiveSet ? "transparent" : componentBackgroundColor } }} onPress={handleSetDone}>
              <MaterialCommunityIcons size={24} style={{ width: 24, color: isActiveSet ? mainColor : !hasData ? mainDisabledColor : "green" }} name="check-bold" />
            </Button>
          </Center>
        </HStack>
      </HStack>
    </>
  );
};
