import { Tabs } from "expo-router";
import { persistor, store, useAppDispatch } from "../store";
import React, { useEffect } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { componentBackgroundColor, mainColor, secondaryColor } from "../components/App/theme/colors";
import ProgressIcon from "../media/icons/ProgressIcon.svg";
import CogIcon from "../media/icons/CogIcon.svg";
import Weightlifter from "../media/icons/Weightlifter.svg";
import { TabBarButton } from "../components/App/TabBar/TabBarButton";
import { TabBarIcon } from "../components/App/TabBar/TabBarIcon";
import { TabBarLabel } from "../components/App/TabBar/TabBarLabel";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import "../locales/i18next";
import * as Locale from "expo-localization";
import { setLanguage } from "../store/reducer";

export default function index() {
  const App = () => {
    const language = store.getState().settings.language ?? Locale.getLocales()[0].languageCode ?? "de";
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();

    useEffect(() => {
      dispatch(setLanguage(language as "en" | "de"));
      i18n.changeLanguage(language);
    }, [dispatch, i18n, language]);

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Tabs screenOptions={{ tabBarStyle: { backgroundColor: componentBackgroundColor, borderTopWidth: 0 } }}>
              <Tabs.Screen
                options={{
                  headerShown: false,
                  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={Weightlifter} />,
                  tabBarLabelStyle: { fontSize: 13 },
                  tabBarButton: TabBarButton,
                  tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t("workouts")} />,
                  tabBarActiveTintColor: mainColor,
                  tabBarInactiveTintColor: secondaryColor,
                }}
                name="index/index"
              />
              <Tabs.Screen
                options={{
                  headerShown: false,
                  href: null,
                }}
                name="create/index"
              />
              <Tabs.Screen
                options={{
                  headerShown: false,
                  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={ProgressIcon} />,
                  tabBarLabelStyle: { fontSize: 13 },
                  tabBarButton: TabBarButton,
                  tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t("progress")} />,
                }}
                name="progress"
              />
              <Tabs.Screen
                options={{
                  headerShown: false,
                  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={CogIcon} />,
                  tabBarLabelStyle: { fontSize: 13 },
                  tabBarButton: TabBarButton,
                  tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t("settings")} />,
                }}
                name="settings/index"
              />
              <Tabs.Screen options={{ tabBarStyle: { display: "none" }, headerShown: false, href: null }} name="train/index" />
            </Tabs>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    );
  };

  return App();
}
