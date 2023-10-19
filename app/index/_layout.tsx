import { Stack } from "expo-router";

export default function index() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen options={{ headerShown: false }} name="create/index" />
      <Stack.Screen options={{ headerShown: false }} name="train/index" />
    </Stack>
  );
}
