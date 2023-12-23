import { persistor, store, useAppDispatch, useAppSelector } from "../store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../locales/i18next";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabsWrapper } from "./tabs";
import { Train } from "./workouts/train";
import { WorkoutProgress } from "./workouts/progress";
import { Create } from "./workouts/create";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef, RoutesParamaters } from "../hooks/navigate";
import { SafeAreaView } from "../components/Themed/ThemedSaveAreaView/SafeAreaView";
import { ThemeProvider } from "../theme/context";
import { RootSiblingParent } from "react-native-root-siblings";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { WorkoutHistory } from "./workouts/history";
import DeviceInfo from "react-native-device-info";
import { IsoDate } from "../types/date";
import { setAppInstallDate } from "../store/reducers/metadata";
import { getAppInstallDate } from "../store/reducers/metadata/metadataSelectors";
import { Display } from "../components/App/settings/Sections/display";
import { GeneralSettings } from "../components/App/settings/Sections/generalSettings";
import { MeasurementProgress } from "./measurements/progress";
import { Manual } from "./settings/manual";

const Stack = createNativeStackNavigator<RoutesParamaters>();

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
                                    <Stack.Screen component={WorkoutProgress} options={{ headerShown: false }} name="workouts/progress/index" />
                                    <Stack.Screen component={WorkoutHistory} options={{ headerShown: false }} name="workouts/workoutHistory/index" />
                                    <Stack.Screen component={Display} options={{ headerShown: false }} name="settings/display/index" />
                                    <Stack.Screen component={GeneralSettings} options={{ headerShown: false }} name="settings/workout/index" />
                                    <Stack.Screen component={MeasurementProgress} options={{ headerShown: false }} name="measurement/progress/index" />
                                    <Stack.Screen component={Manual} options={{ headerShown: false }} name="settings/manual/index" />
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
