import { useAppDispatch, useAppSelector } from "../../../../../../store";
import React, { useCallback, useMemo } from "react";
import { mutateStopwatchSettings } from "../../../../../../store/reducers/settings";
import { getStartStopwatchOnDoneSet } from "../../../../../../store/selectors/settings/settingsSelectors";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { useTypedTranslation } from "../../../../../../locales/i18next";
import { TranslationKeys } from "../../../../../../locales/translationKeys";

export const StopwatchSelection = () => {
    const { t } = useTypedTranslation();
    const startStopwatchOnDoneSet = useAppSelector(getStartStopwatchOnDoneSet);

    const dispatch = useAppDispatch();

    const handleSelectStartStopwatchOnDoneSet = useCallback(() => {
        dispatch(mutateStopwatchSettings({ key: "startOnDoneSet", value: !startStopwatchOnDoneSet }));
    }, [dispatch, startStopwatchOnDoneSet]);

    const doneSetHelpText = useMemo(
        () => ({
            title: t(TranslationKeys.SETTINGS_STOPWATCH_DONE_SET),
            text: t(TranslationKeys.SETTINGS_STOPWATCH_DONE_SET_HELPTEXT_TEXT),
        }),
        [t],
    );

    return (
        <ThemedView ghost>
            <CheckBox helpTextConfig={doneSetHelpText} label={doneSetHelpText.title} size={26} checked={startStopwatchOnDoneSet} onChecked={handleSelectStartStopwatchOnDoneSet} />
        </ThemedView>
    );
};
