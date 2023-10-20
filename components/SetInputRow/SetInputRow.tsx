import { Keyboard, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigate } from "../../hooks/navigate";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getExerciseIndex, getTrainingIndex } from "../../store/selectors";
import { PlainExerciseData } from "../../store/types";
import { EditNoteModal } from "./components/EditNoteModal";
import { HStack } from "../HStack/HStack";
import { Button } from "../Button/Button";
import { Center } from "../Center/Center";
import { Text } from "../Text/Text";
import { borderRadius } from "../App/theme/border";
import { ThemedTextInput } from "../TextInput/ThemedTextInput";
import { mainColor, mainDisabledColor, secondaryColor, textFieldBackgroundColor } from "../App/theme/colors";
import { setSetIndex } from "../../store/reducer";
import { useTranslation } from "react-i18next";

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
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState(data?.note ?? "");
  const [weight, setWeight] = useState(data?.weight);
  const [reps, setReps] = useState(data?.reps);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    setNote(data?.note ?? "");
    setWeight(data?.weight);
    setReps(data?.reps);
  }, [data, exerciseIndex]);

  const handleConfirmNoteModal = useCallback(
    (newNote?: string) => {
      setNote(newNote ?? note);
      setShowModal(false);
    },
    [note],
  );

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

  const handleShowModal = useCallback(() => {
    handleOnFocus();
    setShowModal(true);
  }, [handleOnFocus]);

  if (trainingIndex === undefined) {
    navigate("workouts");
    return null;
  }

  return (
    <>
      <HStack style={styles.stack}>
        <Center style={{ flex: 0.55, height: 50 }}>
          <View style={{ backgroundColor: !isActiveSet ? "transparent" : textFieldBackgroundColor, borderRadius }}>
            <Text style={{ padding: 10, color: hasData || isActiveSet ? mainColor : secondaryColor, fontSize: 16 }}>{setIndex}</Text>
          </View>
        </Center>
        <Center style={{ flex: 0.55, height: 50 }}>
          <ThemedTextInput
            returnKeyType="done"
            onFocus={handleOnFocus}
            style={{
              padding: 10,
              backgroundColor: !isActiveSet ? "transparent" : textFieldBackgroundColor,
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
        <Center style={{ flex: 0.55, height: 50 }}>
          <ThemedTextInput
            returnKeyType="done"
            onFocus={handleOnFocus}
            style={{ padding: 10, borderRadius, backgroundColor: !isActiveSet ? "transparent" : textFieldBackgroundColor, fontSize: 16, color: !hasData && !isActiveSet ? secondaryColor : mainColor }}
            value={reps}
            onChangeText={setReps}
            textAlign="center"
            inputMode="decimal"
          ></ThemedTextInput>
        </Center>
        <Center style={{ flex: 1, height: 50 }}>
          <Button
            title={note ? t("training_input_show_note") : t("training_input_add_note")}
            style={{
              button: { borderRadius, padding: 10, backgroundColor: !isActiveSet ? "transparent" : textFieldBackgroundColor },
              text: { color: !hasData && !isActiveSet ? secondaryColor : mainColor, fontSize: 16 },
            }}
            theme="ghost"
            onPress={handleShowModal}
          />
        </Center>
        <Center style={{ flex: 0.6, height: 50 }}>
          <Button style={{ button: { width: 40, padding: 7, borderRadius, backgroundColor: isActiveSet ? textFieldBackgroundColor : "transparent" } }} onPress={handleSetDone}>
            <MaterialCommunityIcons size={24} style={{ width: 24, color: isActiveSet ? mainColor : !hasData ? mainDisabledColor : "green" }} name="check-bold" />
          </Button>
          <EditNoteModal note={note} showModal={showModal} onDoneEdit={handleConfirmNoteModal} onCancel={() => setShowModal(false)} />
        </Center>
      </HStack>
    </>
  );
};
