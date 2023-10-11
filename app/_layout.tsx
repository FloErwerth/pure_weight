import { Stack } from "expo-router";
import { persistor, store } from "../store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

export default function index() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Stack>
          <Stack.Screen
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
            name="create/index"
          />
          <Stack.Screen options={{ headerShown: false, animation: "slide_from_right" }} name="index" />
          <Stack.Screen options={{ headerShown: false, animation: "slide_from_left" }} name="train" />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
