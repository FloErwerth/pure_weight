import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import React, { useCallback, useMemo } from "react";
import { mutateStopwatchSettings } from "../../../../../../store/reducers/settings";
import { getStartStopwatchOnDoneSet } from "../../../../../../store/selectors/settings/settingsSelectors";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";
import { ThemedView } from "../../../../../Themed/ThemedView/View";

export const StopwatchSelection = () => {
    const { t } = useTranslation();
    const startStopwatchOnDoneSet = useAppSelector(getStartStopwatchOnDoneSet);

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
            <CheckBox helpTextConfig={doneSetHelpText} label={t("settings_stopwatch_done_set")} size={26} checked={startStopwatchOnDoneSet} onChecked={handleSelectStartStopwatchOnDoneSet} />
        </ThemedView>
    );
};
