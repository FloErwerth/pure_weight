import React, { forwardRef, PropsWithChildren, useCallback, useMemo, useRef } from "react";
import { ViewStyle } from "react-native";
import { Text } from "../Themed/ThemedText/Text";
import { HStack } from "../Stack/HStack/HStack";
import { styles } from "./styles";
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "../../theme/context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type SnapPoint = `${number}%`;
export interface ThemedBottomSheetModalProps extends PropsWithChildren {
  title?: string;
  customContentStyle?: ViewStyle;
  style?: ViewStyle;
  onRequestClose?: () => void;
  snapPoints?: SnapPoint[];
  allowSwipeDownToClose?: boolean;
}

export const useBottomSheetRef = () => {
  const ref = useRef<BottomSheetModal>(null);

  const handleOpen = useCallback(() => {
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
export const ThemedButtomSheetModal = forwardRef<BottomSheetModal, ThemedBottomSheetModalProps>(
  ({ snapPoints, customContentStyle, children, title, onRequestClose, allowSwipeDownToClose = true }, ref) => {
    const { mainColor, inputFieldBackgroundColor } = useTheme();
    const { top } = useSafeAreaInsets();
    const defaultStyle = useMemo(
      () => [customContentStyle, styles.defaultContentStyle, { backgroundColor: inputFieldBackgroundColor }],
      [customContentStyle, inputFieldBackgroundColor],
    );

    const combinedSnapshots = useMemo(() => {
      if (!snapPoints) {
        return defaultSnapshots;
      }
      return [snapPoints[0], ...snapPoints];
    }, [snapPoints]);

    const indicatorStyle = useMemo(
      () => ({ backgroundColor: allowSwipeDownToClose ? mainColor : "transparent" }),
      [allowSwipeDownToClose, mainColor],
    );

    return (
      <BottomSheetModal
        enablePanDownToClose={allowSwipeDownToClose}
        index={1}
        handleIndicatorStyle={indicatorStyle}
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
            <Text ghost style={styles.title}>
              {title}
            </Text>
          )}
        </HStack>
        {children}
      </BottomSheetModal>
    );
  },
);
