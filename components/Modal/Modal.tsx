import { ReactNativeModal } from "react-native-modal";
import React, { PropsWithChildren, ReactNode } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { ThemedView } from "../Themed/ThemedView/View";
import { Text } from "../Themed/ThemedText/Text";
import { HStack } from "../HStack/HStack";
import { useTheme } from "../../theme/context";
import { useAppSelector } from "../../store";
import { getThemeKey } from "../../store/selectors";
import { styles } from "./styles";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";

export interface ModalProps extends PropsWithChildren {
  isVisible?: boolean;
  onRequestClose?: () => void;
  customBackdrop?: ReactNode;
  title?: string;
  backgroundOpacity?: number;
  customContentStyle?: ViewStyle;
  style?: ViewStyle;
}

const Backdrop = () => {
  return <View style={{ flex: 1, backgroundColor: "black" }} />;
};

export const Modal = ({ customContentStyle, backgroundOpacity, isVisible = true, children, onRequestClose, title, customBackdrop, style }: ModalProps) => {
  const { mainColor, backgroundColor } = useTheme();
  const theme = useAppSelector(getThemeKey);

  const computedColor = theme === "dark" ? mainColor : backgroundColor;

  return (
    <ReactNativeModal
      backdropOpacity={backgroundOpacity ?? 0.9}
      customBackdrop={customBackdrop ?? <Backdrop />}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      isVisible={isVisible}
      style={style}
    >
      <HStack ghost style={styles.wrapper}>
        <View>{title && <Text style={styles.title}>{title}</Text>}</View>
        {onRequestClose && (
          <Pressable onPress={() => onRequestClose()} style={styles.buttonStyle}>
            <ThemedMaterialCommunityIcons ghost name="close" size={24} color={computedColor} />
          </Pressable>
        )}
      </HStack>
      <ThemedView style={customContentStyle ?? styles.defaultContentStyle}>{children}</ThemedView>
    </ReactNativeModal>
  );
};
