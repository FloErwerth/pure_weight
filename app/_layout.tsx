import { persistor, store } from "../store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../locales/i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabsWrapper } from "./tabs";
import { Train } from "./workouts/train";
import { Charts } from "./progress/chart";
import { Create } from "./workouts/create";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "../hooks/navigate";
import { Settings } from "./profile/settings";

const Stack = createNativeStackNavigator();

export default function index() {
  const App = () => {
    const insets = useSafeAreaInsets();

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingLeft: insets.left, paddingTop: insets.top, paddingRight: insets.right }}>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <NavigationContainer ref={navigationRef} independent={true}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen component={TabsWrapper} options={{ headerShown: false }} name="tabs" />
                  <Stack.Screen component={Train} options={{ headerShown: false }} name="workouts/train/index" />
                  <Stack.Screen component={Create} options={{ headerShown: false }} name="workouts/create/index" />
                  <Stack.Screen component={Charts} options={{ headerShown: false }} name="progress/chart/index" />
                  <Stack.Screen component={Settings} options={{ headerShown: false }} name="profile/settings/index" />
                </Stack.Navigator>
              </NavigationContainer>
            </PersistGate>
          </Provider>
        </View>
      </GestureHandlerRootView>
    );
  };

  return App();
}
