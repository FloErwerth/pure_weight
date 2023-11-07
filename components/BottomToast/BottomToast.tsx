import { useTranslation } from "react-i18next";
import { Text } from "../Themed/ThemedText/Text";
import { Dimensions, Pressable } from "react-native";
import { ThemedView } from "../Themed/ThemedView/View";
import ReAnimated, { Layout, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { borderRadius } from "../../theme/border";
import { HStack } from "../HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { Button } from "../Themed/Button/Button";
import { useCallback } from "react";

interface BottomToastProps {
  titleKey: string;
  messageKey: string;
  onRedo?: () => void;
  onRequestClose?: () => void;
  open: boolean;
}
const deviceWidth = Dimensions.get("screen").width;

export const BottomToast = ({ titleKey, messageKey, onRedo, open, onRequestClose }: BottomToastProps) => {
  const { t } = useTranslation();

  const handleRequestClose = useCallback(() => {
    if (!onRequestClose) {
      return;
    }
    onRequestClose();
  }, [onRequestClose]);

  if (!open) {
    return null;
  }

  return (
    <ReAnimated.View layout={Layout} entering={SlideInDown} exiting={SlideOutDown}>
      <Pressable onPress={handleRequestClose}>
        <ThemedView
          secondary
          style={{
            gap: 10,
            position: "absolute",
            bottom: 0,
            padding: 20,
            width: deviceWidth,
            borderTopStartRadius: borderRadius,
            borderTopEndRadius: borderRadius,
          }}
        >
          <Text style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}>{t(titleKey)}</Text>
          <Button onPress={onRedo}>
            <HStack style={{ flex: 1, justifyContent: "space-between", paddingHorizontal: 10 }}>
              <Text>{t(messageKey)}</Text>
              <ThemedMaterialCommunityIcons ghost name="undo" size={16} />
            </HStack>
          </Button>
        </ThemedView>
      </Pressable>
    </ReAnimated.View>
  );
};
