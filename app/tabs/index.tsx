import { TabBarIcon } from "../../components/App/TabBar/TabBarIcon";
import { TabBarButton } from "../../components/App/TabBar/TabBarButton";
import { TabBarLabel } from "../../components/App/TabBar/TabBarLabel";
import React from "react";
import { useTranslation } from "react-i18next";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Progress } from "../progress";
import { Workouts } from "../workouts";
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
          tabBarStyle: { backgroundColor: componentBackgroundColor, borderTopWidth: 0, paddingTop: 5 },
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
          component={Progress}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={"chart-box"} />,
            tabBarLabelStyle: { fontSize: 13 },
            tabBarButton: TabBarButton,
            tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t("progress")} />,
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
