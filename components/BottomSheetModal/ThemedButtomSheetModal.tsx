import React, { forwardRef, PropsWithChildren, useMemo, useRef } from "react";
import { View, ViewStyle } from "react-native";
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
}

export const useBottomSheetRef = () => {
  return useRef<BottomSheetModal>(null);
};

const defaultSnapshots = ["50%", "50%", "100%"];
const renderBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />;

// eslint-disable-next-line react/display-name
export const ThemedButtomSheetModal = forwardRef<BottomSheetModal, ThemedBottomSheetModalProps>(({ snapPoints, customContentStyle, children, title, onRequestClose }, ref) => {
  const { inputFieldBackgroundColor } = useTheme();
  const { top } = useSafeAreaInsets();
  const defaultStyle = useMemo(() => [customContentStyle, styles.defaultContentStyle, { backgroundColor: inputFieldBackgroundColor }], [inputFieldBackgroundColor, customContentStyle]);
  const containerRef = useRef<View>(null);

  const combinedSnapshots = useMemo(() => {
    if (!snapPoints) {
      return defaultSnapshots;
    }
    return [snapPoints[0], ...snapPoints];
  }, [snapPoints]);

  return (
    <BottomSheetModal
      index={1}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={defaultStyle}
      enableDismissOnClose
      onDismiss={onRequestClose}
      ref={ref}
      stackBehavior="push"
      topInset={top}
      keyboardBehavior="extend"
      snapPoints={combinedSnapshots}
    >
      <HStack ghost style={styles.wrapper}>
        <View>{title && <Text style={styles.title}>{title}</Text>}</View>
      </HStack>
      <View ref={containerRef}>{children}</View>
    </BottomSheetModal>
  );
});
