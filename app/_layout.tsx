import { Tabs } from "expo-router";
import { persistor, store } from "../store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { mainColor, secondaryColor, textFieldBackgroundColor } from "./theme/colors";
import ProgressIcon from "../media/icons/ProgressIcon.svg";

export default function index() {
  const App = () => {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Tabs screenOptions={{ tabBarStyle: { backgroundColor: textFieldBackgroundColor } }}>
            <Tabs.Screen
              options={{
                headerShown: false,
                title: "Workouts",
                tabBarIcon: ({ focused }) => <MaterialCommunityIcons name="weight-lifter" size={16} color={focused ? mainColor : secondaryColor} />,
                tabBarLabelStyle: { fontSize: 13 },
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
                title: "Progress",
                tabBarIcon: ({ focused }) => <ProgressIcon width={16} height={16} fill={focused ? mainColor : secondaryColor} />,
                tabBarLabelStyle: { fontSize: 13 },
                tabBarActiveTintColor: mainColor,
                tabBarInactiveTintColor: secondaryColor,
              }}
              name="progress"
            />
            <Tabs.Screen
              options={{
                headerShown: false,
                title: "Settings",
                tabBarIcon: ({ focused }) => <MaterialCommunityIcons name="cog" size={16} color={focused ? mainColor : secondaryColor} />,
                tabBarLabelStyle: { fontSize: 13 },
                tabBarActiveTintColor: mainColor,
                tabBarInactiveTintColor: secondaryColor,
              }}
              name="settings/index"
            />
            <Tabs.Screen options={{ headerShown: false, href: null }} name="train/index" />
          </Tabs>
        </PersistGate>
      </Provider>
    );
  };

  return App();
}
