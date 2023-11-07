import { TabBarIcon } from "../../components/App/TabBar/TabBarIcon";
import { TabBarButton } from "../../components/App/TabBar/TabBarButton";
import { TabBarLabel } from "../../components/App/TabBar/TabBarLabel";
import React from "react";
import { useTranslation } from "react-i18next";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Workouts } from "../workouts";
import { Measurements } from "../measurements";
import { Profile } from "../profile";
import { useTheme } from "../../theme/context";

const Tabs = createBottomTabNavigator();

export function TabsWrapper() {
  const App = () => {
    const { componentBackgroundColor, secondaryColor, mainColor } = useTheme();
    const { t } = useTranslation();
    return (
      <Tabs.Navigator
        initialRouteName="workouts"
        screenOptions={{
          tabBarStyle: { backgroundColor: componentBackgroundColor, borderTopWidth: 0, paddingTop: 5, height: 80, zIndex: 1 },
        }}
      >
        <Tabs.Screen
          component={Workouts}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={"weight-lifter"} />,
            tabBarLabelStyle: { fontSize: 13 },
            tabBarButton: TabBarButton,
            tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t("workouts")} />,
            tabBarActiveTintColor: mainColor,
            tabBarInactiveTintColor: secondaryColor,
          }}
          name="workouts"
        />
        <Tabs.Screen
          component={Measurements}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={"ruler"} />,
            tabBarLabelStyle: { fontSize: 13 },
            tabBarButton: TabBarButton,
            tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t("measurements")} />,
          }}
          name="progress"
        />
        <Tabs.Screen
          component={Profile}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={"account-circle"} />,
            tabBarLabelStyle: { fontSize: 13 },
            tabBarButton: TabBarButton,
            tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t("profile")} />,
          }}
          name="settings"
        />
      </Tabs.Navigator>
    );
  };
  return App();
}
