import { Pressable } from "react-native";
import React from "react";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

export const TabBarButton = (props: BottomTabBarButtonProps) => {
  return <Pressable {...props} style={{ flex: 1, alignSelf: "center" }} />;
};
