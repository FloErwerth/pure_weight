import { ReactNativeModal } from "react-native-modal";
import React, { PropsWithChildren } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { ThemedView } from "../Themed/ThemedView/View";
import { Text } from "../Themed/ThemedText/Text";
import { HStack } from "../HStack/HStack";
import { useTheme } from "../../theme/context";
import { useAppSelector } from "../../store";
import { getThemeKey } from "../../store/selectors";
import { styles } from "./styles";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

export interface ModalProps extends PropsWithChildren {
  isVisible?: boolean;
  onRequestClose?: () => void;
  title?: string;
  customContentStyle?: ViewStyle;
  style?: ViewStyle;
}

const Backdrop = () => {
  return <Animated.View layout={Layout} entering={FadeIn.duration(100)} exiting={FadeOut.duration(100)} style={{ flex: 1, backgroundColor: "black" }} />;
};

export const Modal = ({ customContentStyle, isVisible = true, children, onRequestClose, title, style }: ModalProps) => {
  const { mainColor, backgroundColor } = useTheme();
  const theme = useAppSelector(getThemeKey);

  const computedColor = theme === "dark" ? mainColor : backgroundColor;

  return (
    <Animated.View layout={Layout} entering={FadeIn.duration(100)} exiting={FadeOut.duration(100)}>
      <ReactNativeModal
        useNativeDriver={false}
        useNativeDriverForBackdrop={false}
        customBackdrop={<Backdrop />}
        onBackdropPress={onRequestClose}
        coverScreen
        animationIn="slideInUp"
        animationOut="slideOutDown"
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
    </Animated.View>
  );
};
