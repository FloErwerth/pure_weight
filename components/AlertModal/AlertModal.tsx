import { styles } from "./styles";
import { PropsWithChildren, RefObject, useCallback, useMemo } from "react";
import { SnapPoint, ThemedBottomSheetModal } from "../BottomSheetModal/ThemedBottomSheetModal";
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
    confirmButtonConfig: {
        localeKey: string;
        onPress: () => void;
    };
    snapPoints?: SnapPoint[];

    cancelButtonConfig: {
        localeKey: string;
        onPress: () => void;
    };
    content?: string | JSX.Element;
    title?: string;
    isVisible?: boolean;
    reference: RefObject<BottomSheetModal>;
}
export const AlertModal = ({ snapPoints = ["25%"], reference, confirmButtonConfig, cancelButtonConfig, content, title, children }: TrainingNotDoneModalProps) => {
    const { t } = useTranslation();

    const handleConfirmButton = useCallback(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        confirmButtonConfig.onPress();
    }, [confirmButtonConfig]);

    const handleCancelButton = useCallback(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        cancelButtonConfig.onPress();
    }, [cancelButtonConfig]);

    const buttonStyle = useMemo(() => ({ flex: 1, padding: 10, borderRadius }), []);

    return (
        <ThemedBottomSheetModal snapPoints={snapPoints} ref={reference}>
            <ThemedView input style={styles.innerWrapper}>
                <Text ghost style={styles.title}>
                    {title}
                </Text>
                <Text ghost style={styles.text}>
                    {content}
                </Text>
                {children}
                <HStack ghost style={styles.buttons}>
                    <ThemedPressable secondary style={buttonStyle} onPress={handleConfirmButton}>
                        <Text center ghost>
                            {t(confirmButtonConfig.localeKey)}
                        </Text>
                    </ThemedPressable>
                    <ThemedPressable secondary style={buttonStyle} onPress={handleCancelButton}>
                        <Text center ghost>
                            {t(cancelButtonConfig.localeKey)}
                        </Text>
                    </ThemedPressable>
                </HStack>
            </ThemedView>
        </ThemedBottomSheetModal>
    );
};
