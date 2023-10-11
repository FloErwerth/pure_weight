import { ReactNativeModal } from "react-native-modal";
import { PropsWithChildren, useEffect } from "react";
import { LayoutAnimation, View } from "react-native";

interface ModalProps extends PropsWithChildren {
  isVisible: boolean;
}

const Backdrop = () => {
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  return <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)" }} />;
};

export const Modal = ({ isVisible, children }: ModalProps) => {
  return (
    <ReactNativeModal customBackdrop={<Backdrop />} animationIn="fadeIn" animationOut="fadeOut" backdropTransitionInTiming={0} backdropTransitionOutTiming={0} isVisible={isVisible}>
      {children}
    </ReactNativeModal>
  );
};
