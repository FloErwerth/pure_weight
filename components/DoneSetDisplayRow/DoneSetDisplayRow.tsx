import { HStack } from "../HStack/HStack";
import { View } from "react-native";
import { PlainExerciseData } from "../../store/types";
import { Button } from "../Button/Button";
import { useState } from "react";
import { Modal } from "../Modal/Modal";
import { styles } from "./styles";
import { borderRadius } from "../../app/theme/border";
import { mainColor } from "../../app/theme/colors";
import { Text } from "../Text/Text";

interface DoneSetDisplayRowProps {
  setNumber: number | string;
  setData: PlainExerciseData;
}
export const DoneSetDisplayRow = ({ setData: { weight, reps, note }, setNumber }: DoneSetDisplayRowProps) => {
  const [showNote, setShowNote] = useState(false);
  return (
    <HStack style={styles.wrapper}>
      <Text style={{ flex: 0.55, textAlign: "center", color: mainColor, fontSize: 16 }}>{setNumber}</Text>
      <Text style={{ flex: 0.55, textAlign: "center", color: mainColor, fontSize: 16 }}>{weight}</Text>
      <Text style={{ flex: 0.55, textAlign: "center", color: mainColor, fontSize: 16 }}>{reps}</Text>
      {note ? <Button theme="ghost" title="show note" onPress={() => setShowNote(true)} style={{ button: { flex: 1 }, text: { color: mainColor, fontSize: 16 } }} /> : <View style={{ flex: 1 }} />}
      <Modal isVisible={showNote} onRequestClose={() => setShowNote(false)}>
        <View style={{ backgroundColor: "white", padding: 10, borderRadius }}>
          <Text>{note}</Text>
        </View>
      </Modal>
    </HStack>
  );
};
