import { ThemedView } from "../../../../components/View/View";
import { PropsWithChildren } from "react";
import { styles } from "./styles";
import { View } from "react-native";
import { Text } from "../../../../components/Text/Text";

interface SettingsSectionProps extends PropsWithChildren {
  title: string;
}
export const SettingsSection = ({ children, title }: SettingsSectionProps) => {
  return (
    <View style={styles.outerWrapper}>
      <Text style={styles.title}>{title}</Text>
      <ThemedView style={styles.innerWrapper}>{children}</ThemedView>
    </View>
  );
};
