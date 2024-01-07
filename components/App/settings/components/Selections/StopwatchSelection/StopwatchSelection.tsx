import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import React, { useCallback, useMemo } from "react";
import { VStack } from "../../../../../Stack/VStack/VStack";
import { selectionStyles } from "../../selectionStyles";
import { mutateStopwatchSettings } from "../../../../../../store/reducers/settings";
import { getStartStopwatchOnDoneSet, getStartStopwatchOnLastSet, getStopwatchNotify } from "../../../../../../store/reducers/settings/settingsSelectors";
import { ProfileContent } from "../../ProfileContent/ProfileContent";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";
import { useRegisterForPushNotifications } from "../../../../../../hooks/useRegisterForPushNotifications";

type StopwatchSelectionProps = {
    quick?: boolean;
};
export const StopwatchSelection = ({ quick }: StopwatchSelectionProps) => {
    const { t } = useTranslation();
    const startStopwatchOnDoneSet = useAppSelector(getStartStopwatchOnDoneSet);
    const startStopwatchOnLastSet = useAppSelector(getStartStopwatchOnLastSet);
    const notify = useAppSelector(getStopwatchNotify);

    const dispatch = useAppDispatch();
    const requestPermissions = useRegisterForPushNotifications();
    const checked = useMemo(() => {
        if (notify?.allowed) {
            return notify.notify;
        }
        return false;
    }, [notify]);

    const handleSelectStartStopwatchOnDoneSet = useCallback(() => {
        dispatch(mutateStopwatchSettings({ key: "startOnDoneSet", value: !startStopwatchOnDoneSet }));
    }, [dispatch, startStopwatchOnDoneSet]);

    const handleSelectStartStopwatchOnLastSet = useCallback(() => {
        dispatch(mutateStopwatchSettings({ key: "startOnLastSet", value: !startStopwatchOnLastSet }));
    }, [startStopwatchOnLastSet, dispatch]);

    const handleSelectNotification = useCallback(async () => {
        if (!notify?.allowed) {
            const hasPermission = await requestPermissions();
            if (hasPermission) {
                dispatch(mutateStopwatchSettings({ key: "notifications", value: { allowed: true, notify: true } }));
            } else {
                dispatch(mutateStopwatchSettings({ key: "notifications", value: { allowed: false } }));
            }
        } else {
            dispatch(mutateStopwatchSettings({ key: "notifications", value: { allowed: true, notify: !notify.notify } }));
        }
    }, [notify, requestPermissions, dispatch]);

    const doneSetHelpText = useMemo(() => ({ title: t("settings_stopwatch_done_set"), text: t("settings_stopwatch_done_set_helptext_text") }), [t]);
    const lastDoneSetHelpText = useMemo(() => ({ title: t("settings_stopwatch_last_set"), text: t("settings_stopwatch_last_set_helptext_text") }), [t]);
    const notificationHelptext = useMemo(() => ({ title: t("settings_stopwatch_notify"), text: t("settings_notification_help_text") }), [t]);

    return (
        <ProfileContent title={t("settings_stopwatch_title")}>
            <VStack ghost={quick} style={selectionStyles.vStack}>
                <CheckBox
                    snapPoints={["25%"]}
                    helpText={doneSetHelpText}
                    label={t("settings_stopwatch_done_set")}
                    size={26}
                    checked={startStopwatchOnDoneSet}
                    onChecked={handleSelectStartStopwatchOnDoneSet}
                />
                <CheckBox
                    helpText={lastDoneSetHelpText}
                    snapPoints={["25%"]}
                    label={t("settings_stopwatch_last_set")}
                    size={26}
                    checked={startStopwatchOnLastSet}
                    onChecked={handleSelectStartStopwatchOnLastSet}
                />
                <CheckBox helpText={notificationHelptext} snapPoints={["25%"]} label={t("settings_stopwatch_notify")} size={26} checked={checked} onChecked={handleSelectNotification} />
            </VStack>
        </ProfileContent>
    );
};
