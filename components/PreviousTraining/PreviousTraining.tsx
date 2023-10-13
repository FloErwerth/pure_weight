import { useAppSelector } from "../../store";
import { getPreviousTraining } from "../../store/selectors";
import { TrainingHeader } from "../../app/components/train/TrainingHeader";
import { DoneSetDisplayRow } from "../DoneSetDisplayRow/DoneSetDisplayRow";
import { componentBackgroundColor, mainDisabledColor } from "../../app/theme/colors";
import { Text } from "../Text/Text";
import { View } from "react-native";
import { borderRadius } from "../../app/theme/border";
import { VStack } from "../VStack/VStack";

export const PreviousTraining = () => {
  const previousTraining = useAppSelector(getPreviousTraining);
  return (
    <View>
      <Text style={{ fontSize: 16, marginBottom: 10, color: mainDisabledColor }}>Your previous training</Text>
      <View style={{ paddingTop: 10, paddingBottom: 15, borderRadius, backgroundColor: componentBackgroundColor }}>
        {previousTraining?.length > 0 && (
          <VStack style={{ gap: 10 }}>
            <TrainingHeader showPlaceholderForDoneButton={false} />
            {previousTraining?.map(({ weight, reps, note }, index) => <DoneSetDisplayRow key={weight + reps + note + index} setNumber={index + 1} setData={{ weight, reps, note }} />)}
          </VStack>
        )}
      </View>
    </View>
  );
};
