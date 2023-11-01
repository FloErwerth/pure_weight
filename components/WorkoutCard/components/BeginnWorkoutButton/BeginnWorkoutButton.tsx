import { Pressable } from "react-native";
import { Text } from "../../../Themed/ThemedText/Text";
import { styles } from "./styles";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { HStack } from "../../../HStack/HStack";
import { useTranslation } from "react-i18next";

interface BeginnWorkoutButtonProps {
  onClick: () => void;
}
export const BeginnWorkoutButton = ({ onClick }: BeginnWorkoutButtonProps) => {
  const { t } = useTranslation();
  return (
    <ThemedView style={styles.wrapper} secondary>
      <Pressable onPress={onClick}>
        <HStack style={styles.innerWrapper}>
          <Text style={styles.title}>{t("workout_new")}</Text>
        </HStack>
      </Pressable>
    </ThemedView>
  );
};
