import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import React, { useCallback, useMemo } from "react";
import { selectionStyles } from "../../selectionStyles";
import { mutateStopwatchSettings } from "../../../../../../store/reducers/settings";
import { getStartStopwatchOnDoneSet, getStopwatchNotify } from "../../../../../../store/reducers/settings/settingsSelectors";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";
import { useRegisterForPushNotifications } from "../../../../../../hooks/useRegisterForPushNotifications";
import { SnapPoint, ThemedBottomSheetModal, useBottomSheetRef } from "../../../../../BottomSheetModal/ThemedBottomSheetModal";
import { WorkoutQuickSettings } from "../../../Sections/workout";
import { SettingsNavigator } from "../../../SettingsNavigator/SettingsNavigator";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { PageContent } from "../../../../../PageContent/PageContent";

type StopwatchSelectionProps = {
    quickSettings?: WorkoutQuickSettings;
};
export const StopwatchSelection = ({ quickSettings }: StopwatchSelectionProps) => {
    const { t } = useTranslation();
    const startStopwatchOnDoneSet = useAppSelector(getStartStopwatchOnDoneSet);
    const notify = useAppSelector(getStopwatchNotify);
    const { ref, openBottomSheet } = useBottomSheetRef();

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

    const doneSetHelpText = useMemo(
        () => ({
            title: t("settings_stopwatch_done_set"),
            text: `${t("settings_stopwatch_done_set_helptext_text")} ${
                quickSettings?.disableStopwatch ? t("settings_stopwatch_last_set_helptext_text_disabled") : ""
            }`,
            snapPoints: [quickSettings?.disableStopwatch ? "35%" : "25%"] as SnapPoint[],
        }),
        [quickSettings?.disableStopwatch, t],
    );

    const notificationHelptext = useMemo(
        () => ({ title: t("settings_stopwatch_notify"), text: t("settings_notification_help_text"), snapPoints: ["25%"] as SnapPoint[] }),
        [t],
    );

    return (
        <ThemedView ghost>
            <SettingsNavigator onPress={openBottomSheet} title={t("settings_stopwatch_title")}></SettingsNavigator>
            <ThemedBottomSheetModal title={t("settings_stopwatch_title")} ref={ref}>
                <PageContent paddingTop={20} ghost style={selectionStyles.vStack}>
                    <CheckBox
                        helpTextConfig={doneSetHelpText}
                        label={t("settings_stopwatch_done_set")}
                        size={26}
                        disabled={quickSettings?.disableStopwatch}
                        checked={startStopwatchOnDoneSet}
                        onChecked={handleSelectStartStopwatchOnDoneSet}
                    />
                    <CheckBox
                        helpTextConfig={notificationHelptext}
                        label={t("settings_stopwatch_notify")}
                        size={26}
                        checked={checked}
                        onChecked={handleSelectNotification}
                    />
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
