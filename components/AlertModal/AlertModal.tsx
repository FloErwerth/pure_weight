import {Text, View, Pressable} from "react-native";
import { styles } from "./styles";
import { PropsWithChildren } from "react";
import { Modal } from "../Modal/Modal";

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
        <View style={styles.buttons}>
          <Pressable style={styles.button} onPress={onCancel}>
            <Text>Cancel</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onConfirm}>
            <Text>Confirm</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
