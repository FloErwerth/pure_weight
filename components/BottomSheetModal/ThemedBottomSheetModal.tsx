import React, { forwardRef, PropsWithChildren, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, ViewStyle } from "react-native";
import { Text } from "../Themed/ThemedText/Text";
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

const refs: RefObject<BottomSheetModal>[] = [];
export const useBottomSheetRef = () => {
    const ref = useRef<BottomSheetModal>(null);
    const [isOpen, setIsOpen] = useState(false);
    const openBottomSheet = useCallback(() => {
        setIsOpen(true);
        Keyboard.dismiss();
        ref.current?.present();
    }, []);

    const closeBottomSheet = useCallback(() => {
        setIsOpen(false);
        ref.current?.close();
    }, []);

    const closeAll = useCallback(() => {
        refs.forEach((ref) => ref.current?.close());
        setIsOpen(false);
    }, []);

    useEffect(() => {
        refs.push(ref);
        return () => {
            refs.splice(refs.indexOf(ref), 1);
        };
    }, []);

    return useMemo(() => ({ ref, openBottomSheet, closeBottomSheet, closeAll, isOpen }), [closeAll, closeBottomSheet, isOpen, openBottomSheet]);
};

const defaultSnapshots = ["50%", "50%", "100%"];
const renderBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop opacity={0.8} appearsOnIndex={0} disappearsOnIndex={-1} {...props} />;

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
        const titleWrapperStyle = useMemo(() => [styles.wrapper, {}], [inputFieldBackgroundColor]);

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
                <ThemedView ghost style={titleWrapperStyle}>
                    {title && (
                        <Text input style={styles.title}>
                            {title}
                        </Text>
                    )}
                </ThemedView>
                <ThemedView ghost stretch style={contentStyle}>
                    {children}
                </ThemedView>
            </BottomSheetModal>
        );
    },
);
