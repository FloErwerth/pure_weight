import { PropsWithChildren } from "react";
import { styles } from "./styles";
import { Pressable, View } from "react-native";
import { Text } from "../../../../Text/Text";
import { HStack } from "../../../../HStack/HStack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { mainColor } from "../../../theme/colors";

interface SettingsSectionProps extends PropsWithChildren {
  title: string;
  onPress?: () => void;
}
export const ProfileSection = ({ onPress, title }: SettingsSectionProps) => {
  return (
    <Pressable onPress={onPress} style={styles.outerWrapper}>
      <HStack style={styles.innerWrapper}>
        <Text style={styles.title}>{title}</Text>
        <MaterialCommunityIcons name="arrow-right" color={mainColor} size={26} />
      </HStack>
    </Pressable>
  );
};

export const ProfileContent = ({ onPress, children, title }: SettingsSectionProps) => {
  return (
    <Pressable onPress={onPress} style={styles.outerWrapper}>
      <View style={styles.innerWrapperChildren}>
        <Text style={styles.title}>{title}</Text>
        {children}
      </View>
    </Pressable>
  );
};
