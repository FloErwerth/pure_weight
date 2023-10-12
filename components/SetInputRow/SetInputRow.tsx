import { View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigate } from "../../utils/navigate";
import { Routes } from "../../types/routes";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../store";
import { getTrainingIndex } from "../../store/selectors";
import { PlainExerciseData } from "../../store/types";
import { EditNoteModal } from "./components/EditNoteModal";
import { HStack } from "../HStack/HStack";
import { Button } from "../Button/Button";
import { Center } from "../Center/Center";
import { Text } from "../Text/Text";
import { borderRadius } from "../../app/theme/border";
import { ThemedTextInput } from "../TextInput/ThemedTextInput";
import { mainColor } from "../../app/theme/colors";

interface SetInputRowProps {
  edited: boolean;
  setIndex: number;
  metaData: PlainExerciseData;
  onEdit: () => void;
  onSetDone?: (plainExerciseData: PlainExerciseData) => void;
}
export const SetInputRow = ({ onSetDone, edited, setIndex, metaData, onEdit }: SetInputRowProps) => {
  const navigate = useNavigate();
  const trainingIndex = useAppSelector(getTrainingIndex);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState(!edited ? metaData.note : "");
  const [weight, setWeight] = useState(metaData.weight);
  const [reps, setReps] = useState(metaData.reps);

  useEffect(() => {
    setWeight(metaData?.weight);
    setReps(metaData?.reps);
  }, [metaData]);

  const handleSetDone = useCallback(() => {
    if (weight && reps) {
      onSetDone?.({ weight, reps, note });
    }
  }, [weight, reps, onSetDone, note]);

  const handleConfirmNoteModal = useCallback(
    (newNote?: string) => {
      setNote(newNote ?? note);
      setShowModal(false);
    },
    [note],
  );

  const handleOnFocus = useCallback(() => {
    if (!edited) {
      onEdit();
    }
  }, [edited, onEdit]);

  const handleShowModal = useCallback(() => {
    setShowModal(true);
    if (!edited) {
      onEdit();
    }
  }, [edited, onEdit]);

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
          <ThemedTextInput style={{ padding: 10, borderRadius, fontSize: 16 }} onFocus={handleOnFocus} value={weight} onChangeText={setWeight} textAlign="center" inputMode="decimal"></ThemedTextInput>
        </Center>
        <Center style={{ flex: 0.55, height: 50 }}>
          <ThemedTextInput
            style={{ padding: 10, borderRadius, fontSize: 16 }}
            onFocus={handleOnFocus}
            value={reps}
            onChangeText={setReps}
            returnKeyType="next"
            textAlign="center"
            inputMode="decimal"
          ></ThemedTextInput>
        </Center>
        <Center style={{ flex: 1, height: 50 }}>
          <Button title={note ? "Show note" : "Add note"} style={{ button: { borderRadius, padding: 10 }, text: { color: mainColor, fontSize: 16 } }} theme="ghost" onPress={handleShowModal} />
        </Center>
        <Center style={{ flex: 0.6, height: 50 }}>
          {edited && onSetDone ? (
            <Button theme="ghost" style={{ button: { width: 40, padding: 7, borderRadius } }} onPress={handleSetDone}>
              <MaterialCommunityIcons size={24} style={{ width: 24, color: mainColor, opacity: edited ? 1 : 0 }} name="check-bold" />
            </Button>
          ) : (
            <View style={styles.box}></View>
          )}
          <EditNoteModal note={note} showModal={showModal} onDoneEdit={handleConfirmNoteModal} onCancel={() => setShowModal(false)} />
        </Center>
      </HStack>
    </>
  );
};
