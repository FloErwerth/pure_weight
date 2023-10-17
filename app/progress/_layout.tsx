import { Stack } from "expo-router";
import React from "react";

export default function index() {
  return (
    <Stack screenOptions={{ animation: "none", headerShown: false }}>
      <Stack.Screen name="chart/index" />
    </Stack>
  );
}
