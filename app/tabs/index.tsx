import { TabBarIcon } from "../../components/App/TabBar/TabBarIcon";
import { TabBarButton } from "../../components/App/TabBar/TabBarButton";
import { TabBarLabel } from "../../components/App/TabBar/TabBarLabel";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Workouts } from "../workouts";
import { Profile } from "../profile";
import { useTheme } from "../../theme/context";
import { Measurements } from "../measurements";
import { RoutesParamaters } from "../../types/navigation";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";

const Tabs = createBottomTabNavigator<RoutesParamaters>();

export function TabsWrapper() {
    const App = () => {
        const { componentBackgroundColor, secondaryColor, mainColor } = useTheme();
        const { t } = useTypedTranslation();
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
                        tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t(TranslationKeys.WORKOUTS)} />,
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
                        tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t(TranslationKeys.MEASUREMENTS)} />,
                    }}
                    name="tabs/measurements"
                />
                <Tabs.Screen
                    component={Profile}
                    listeners={({ navigation }) => ({
                        blur: () => {
                            navigation.setParams({ scrollIndex: undefined });
                        },
                    })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon="account-settings" />,
                        tabBarLabelStyle: { fontSize: 13 },
                        tabBarLabelPosition: "below-icon",
                        tabBarButton: TabBarButton,
                        tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title={t(TranslationKeys.PROFILE)} />,
                    }}
                    name="tabs/profile"
                />
            </Tabs.Navigator>
        );
    };
    return App();
}
