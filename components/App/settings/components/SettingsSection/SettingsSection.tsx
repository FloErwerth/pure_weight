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
export const SettingsSection = ({ onPress, children, title }: SettingsSectionProps) => {
  return (
    <Pressable onPress={onPress} style={styles.outerWrapper}>
      {!children ? (
        <HStack style={styles.innerWrapper}>
          <Text style={styles.title}>{title}</Text>
          <MaterialCommunityIcons name="arrow-right" color={mainColor} size={26} />
        </HStack>
      ) : (
        <View style={styles.innerWrapperChildren}>
          <Text style={styles.title}>{title}</Text>
          {children}
        </View>
      )}
    </Pressable>
  );
};
