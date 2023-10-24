import { styles } from "./styles";
import { PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import { Modal } from "../Modal/Modal";
import { HStack } from "../HStack/HStack";
import { Button } from "../Themed/Button/Button";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { borderRadius } from "../../theme/border";
import { ThemedView } from "../Themed/ThemedView/View";
import { Text } from "../Themed/ThemedText/Text";

export type AlertConfig = {
  title: string;
  content: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

interface TrainingNotDoneModalProps extends PropsWithChildren {
  onConfirm?: () => void;
  onCancel: () => void;
  content?: string;
  title?: string;
  isVisible?: boolean;
}
export const AlertModal = ({ onConfirm, onCancel, isVisible, content, title, children }: TrainingNotDoneModalProps) => {
  const { t } = useTranslation();

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

  const buttonStyle = useMemo(() => ({ button: { flex: 1, padding: 10, borderRadius } }), []);

  return (
    <Modal isVisible={isVisible}>
      <ThemedView style={styles.innerWrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{content}</Text>
        {children}
        <HStack style={styles.singleButton}>
          <Button style={buttonStyle} title={t("alert_delete_cancel")} onPress={handleCancelButton} />
          <Button style={buttonStyle} title={t("alert_delete_confirm")} onPress={handleConfirmButton} />
        </HStack>
      </ThemedView>
    </Modal>
  );
};
