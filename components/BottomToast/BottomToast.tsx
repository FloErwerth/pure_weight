import { useTranslation } from "react-i18next";
import { Text } from "../Themed/ThemedText/Text";
import { Dimensions, Pressable } from "react-native";
import { ThemedView } from "../Themed/ThemedView/View";
import ReAnimated, { Layout, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { borderRadius } from "../../theme/border";
import { HStack } from "../HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { Button } from "../Themed/Button/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Progress from "react-native-progress";
import { useTheme } from "../../theme/context";

interface BottomToastProps {
  titleKey: string;
  messageKey: string;
  onRedo?: () => void;
  onRequestClose: () => void;
  open: boolean;
}
const deviceWidth = Dimensions.get("screen").width;
const TIME = 5000;
const TIME_STEP = 25;
export const BottomToast = ({ titleKey, messageKey, onRedo, open, onRequestClose }: BottomToastProps) => {
  const { t } = useTranslation();
  const { primaryColor, secondaryColor } = useTheme();
  const timer = useRef<NodeJS.Timeout>();
  const time = useRef<number>(TIME);
  const [progress, setProgress] = useState(1);

  const handleRequestClose = useCallback(() => {
    onRequestClose();
    setProgress(1);
    clearInterval(timer.current);
  }, [onRequestClose]);

  useEffect(() => {
    if (progress < -0.05) {
      handleRequestClose();
    }
  }, [handleRequestClose, progress]);

  useEffect(() => {
    if (open) {
      time.current = TIME;
      timer.current = setInterval(() => {
        setProgress((time.current - TIME_STEP) / TIME);
        time.current -= TIME_STEP;
      }, TIME_STEP);
    } else {
      clearInterval(timer.current);
    }
  }, [open]);

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
        <Progress.Bar width={deviceWidth} indeterminate={false} borderWidth={0} borderRadius={0} unfilledColor={secondaryColor} color={primaryColor} progress={progress}></Progress.Bar>
      </Pressable>
    </ReAnimated.View>
  );
};
