import { ReactNativeModal } from "react-native-modal";
import React, { PropsWithChildren, ReactNode, useEffect } from "react";
import { LayoutAnimation, View } from "react-native";
import { Button } from "../Button/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { borderRadius } from "../App/theme/border";
import { ThemedView } from "../View/View";
import { mainColor } from "../App/theme/colors";
import { Text } from "../Text/Text";
import { HStack } from "../HStack/HStack";

interface ModalProps extends PropsWithChildren {
  isVisible: boolean;
  onRequestClose?: () => void;
  customBackdrop?: ReactNode;
  title?: string;
  backgroundOpacity?: number;
}

const Backdrop = () => {
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  return <View style={{ flex: 1, backgroundColor: "black" }} />;
};

export const Modal = ({ backgroundOpacity, isVisible, children, onRequestClose, title, customBackdrop }: ModalProps) => {
  return (
    <ReactNativeModal
      backdropOpacity={backgroundOpacity ?? 0.9}
      customBackdrop={customBackdrop ?? <Backdrop />}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      isVisible={isVisible}
    >
      <HStack style={{ justifyContent: "space-between", alignItems: "center" }}>
        <View>{title && <Text style={{ color: mainColor, fontSize: 20, paddingLeft: 10, padding: 0, margin: 0 }}>{title}</Text>}</View>
        {onRequestClose && (
          <Button onPress={() => onRequestClose()} style={{ button: { padding: 10 } }} theme="ghost">
            <MaterialCommunityIcons name="close" color={mainColor} size={24} />
          </Button>
        )}
      </HStack>
      <ThemedView style={{ borderRadius, padding: 10 }}>{children}</ThemedView>
    </ReactNativeModal>
  );
};
