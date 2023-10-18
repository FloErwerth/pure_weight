import { Text, View } from "react-native";
import { styles } from "./styles";
import { PropsWithChildren, useCallback, useEffect } from "react";
import { Modal } from "../Modal/Modal";
import { HStack } from "../HStack/HStack";
import { Button } from "../Button/Button";
import * as Haptics from "expo-haptics";

interface TrainingNotDoneModalProps extends PropsWithChildren {
  onConfirm?: () => void;
  onCancel: () => void;
  content?: string;
  title?: string;
  isVisible: boolean;
}
export const AlertModal = ({ onConfirm, onCancel, isVisible, content, title, children }: TrainingNotDoneModalProps) => {
  useEffect(() => {
    if (isVisible) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [isVisible]);

  const handleConfirmButton = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onConfirm?.();
  }, [onConfirm]);

  const handleCancelButton = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCancel();
  }, [onCancel]);

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{content}</Text>
        {children}
        <HStack style={styles.buttons}>
          <Button style={{ button: { flex: 1 } }} title="Cancel" theme="secondary" onPress={handleCancelButton} />
          <Button style={{ button: { flex: 1 } }} title="Confirm" theme="primary" onPress={handleConfirmButton} />
        </HStack>
      </View>
    </Modal>
  );
};
