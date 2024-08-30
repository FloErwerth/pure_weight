import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SplashScreen } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Appearance, NativeModules } from "react-native";
import DeviceInfo from "react-native-device-info";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { layoutStyles } from "../components/App/layout/styles";
import { SafeAreaView } from "../components/Themed/ThemedSaveAreaView/SafeAreaView";
import { navigationRef } from "../hooks/navigate";
import { useInitPurchases } from "../hooks/purchases";
import "../locales/i18next";
import { useInitIntl } from "../locales/i18next";
import { persistor, store, useAppDispatch, useAppSelector } from "../store";
import { setAppInstallDate, setEmptyState, setFirstTimeRendered } from "../store/reducers/metadata";
import { setLanguage, setTheme } from "../store/reducers/settings";
import { getIsFirstTimeRendered } from "../store/selectors/metadata/metadataSelectors";
import { getReactNativeTheme } from "../store/selectors/settings/settingsSelectors";
import { ThemeProvider } from "../theme/context";
import { IsoDate } from "../types/date";
import { RoutesParamaters } from "../types/navigation";
import { CreateMeasurement } from "./measurements/create";
import { MeasurementHistory } from "./measurements/history";
import { MeasurementHistoryEdit } from "./measurements/history/edit";
import { MeasurementProgress } from "./measurements/progress";
import { Manual } from "./profile/manual";
import { Settings } from "./profile/settings";
import { Purchase } from "./purchase";
import { TabsWrapper } from "./tabs";
import { Create } from "./workouts/create";
import { CreateExercise } from "./workouts/create/exercise";
import { WorkoutHistory } from "./workouts/history";
import { WorkoutHistoryEdit } from "./workouts/history/exercise_edit";
import { WorkoutHistoryOverview } from "./workouts/history/workout";
import { WorkoutProgress } from "./workouts/progress";
import { Train } from "./workouts/train";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RoutesParamaters>();
const options = { headerShown: false };
const gestureOptions = { ...options, gestureEnabled: false };

const screenOptions = {
            headerShown: false,
            headerBackButtonMenuEnabled: false,
        }


const ThemedApp = () => {
    useInitPurchases();
    useInitIntl();
    const dispatch = useAppDispatch();
    const { i18n } = useTranslation();
    const isFirstTimeRendered = useAppSelector(getIsFirstTimeRendered);
    const reactNativeTheme = useAppSelector(getReactNativeTheme);

    useEffect(() => {
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
    }, []);


    return (
        <NavigationContainer theme={reactNativeTheme} ref={navigationRef} independent={true}>
            <GestureHandlerRootView style={layoutStyles.wrapper}>
                <ThemeProvider>
                    <BottomSheetModalProvider>
                        <SafeAreaView background>
                            <Stack.Navigator screenOptions={screenOptions}>
                                <Stack.Screen component={TabsWrapper} options={options} name="tabs" />
                                <Stack.Screen component={Train} options={gestureOptions} name="workouts/train/index" />
                                <Stack.Screen component={MeasurementProgress} options={options} name="measurement/progress/index" />
                                <Stack.Screen component={MeasurementHistoryEdit} options={options} name="measurements/history/edit/index" />
                                <Stack.Screen component={CreateMeasurement} options={options} name="measurement/create/index" />
                                <Stack.Screen component={MeasurementHistory} options={options} name="measurement/history/index" />
                                <Stack.Screen component={Create} options={gestureOptions} name="workouts/create/index" />
                                <Stack.Screen component={WorkoutProgress} options={options} name="workouts/progress/index" />
                                <Stack.Screen component={WorkoutHistory} options={options} name="workouts/history/index" />
                                <Stack.Screen component={WorkoutHistoryOverview} options={options} name="workouts/history/workout/index" />
                                <Stack.Screen component={WorkoutHistoryEdit} options={options} name="workouts/history/exercise_edit/index" />
                                <Stack.Screen component={Manual} options={options} name="profile/settings/manual/index" />
                                <Stack.Screen component={CreateExercise} options={options} name="workouts/create/exercise/index" />
                                <Stack.Screen component={Purchase} options={options} name="purchase" />
                                <Stack.Screen component={Settings} options={options} name="profile/settings/index" />
                            </Stack.Navigator>
                        </SafeAreaView>
                    </BottomSheetModalProvider>
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
