import React, { forwardRef, PropsWithChildren, useCallback, useMemo, useRef } from "react";
import { Keyboard, ViewStyle } from "react-native";
import { Text } from "../Themed/ThemedText/Text";
import { HStack } from "../Stack/HStack/HStack";
import { styles } from "./styles";
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "../../theme/context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "../Themed/ThemedView/View";

export type SnapPoint = `${number}%`;
export interface ThemedBottomSheetModalProps extends PropsWithChildren {
    title?: string;
    customContentStyle?: ViewStyle;
    hideIndicator?: boolean;
    style?: ViewStyle;
    onRequestClose?: () => void;
    snapPoints?: SnapPoint[];
    allowSwipeDownToClose?: boolean;
}

export const useBottomSheetRef = () => {
    const ref = useRef<BottomSheetModal>(null);
    const handleOpen = useCallback(() => {
        Keyboard.dismiss();
        ref.current?.present();
    }, []);

    const handleClose = useCallback(() => {
        ref.current?.close();
    }, []);

    return [ref, handleOpen, handleClose] as const;
};

const defaultSnapshots = ["50%", "50%", "100%"];
const renderBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />;

// eslint-disable-next-line react/display-name
export const ThemedBottomSheetModal = forwardRef<BottomSheetModal, ThemedBottomSheetModalProps>(
    ({ hideIndicator, snapPoints, customContentStyle, children, title, onRequestClose, allowSwipeDownToClose = true }, ref) => {
        const { mainColor, inputFieldBackgroundColor } = useTheme();
        const { top, bottom } = useSafeAreaInsets();
        const defaultStyle = useMemo(() => [customContentStyle, styles.defaultContentStyle, { backgroundColor: inputFieldBackgroundColor }], [customContentStyle, inputFieldBackgroundColor]);

        const combinedSnapshots = useMemo(() => {
            if (!snapPoints) {
                return defaultSnapshots;
            }
            return [snapPoints[0], ...snapPoints];
        }, [snapPoints]);

        const customIndicator = useMemo(() => ({ backgroundColor: allowSwipeDownToClose && !hideIndicator ? mainColor : "transparent" }), [allowSwipeDownToClose, hideIndicator, mainColor]);
        const contentStyle = useMemo(() => ({ paddingBottom: bottom }), [bottom]);
        return (
            <BottomSheetModal
                enablePanDownToClose={allowSwipeDownToClose}
                index={1}
                handleIndicatorStyle={customIndicator}
                enableDynamicSizing={false}
                backdropComponent={renderBackdrop}
                backgroundStyle={defaultStyle}
                enableDismissOnClose={allowSwipeDownToClose}
                onDismiss={onRequestClose}
                ref={ref}
                stackBehavior="push"
                topInset={top}
                keyboardBehavior="extend"
                snapPoints={combinedSnapshots}
            >
                <HStack ghost style={styles.wrapper}>
                    {title && (
                        <Text input placeholder style={styles.title}>
                            {title}
                        </Text>
                    )}
                </HStack>
                <ThemedView ghost stretch style={contentStyle}>
                    {children}
                </ThemedView>
            </BottomSheetModal>
        );
    },
);
