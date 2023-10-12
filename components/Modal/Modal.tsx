import { ReactNativeModal } from "react-native-modal";
import { PropsWithChildren, useEffect } from "react";
import { LayoutAnimation, View } from "react-native";
import { Button } from "../Button/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { borderRadius } from "../../app/theme/border";
import { ThemedView } from "../View/View";
import { mainColor } from "../../app/theme/colors";
import { Text } from "../Text/Text";
import { HStack } from "../HStack/HStack";

interface ModalProps extends PropsWithChildren {
  isVisible: boolean;
  onRequestClose?: () => void;
  title?: string;
}

const Backdrop = () => {
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  return <View style={{ flex: 1, backgroundColor: "black" }} />;
};

export const Modal = ({ isVisible, children, onRequestClose, title }: ModalProps) => {
  return (
    <ReactNativeModal
      backdropOpacity={0.9}
      customBackdrop={<Backdrop />}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      isVisible={isVisible}
    >
      <HStack style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
        {title && <Text style={{ color: mainColor, alignSelf: "center", fontSize: 20, padding: 0, margin: 0 }}>{title}</Text>}
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
