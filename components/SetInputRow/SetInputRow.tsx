import { Keyboard } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigate } from "../../utils/navigate";
import { Routes } from "../../types/routes";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getTrainingIndex } from "../../store/selectors";
import { PlainExerciseData } from "../../store/types";
import { EditNoteModal } from "./components/EditNoteModal";
import { HStack } from "../HStack/HStack";
import { Button } from "../Button/Button";
import { Center } from "../Center/Center";
import { Text } from "../Text/Text";
import { borderRadius } from "../../app/theme/border";
import { ThemedTextInput } from "../TextInput/ThemedTextInput";
import { mainColor, mainDisabledColor, secondaryColor, textFieldBackgroundColor } from "../../app/theme/colors";
import { setSetIndex } from "../../store/reducer";

interface SetInputRowProps {
  setIndex: number;
  metaData: PlainExerciseData;
  isActiveSet: boolean;
  onSetDone?: (plainExerciseData: PlainExerciseData) => void;
}
export const SetInputRow = ({ onSetDone, setIndex, metaData, isActiveSet }: SetInputRowProps) => {
  const navigate = useNavigate();
  const trainingIndex = useAppSelector(getTrainingIndex);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState(metaData.note);
  const [weight, setWeight] = useState(metaData.weight);
  const [reps, setReps] = useState(metaData.reps);
  const dispatch = useAppDispatch();
  const [isPrestine, setIsPrestine] = useState(true);

  useEffect(() => {
    setWeight(metaData?.weight);
    setReps(metaData?.reps);
  }, [metaData]);

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
      setIsPrestine(false);
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
    navigate(Routes.HOME);
    return null;
  }

  return (
    <>
      <HStack style={styles.stack}>
        <Center style={{ flex: 0.55, height: 50 }}>
          <Text style={{ padding: 10, color: mainColor, fontSize: 16 }}>{setIndex}</Text>
        </Center>
        <Center style={{ flex: 0.55, height: 50 }}>
          <ThemedTextInput
            returnKeyType="done"
            onFocus={handleOnFocus}
            style={{ padding: 10, borderRadius, fontSize: 16, color: isPrestine && !isActiveSet ? secondaryColor : mainColor }}
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
            style={{ padding: 10, borderRadius, fontSize: 16, color: isPrestine && !isActiveSet ? secondaryColor : mainColor }}
            value={reps}
            onChangeText={setReps}
            textAlign="center"
            inputMode="decimal"
          ></ThemedTextInput>
        </Center>
        <Center style={{ flex: 1, height: 50 }}>
          <Button
            title={note ? "Show note" : "Add note"}
            style={{ button: { borderRadius, padding: 10 }, text: { color: isPrestine && !isActiveSet ? secondaryColor : mainColor, fontSize: 16 } }}
            theme="ghost"
            onPress={handleShowModal}
          />
        </Center>
        <Center style={{ flex: 0.6, height: 50 }}>
          <Button style={{ button: { width: 40, padding: 7, borderRadius, backgroundColor: isActiveSet ? "#222" : textFieldBackgroundColor } }} onPress={handleSetDone}>
            <MaterialCommunityIcons size={24} style={{ width: 24, color: isActiveSet ? mainColor : isPrestine ? mainDisabledColor : "green" }} name="check-bold" />
          </Button>
          <EditNoteModal note={note} showModal={showModal} onDoneEdit={handleConfirmNoteModal} onCancel={() => setShowModal(false)} />
        </Center>
      </HStack>
    </>
  );
};
