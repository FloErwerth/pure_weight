import { ReactNativeModal } from "react-native-modal";
import { PropsWithChildren, useEffect } from "react";
import { LayoutAnimation, View } from "react-native";
import { Button } from "../Button/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { borderRadius } from "../../app/theme/border";

interface ModalProps extends PropsWithChildren {
  isVisible: boolean;
  onRequestClose?: () => void;
}

const Backdrop = () => {
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  return <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)" }} />;
};

export const Modal = ({ isVisible, children, onRequestClose }: ModalProps) => {
  return (
    <ReactNativeModal customBackdrop={<Backdrop />} animationIn="fadeIn" animationOut="fadeOut" backdropTransitionInTiming={0} backdropTransitionOutTiming={0} isVisible={isVisible}>
      {onRequestClose && (
        <Button onPress={() => onRequestClose()} style={{ button: { alignSelf: "flex-end", alignItems: "flex-end", padding: 10 } }} theme="ghost">
          <MaterialCommunityIcons name="close" size={24} />
        </Button>
      )}
      <View style={{ backgroundColor: "white", borderRadius, padding: 10 }}>{children}</View>
    </ReactNativeModal>
  );
};
