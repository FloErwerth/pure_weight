import { GestureResponderEvent, Pressable } from "react-native";
import React, { useCallback } from "react";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";

export const TabBarButton = (props: BottomTabBarButtonProps) => {
  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent) => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      props?.onPress?.(e);
    },
    [props],
  );

  return <Pressable {...props} onPress={handlePress} style={{ flex: 1, alignSelf: "center" }} />;
};
