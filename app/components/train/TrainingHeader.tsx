import { trainStyles } from "../../trainStyles";
import { View, Text } from "react-native";
import { HStack } from "../../../components/HStack/HStack";

interface TrainingHeaderProps {
  disabled: boolean;
}
export const TrainingHeader = ({ disabled }: TrainingHeaderProps) => {
  return (
    <HStack style={{ opacity: disabled ? 0 : 1, ...trainStyles.stack }}>
      <Text style={{ flex: 0.15 }}>#</Text>
      <View style={{ flex: 0.4 }}>
        <Text>kg</Text>
      </View>
      <View style={{ flex: 0.4 }}>
        <Text>reps</Text>
      </View>
      <View style={{ flex: 0.4 }}>
        <Text>notes</Text>
      </View>
      <View style={{ flex: 0.35 }}></View>
    </HStack>
  );
};
