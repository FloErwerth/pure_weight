import { ThemedView } from "../Themed/ThemedView/View";
import { Text } from "../Themed/ThemedText/Text";
import { styles } from "./styles";
import { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PressableRowWithIconSlots } from "../PressableRowWithIconSlots/PressableRowWithIconSlots";
import { IsoDate } from "../../types/date";
import { ProgressDisplay } from "./components/ProgressDisplay/ProgressDisplay";
import { BeginnWorkoutButton } from "./components/BeginnWorkoutButton/BeginnWorkoutButton";

type Option = {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  hide?: boolean;
  size?: number;
  disabled?: boolean;
  onLongPress?: () => void;
  onPress?: () => void;
  text?: string;
};

interface WorkoutCardProps {
  workoutName: string;
  onClick: () => void;
  Icon1: Option;
  Icon2: Option;
  overallTrainingData: { date?: IsoDate; diff?: { absolute: number; percent: string } };
  handleNavigateToProgress: () => void;
}

export const WorkoutCard = ({ handleNavigateToProgress, overallTrainingData, workoutName, Icon2, Icon1, onClick }: WorkoutCardProps) => {
  return (
    <ThemedView component style={styles.wrapper}>
      <PressableRowWithIconSlots Icon1={Icon1} Icon2={Icon2}>
        <Text style={styles.title}>{workoutName}</Text>
      </PressableRowWithIconSlots>
      <ProgressDisplay handleNavigateToProgress={handleNavigateToProgress} overallTrainingData={overallTrainingData} />
      <BeginnWorkoutButton onClick={onClick} />
    </ThemedView>
  );
};
