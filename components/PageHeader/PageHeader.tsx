import { Text } from "react-native";
import { Button } from "../Button/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { mainColor } from "../../app/theme/colors";
import { HStack } from "../HStack/HStack";
import { styles } from "./styles";

interface PageHeaderProps {
  onPressIcon?: () => void;
  title: string;
}

export const PageHeader = ({ onPressIcon, title }: PageHeaderProps) => {
  return (
    <HStack style={styles.titleWrapper}>
      <Text style={styles.title}>{title}</Text>
      {onPressIcon && (
        <Button theme="ghost" onPress={onPressIcon} style={{ button: styles.button }}>
          <MaterialCommunityIcons color={mainColor} size={40} name="plus" />
        </Button>
      )}
    </HStack>
  );
};
