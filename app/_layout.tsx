import { persistor, store, useAppDispatch } from "../store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../locales/i18next";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabsWrapper } from "./tabs";
import { Train } from "./workouts/train";
import { Progress } from "./workouts/progress";
import { Create } from "./workouts/create";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "../hooks/navigate";
import { Settings } from "./profile/settings";
import { SafeAreaView } from "../components/Themed/ThemedSaveAreaView/SafeAreaView";
import { ThemeProvider } from "../theme/context";
import { RootSiblingParent } from "react-native-root-siblings";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Application from "expo-application";
import { setInstallAppTime } from "../store/reducer";

const Stack = createNativeStackNavigator();

const ThemedApp = () => {
  const dispatch = useAppDispatch();

  Application.getInstallationTimeAsync().then((date) => {
    dispatch(setInstallAppTime(date.getTime()));
  });

  return (
    <NavigationContainer ref={navigationRef} independent={true}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <RootSiblingParent>
            <BottomSheetModalProvider>
              <SafeAreaView>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen component={TabsWrapper} options={{ headerShown: false }} name="tabs" />
                  <Stack.Screen component={Train} options={{ gestureEnabled: false, headerShown: false }} name="workouts/train/index" />
                  <Stack.Screen component={Create} options={{ gestureEnabled: false, headerShown: false }} name="workouts/create/index" />
                  <Stack.Screen component={Progress} options={{ headerShown: false }} name="workouts/progress/index" />
                  <Stack.Screen component={Settings} options={{ headerShown: false }} name="profile/settings/index" />
                </Stack.Navigator>
              </SafeAreaView>
            </BottomSheetModalProvider>
          </RootSiblingParent>
        </ThemeProvider>
      </GestureHandlerRootView>
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
