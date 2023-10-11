import { Text, Pressable, TextInput, View } from "react-native";
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

interface SetInputRowProps {
  edited: boolean;
  setIndex: number;
  metaData: PlainExerciseData;
  onSetDone: (plainExerciseData: PlainExerciseData) => void;
  onEdit: () => void;
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

  console.log(note);

  if (trainingIndex === undefined) {
    navigate(Routes.HOME);
    return null;
  }

  return (
    <>
      <HStack style={styles.stack}>
        <Text style={{ ...styles.set, flex: 0.15 }}>{setIndex}</Text>
        <View style={{ flex: 0.4 }}>
          <View>
            <TextInput
              onFocus={handleOnFocus}
              value={weight}
              onChangeText={setWeight}
              style={{
                width: "100%",
                textAlign: "center",
                flex: 1,
              }}
              inputMode="decimal"
            ></TextInput>
          </View>
        </View>
        <View style={{ flex: 0.4 }}>
          <TextInput
            onFocus={handleOnFocus}
            value={reps}
            onChangeText={setReps}
            returnKeyType="next"
            style={{
              width: "100%",
              textAlign: "center",
              flex: 1,
            }}
            inputMode="decimal"
          ></TextInput>
        </View>
        <Pressable onPress={handleShowModal}>
          <Text>{note ? "Show note" : "Add note"}</Text>
        </Pressable>
        {edited ? (
          <Pressable style={styles.confirmButton} onPress={handleSetDone}>
            <MaterialCommunityIcons size={24} style={{ width: 24, color: "white", opacity: edited ? 1 : 0 }} name="check-bold" />
          </Pressable>
        ) : (
          <View style={styles.box}></View>
        )}
        <EditNoteModal note={note} showModal={showModal} onDoneEdit={handleConfirmNoteModal} onCancel={() => setShowModal(false)} />
      </HStack>
    </>
  );
};
