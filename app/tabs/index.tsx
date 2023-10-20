import { componentBackgroundColor, mainColor, secondaryColor } from "../../components/App/theme/colors";
import { TabBarIcon } from "../../components/App/TabBar/TabBarIcon";
import Weightlifter from "../../media/icons/Weightlifter.svg";
import { TabBarButton } from "../../components/App/TabBar/TabBarButton";
import { TabBarLabel } from "../../components/App/TabBar/TabBarLabel";
import ProgressIcon from "../../media/icons/ProgressIcon.svg";
import CogIcon from "../../media/icons/CogIcon.svg";
import React from "react";
import { useTranslation } from "react-i18next";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Progress } from "../progress";
import { Workouts } from "../workouts";
import { Settings } from "../settings";

const Tabs = createBottomTabNavigator();

export function TabsWrapper() {
  const App = () => {
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
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={Weightlifter} />,
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
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={ProgressIcon} />,
            tabBarLabelStyle: { fontSize: 13 },
            tabBarButton: TabBarButton,
            tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t("progress")} />,
          }}
          name="progress"
        />
        <Tabs.Screen
          component={Settings}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={CogIcon} />,
            tabBarLabelStyle: { fontSize: 13 },
            tabBarButton: TabBarButton,
            tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t("settings")} />,
          }}
          name="settings"
        />
      </Tabs.Navigator>
    );
  };
  return App();
}
