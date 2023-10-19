import { Tabs } from "expo-router";
import { persistor, store } from "../store";
import React from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

export default function index() {
  const App = () => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingLeft: insets.left, paddingTop: insets.top, paddingRight: insets.right }}>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <Tabs
                screenOptions={{
                  tabBarStyle: { backgroundColor: componentBackgroundColor, borderTopWidth: 0, paddingTop: 5 },
                }}
              >
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
                  name="index"
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
                  name="settings"
                />
              </Tabs>
            </PersistGate>
          </Provider>
        </View>
      </GestureHandlerRootView>
    );
  };

  return App();
}
