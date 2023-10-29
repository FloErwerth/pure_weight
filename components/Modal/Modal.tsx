import { ReactNativeModal } from "react-native-modal";
import React, { PropsWithChildren, ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { Button } from "../Themed/Button/Button";
import { borderRadius } from "../../theme/border";
import { ThemedView } from "../Themed/ThemedView/View";
import { Text } from "../Themed/ThemedText/Text";
import { HStack } from "../HStack/HStack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../theme/context";
import { useAppSelector } from "../../store";
import { getThemeKey } from "../../store/selectors";

export interface ModalProps extends PropsWithChildren {
  isVisible?: boolean;
  onRequestClose?: () => void;
  customBackdrop?: ReactNode;
  title?: string;
  backgroundOpacity?: number;
  customContentStyle?: ViewStyle;
  style?: ViewStyle;
}

const Backdrop = () => {
  return <View style={{ flex: 1, backgroundColor: "black" }} />;
};

export const Modal = ({ customContentStyle, backgroundOpacity, isVisible = true, children, onRequestClose, title, customBackdrop, style }: ModalProps) => {
  const { mainColor, backgroundColor } = useTheme();
  const theme = useAppSelector(getThemeKey);
  return (
    <ReactNativeModal
      backdropOpacity={backgroundOpacity ?? 0.9}
      customBackdrop={customBackdrop ?? <Backdrop />}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      isVisible={isVisible}
      style={style}
    >
      <HStack style={{ justifyContent: "space-between", alignItems: "center" }}>
        <View>{title && <Text style={{ fontSize: 20, paddingLeft: 10, padding: 0, margin: 0 }}>{title}</Text>}</View>
        {onRequestClose && (
          <Button theme="ghost" onPress={() => onRequestClose()} style={{ button: { padding: 10 } }}>
            <MaterialCommunityIcons name="close" size={24} color={theme === "dark" ? mainColor : backgroundColor} />
          </Button>
        )}
      </HStack>
      <ThemedView style={customContentStyle ?? { borderRadius, padding: 10 }}>{children}</ThemedView>
    </ReactNativeModal>
  );
};
