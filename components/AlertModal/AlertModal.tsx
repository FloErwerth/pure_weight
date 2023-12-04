import { styles } from "./styles";
import { PropsWithChildren, RefObject, useCallback, useMemo } from "react";
import { ThemedBottomSheetModal } from "../BottomSheetModal/ThemedBottomSheetModal";
import { HStack } from "../Stack/HStack/HStack";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { borderRadius } from "../../theme/border";
import { ThemedView } from "../Themed/ThemedView/View";
import { Text } from "../Themed/ThemedText/Text";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ThemedPressable } from "../Themed/Pressable/Pressable";

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
    reference: RefObject<BottomSheetModal>;
}
export const AlertModal = ({ reference, onConfirm, onCancel, content, title, children }: TrainingNotDoneModalProps) => {
    const { t } = useTranslation();

    const handleConfirmButton = useCallback(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onConfirm?.();
    }, [onConfirm]);

    const handleCancelButton = useCallback(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onCancel();
    }, [onCancel]);

    const buttonStyle = useMemo(() => ({ flex: 1, padding: 10, borderRadius }), []);

    return (
        <ThemedBottomSheetModal ref={reference}>
            <ThemedView style={styles.innerWrapper}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.text}>{content}</Text>
                {children}
                <HStack style={styles.buttons}>
                    <ThemedPressable input style={buttonStyle} onPress={handleCancelButton}>
                        <Text center input>
                            {t("alert_delete_cancel")}
                        </Text>
                    </ThemedPressable>
                    <ThemedPressable input style={buttonStyle} onPress={handleConfirmButton}>
                        <Text center input>
                            {t("alert_delete_confirm")}
                        </Text>
                    </ThemedPressable>
                </HStack>
            </ThemedView>
        </ThemedBottomSheetModal>
    );
};
