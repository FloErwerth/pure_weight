import { trainStyles } from "../../trainStyles";
import { Text, View } from "react-native";
import { HStack } from "../../../components/HStack/HStack";

interface TrainingHeaderProps {
  showPlaceholderForDoneButton?: boolean;
}
export const TrainingHeader = ({ showPlaceholderForDoneButton = true }: TrainingHeaderProps) => {
  return (
    <HStack style={trainStyles.stack}>
      <Text style={{ flex: 0.55, textAlign: "center", color: "rgb(130,130,130)" }}>#</Text>
      <Text style={{ flex: 0.55, textAlign: "center", color: "rgb(130,130,130)" }}>kg</Text>
      <Text style={{ flex: 0.55, textAlign: "center", color: "rgb(130,130,130)" }}>reps</Text>
      <Text style={{ flex: 1, textAlign: "center", color: "rgb(130,130,130)" }}>notes</Text>
      {showPlaceholderForDoneButton && <View style={{ flex: 0.6, width: 40 }}></View>}
    </HStack>
  );
};
