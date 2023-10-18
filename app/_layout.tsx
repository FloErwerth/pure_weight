import { Tabs } from "expo-router";
import { persistor, store } from "../store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { componentBackgroundColor, mainColor, secondaryColor } from "./theme/colors";
import ProgressIcon from "../media/icons/ProgressIcon.svg";
import CogIcon from "../media/icons/CogIcon.svg";
import Weightlifter from "../media/icons/Weightlifter.svg";
import { TabBarButton } from "./components/TabBar/TabBarButton";
import { TabBarIcon } from "./components/TabBar/TabBarIcon";
import { TabBarLabel } from "./components/TabBar/TabBarLabel";

export default function index() {
  const App = () => {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Tabs screenOptions={{ tabBarStyle: { backgroundColor: componentBackgroundColor, borderTopWidth: 0 } }}>
            <Tabs.Screen
              options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={Weightlifter} />,
                tabBarLabelStyle: { fontSize: 13 },
                tabBarButton: TabBarButton,
                tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title="Workouts" />,
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
                tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title="Progress" />,
              }}
              name="progress"
            />
            <Tabs.Screen
              options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={CogIcon} />,
                tabBarLabelStyle: { fontSize: 13 },
                tabBarButton: TabBarButton,
                tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title="Settings" />,
              }}
              name="settings/index"
            />
            <Tabs.Screen options={{ tabBarStyle: { display: "none" }, headerShown: false, href: null }} name="train/index" />
          </Tabs>
        </PersistGate>
      </Provider>
    );
  };

  return App();
}
