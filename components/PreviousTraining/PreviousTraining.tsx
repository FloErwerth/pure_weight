import { View } from "react-native";
import { useAppSelector } from "../../store";
import { getPreviousTraining } from "../../store/selectors";
import { TrainingHeader } from "../../app/components/train/TrainingHeader";
import { DoneSetDisplayRow } from "../DoneSetDisplayRow/DoneSetDisplayRow";
import { Modal } from "../Modal/Modal";
import { useState } from "react";
import { Button } from "../Button/Button";
import { mainColor } from "../../app/theme/colors";

export const PreviousTraining = () => {
  const previousTraining = useAppSelector(getPreviousTraining);
  const [showPreviousTraining, setShowPreviousTraining] = useState(false);

  return (
    <>
      {previousTraining?.length > 0 && (
        <Button
          theme="ghost"
          title="Show previous training stats"
          style={{
            button: {
              alignSelf: "center",
            },
            text: {
              color: mainColor,
            },
          }}
          onPress={() => setShowPreviousTraining(true)}
        />
      )}
      <Modal title="Your previous training" isVisible={showPreviousTraining} onRequestClose={() => setShowPreviousTraining(false)}>
        <TrainingHeader showPlaceholderForDoneButton={false} />
        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: "black" }}></View>
        {previousTraining.map(({ weight, reps, note }, index) => (
          <DoneSetDisplayRow key={weight + reps + note + index} setNumber={index + 1} setData={{ weight, reps, note }} />
        ))}
      </Modal>
    </>
  );
};
