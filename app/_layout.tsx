import { Stack } from "expo-router";
import { persistor, store } from "../store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { backgroundColor } from "./theme/colors";

export default function index() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Stack screenOptions={{ contentStyle: { backgroundColor } }}>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="create/index"
          />
          <Stack.Screen options={{ headerShown: false }} name="index" />
          <Stack.Screen options={{ headerShown: false }} name="train" />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
