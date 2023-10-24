import { persistor, store } from "../store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../locales/i18next";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabsWrapper } from "./tabs";
import { Train } from "./workouts/train";
import { Charts } from "./progress/chart";
import { Create } from "./workouts/create";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "../hooks/navigate";
import { Settings } from "./profile/settings";
import { Measurements } from "./profile/measurements";
import { SafeAreaView } from "../components/Themed/ThemedSaveAreaView/SafeAreaView";
import { ThemeProvider } from "../theme/context";

const Stack = createNativeStackNavigator();

const ThemedApp = () => {
  return (
    <NavigationContainer ref={navigationRef} independent={true}>
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen component={TabsWrapper} options={{ headerShown: false }} name="tabs" />
              <Stack.Screen component={Train} options={{ gestureEnabled: false, headerShown: false }} name="workouts/train/index" />
              <Stack.Screen component={Create} options={{ gestureEnabled: false, headerShown: false }} name="workouts/create/index" />
              <Stack.Screen component={Charts} options={{ headerShown: false }} name="progress/chart/index" />
              <Stack.Screen component={Settings} options={{ headerShown: false }} name="profile/settings/index" />
              <Stack.Screen component={Measurements} options={{ headerShown: false }} name="profile/measurements/index" />
            </Stack.Navigator>
          </SafeAreaView>
        </GestureHandlerRootView>
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default function index() {
  const App = () => {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ThemedApp />
        </PersistGate>
      </Provider>
    );
  };

  return App();
}
