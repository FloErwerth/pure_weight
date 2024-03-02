import { TabBarIcon } from "../../components/App/TabBar/TabBarIcon";
import { TabBarButton } from "../../components/App/TabBar/TabBarButton";
import { TabBarLabel } from "../../components/App/TabBar/TabBarLabel";
import React from "react";
import { useTranslation } from "react-i18next";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Workouts } from "../workouts";
import { Settings } from "../settings";
import { useTheme } from "../../theme/context";
import { RoutesParamaters } from "../../hooks/navigate";
import { Measurements } from "../measurements";

const Tabs = createBottomTabNavigator<RoutesParamaters>();

export function TabsWrapper() {
    const App = () => {
        const { componentBackgroundColor, secondaryColor, mainColor } = useTheme();
        const { t } = useTranslation();
        return (
            <Tabs.Navigator
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: componentBackgroundColor,
                        borderTopWidth: 0,
                        paddingTop: 5,
                        height: 80,
                        zIndex: 1,
                    },
                }}>
                <Tabs.Screen
                    component={Workouts}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={"weight-lifter"} />,
                        tabBarButton: TabBarButton,
                        tabBarLabelPosition: "below-icon",
                        tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t("workouts")} />,
                        tabBarActiveTintColor: mainColor,
                        tabBarInactiveTintColor: secondaryColor,
                    }}
                    name="tabs/workouts"
                />
                <Tabs.Screen
                    component={Measurements}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={"ruler"} />,
                        tabBarLabelStyle: { fontSize: 13 },
                        tabBarLabelPosition: "below-icon",
                        tabBarButton: TabBarButton,
                        tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t("measurements")} />,
                    }}
                    name="tabs/measurements"
                />
                <Tabs.Screen
                    component={Settings}
                    listeners={({ navigation }) => ({
                        blur: () => {
                            navigation.setParams({ scrollIndex: undefined });
                        },
                    })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={"cog"} />,
                        tabBarLabelStyle: { fontSize: 13 },
                        tabBarLabelPosition: "below-icon",
                        tabBarButton: TabBarButton,
                        tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t("settings")} />,
                    }}
                    name="tabs/settings"
                />
            </Tabs.Navigator>
        );
    };
    return App();
}
