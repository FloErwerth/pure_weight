import { Stack } from "expo-router";
import React from "react";

export default function index() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen options={{ headerShown: false }} name="index" />
    </Stack>
  );
}
