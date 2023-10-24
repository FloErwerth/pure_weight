import { PropsWithChildren, useMemo } from "react";
import { styles } from "./styles";
import { Pressable, View } from "react-native";
import { Text } from "../../../../Themed/ThemedText/Text";
import { HStack } from "../../../../HStack/HStack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../../../../theme/context";

interface SettingsSectionProps extends PropsWithChildren {
  title: string;
  onPress?: () => void;
}
export const ProfileSection = ({ onPress, title }: SettingsSectionProps) => {
  const { mainColor, componentBackgroundColor } = useTheme();
  const wrapperStyle = useMemo(() => [styles.outerWrapper, { backgroundColor: componentBackgroundColor }], [componentBackgroundColor]);
  return (
    <Pressable onPress={onPress} style={wrapperStyle}>
      <HStack style={styles.innerWrapper}>
        <Text style={styles.title}>{title}</Text>
        <MaterialCommunityIcons name="arrow-right" color={mainColor} size={26} />
      </HStack>
    </Pressable>
  );
};

export const ProfileContent = ({ onPress, children, title }: SettingsSectionProps) => {
  const { componentBackgroundColor } = useTheme();
  const wrapperStyle = useMemo(() => [styles.outerWrapper, { backgroundColor: componentBackgroundColor }], [componentBackgroundColor]);

  return (
    <Pressable onPress={onPress} style={wrapperStyle}>
      <View style={styles.innerWrapperChildren}>
        <Text style={styles.title}>{title}</Text>
        {children}
      </View>
    </Pressable>
  );
};
