import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import React, { useCallback, useMemo } from "react";
import { selectionStyles } from "../../selectionStyles";
import { mutateStopwatchSettings } from "../../../../../../store/reducers/settings";
import { getStartStopwatchOnDoneSet } from "../../../../../../store/reducers/settings/settingsSelectors";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../../BottomSheetModal/ThemedBottomSheetModal";
import { SettingsNavigator } from "../../../SettingsNavigator/SettingsNavigator";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { PageContent } from "../../../../../PageContent/PageContent";

export const StopwatchSelection = () => {
    const { t } = useTranslation();
    const startStopwatchOnDoneSet = useAppSelector(getStartStopwatchOnDoneSet);
    const { ref, openBottomSheet } = useBottomSheetRef();

    const dispatch = useAppDispatch();

    const handleSelectStartStopwatchOnDoneSet = useCallback(() => {
        dispatch(mutateStopwatchSettings({ key: "startOnDoneSet", value: !startStopwatchOnDoneSet }));
    }, [dispatch, startStopwatchOnDoneSet]);

    const doneSetHelpText = useMemo(
        () => ({
            title: t("settings_stopwatch_done_set"),
            text: t("settings_stopwatch_done_set_helptext_text"),
        }),
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
                        checked={startStopwatchOnDoneSet}
                        onChecked={handleSelectStartStopwatchOnDoneSet}
                    />
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
