import { useAppSelector } from "../../../store";
import { getTrainingIndex } from "../../../store/selectors";
import { Pressable } from "react-native";
import React from "react";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

export const TabBarButton = (props: BottomTabBarButtonProps) => {
  const trainingIndex = useAppSelector(getTrainingIndex);
  return <Pressable disabled={trainingIndex !== undefined} {...props} style={{ flex: 1, alignSelf: "center" }} />;
};
