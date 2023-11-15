import { persistor, store, useAppDispatch, useAppSelector } from "../store";
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
import { WorkoutHistory } from "./profile/history";
import { getAppInstallDate } from "../store/selectors";
import DeviceInfo from "react-native-device-info";
import { setAppInstallDate } from "../store/reducer";
import { IsoDate } from "../types/date";

const Stack = createNativeStackNavigator();

const ThemedApp = () => {
  const dispatch = useAppDispatch();
  const installDate = useAppSelector(getAppInstallDate);

  if (!installDate) {
    DeviceInfo.getFirstInstallTime().then((installTime) => {
      const date = new Date(installTime ?? 0).toISOString().split("T")[0];
      dispatch(setAppInstallDate(date as IsoDate));
    });
  }

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
                  <Stack.Screen component={WorkoutHistory} options={{ headerShown: false }} name="profile/workoutHistory/index" />
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
