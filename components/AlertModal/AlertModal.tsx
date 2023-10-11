import { Text, View } from "react-native";
import { styles } from "./styles";
import { PropsWithChildren } from "react";
import { Modal } from "../Modal/Modal";
import { HStack } from "../HStack/HStack";
import { Button } from "../Button/Button";

interface TrainingNotDoneModalProps extends PropsWithChildren {
  onConfirm?: () => void;
  onCancel: () => void;
  content?: string;
  title?: string;
  isVisible: boolean;
}
export const AlertModal = ({ onConfirm, onCancel, isVisible, content, title, children }: TrainingNotDoneModalProps) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.wrapper}>
        <Text>{title}</Text>
        <Text style={styles.text}>{content}</Text>
        {children}
        <HStack style={styles.buttons}>
          <Button style={{ button: { flex: 1 } }} title="Cancel" theme="secondary" onPress={onCancel} />
          <Button style={{ button: { flex: 1 } }} title="Confirm" theme="primary" onPress={onConfirm} />
        </HStack>
      </View>
    </Modal>
  );
};
