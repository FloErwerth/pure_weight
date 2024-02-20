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
import { setAppInstallDate, setEmptyState, setFirstTimeRendered } from "../store/reducers/metadata";
import { getIsFirstTimeRendered } from "../store/reducers/metadata/metadataSelectors";
import { GeneralSettings } from "../components/App/settings/Sections/generalSettings";
import { Manual } from "./settings/manual";
import { useTranslation } from "react-i18next";
import { Appearance, NativeModules } from "react-native";
import { setLanguage, setTheme } from "../store/reducers/settings";
import { WorkoutHistoryEdit } from "./workouts/history/edit";
import { getReactNativeTheme } from "../store/reducers/settings/settingsSelectors";
import { CreateExercise } from "./workouts/create/exercise";
import { MeasurementHistory } from "./measurements/history";
import { CreateMeasurement } from "./measurements/create";
import { MeasurementProgress } from "./measurements/progress";
import { useInitIntl } from "../locales/i18next";
import { MeasurementHistoryEdit } from "./measurements/history/edit";

const Stack = createNativeStackNavigator<RoutesParamaters>();

const ThemedApp = () => {
    useInitIntl();

    const dispatch = useAppDispatch();
    const { i18n } = useTranslation();
    const isFirstTimeRendered = useAppSelector(getIsFirstTimeRendered);
    const reactNativeTheme = useAppSelector(getReactNativeTheme);

    if (isFirstTimeRendered) {
        dispatch(setEmptyState());

        DeviceInfo.getFirstInstallTime().then((installTime) => {
            const date = new Date(installTime ?? 0).toISOString().split("T")[0];
            dispatch(setAppInstallDate(date as IsoDate));
        });

        const lang = (NativeModules.SettingsManager.settings.AppleLocale as string).split("_")[0];
        if (lang === "de" || lang === "en") {
            void i18n.changeLanguage(lang);
            dispatch(setLanguage(lang));
        } else {
            void i18n.changeLanguage("de");
            dispatch(setLanguage("de"));
        }

        const theme = Appearance.getColorScheme();
        dispatch(setTheme(theme === "dark" ? "dark" : "light"));
        dispatch(setFirstTimeRendered(false));
    }

    return (
        <NavigationContainer theme={reactNativeTheme} ref={navigationRef} independent={true}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ThemeProvider>
                    <RootSiblingParent>
                        <BottomSheetModalProvider>
                            <SafeAreaView background>
                                <Stack.Navigator screenOptions={{ headerShown: false, headerBackButtonMenuEnabled: false }}>
                                    <Stack.Screen component={TabsWrapper} options={{ headerShown: false }} name="tabs" />
                                    <Stack.Screen
                                        component={Train}
                                        options={{ gestureEnabled: false, headerShown: false }}
                                        name="workouts/train/index"
                                    />
                                    <Stack.Screen
                                        component={MeasurementProgress}
                                        options={{ headerShown: false }}
                                        name="measurement/progress/index"
                                    />
                                    <Stack.Screen
                                        component={MeasurementHistoryEdit}
                                        options={{ headerShown: false }}
                                        name="measurements/history/edit/index"
                                    />
                                    <Stack.Screen
                                        component={CreateMeasurement}
                                        options={{ headerShown: false }}
                                        name="measurement/create/index"
                                    />
                                    <Stack.Screen
                                        component={MeasurementHistory}
                                        options={{ headerShown: false }}
                                        name="measurement/history/index"
                                    />
                                    <Stack.Screen
                                        component={Create}
                                        options={{ gestureEnabled: false, headerShown: false }}
                                        name="workouts/create/index"
                                    />
                                    <Stack.Screen
                                        component={WorkoutProgress}
                                        options={{ headerShown: false }}
                                        name="workouts/progress/index"
                                    />
                                    <Stack.Screen
                                        component={WorkoutHistory}
                                        options={{ headerShown: false }}
                                        name="workouts/workoutHistory/index"
                                    />
                                    <Stack.Screen
                                        component={WorkoutHistoryEdit}
                                        options={{ headerShown: false }}
                                        name="workouts/history/edit/index"
                                    />
                                    <Stack.Screen
                                        component={GeneralSettings}
                                        options={{ headerShown: false }}
                                        name="settings/workout/index"
                                    />
                                    <Stack.Screen component={Manual} options={{ headerShown: false }} name="settings/manual/index" />
                                    <Stack.Screen
                                        component={CreateExercise}
                                        options={{ headerShown: false }}
                                        name="workouts/create/exercise/index"
                                    />
                                </Stack.Navigator>
                            </SafeAreaView>
                        </BottomSheetModalProvider>
                    </RootSiblingParent>
                </ThemeProvider>
            </GestureHandlerRootView>
        </NavigationContainer>
    );
};

export default function Root() {
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
