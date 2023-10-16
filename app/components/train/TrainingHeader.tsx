import { trainStyles } from "../../train/trainStyles";
import { View } from "react-native";
import { HStack } from "../../../components/HStack/HStack";
import { Text } from "../../../components/Text/Text";

interface TrainingHeaderProps {
  showPlaceholderForDoneButton?: boolean;
}
export const TrainingHeader = ({ showPlaceholderForDoneButton = true }: TrainingHeaderProps) => {
  return (
    <HStack style={trainStyles.stack}>
      <Text style={{ flex: 0.55, textAlign: "center", color: "rgb(130,130,130)", fontSize: 16 }}>#</Text>
      <Text style={{ flex: 0.55, textAlign: "center", color: "rgb(130,130,130)", fontSize: 16 }}>kg</Text>
      <Text style={{ flex: 0.55, textAlign: "center", color: "rgb(130,130,130)", fontSize: 16 }}>reps</Text>
      <Text style={{ flex: 1, textAlign: "center", color: "rgb(130,130,130)", fontSize: 16 }}>notes</Text>
      {showPlaceholderForDoneButton && <View style={{ flex: 0.6, width: 40 }}></View>}
    </HStack>
  );
};
