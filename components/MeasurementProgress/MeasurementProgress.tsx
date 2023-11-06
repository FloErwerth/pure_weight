import { ThemedView } from "../Themed/ThemedView/View";
import { Text } from "../Themed/ThemedText/Text";
import { styles } from "./styles";
import { HStack } from "../HStack/HStack";
import { Pressable } from "react-native";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { useAppSelector } from "../../store";
import { getMeasurmentProgress } from "../../store/selectors";
import { AppState } from "../../store/types";

interface MeasurementProgressProps {
  measurementIndex: number;
}
export const MeasurementProgress = ({ measurementIndex }: MeasurementProgressProps) => {
  const progress = useAppSelector((state: AppState) => getMeasurmentProgress(state)(measurementIndex));

  if (!progress) {
    return null;
  }

  const { absolute, unit } = progress;

  return (
    <ThemedView style={styles.wrapper} secondary>
      <Pressable>
        <HStack style={styles.pressableStack}>
          <Text>
            {absolute} {unit}
          </Text>
          <ThemedMaterialCommunityIcons secondary name="arrow-right" size={16} />
        </HStack>
      </Pressable>
    </ThemedView>
  );
};
