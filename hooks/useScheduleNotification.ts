import { useCallback, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { AppState } from "react-native";
import * as Haptics from "expo-haptics";

type NotificationContent = {
    title: string;
    body: string;
};

export const useScheduleNotification = ({ title, body }: NotificationContent) => {
    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
            handleSuccess: async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            },
        });
    }, []);

    return useCallback(async () => {
        if (AppState.currentState !== "active") {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                },
                trigger: null,
            });
        }
    }, [title, body]);
};
