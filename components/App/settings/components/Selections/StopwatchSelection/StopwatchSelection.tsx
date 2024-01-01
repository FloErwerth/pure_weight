import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback, useMemo } from "react";
import { VStack } from "../../../../../Stack/VStack/VStack";
import { selectionStyles } from "../../selectionStyles";
import { setStopwatchSettings } from "../../../../../../store/reducers/settings";
import { getStartStopwatchOnDoneSet, getStartStopwatchOnLastSet } from "../../../../../../store/reducers/settings/settingsSelectors";
import { ProfileContent } from "../../ProfileContent/ProfileContent";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";

export const StopwatchSelection = () => {
    const { t } = useTranslation();
    const startStopwatchOnDoneSet = useAppSelector(getStartStopwatchOnDoneSet);
    const startStopwatchOnLastSet = useAppSelector(getStartStopwatchOnLastSet);
    const dispatch = useAppDispatch();

    const handleSelectStartStopwatchOnDoneSet = useCallback(() => {
        dispatch(setStopwatchSettings({ startOnDoneSet: !startStopwatchOnDoneSet }));
    }, [dispatch, startStopwatchOnDoneSet]);

    const handleSelectStartStopwatchOnLastSet = useCallback(() => {
        dispatch(setStopwatchSettings({ startOnLastSet: !startStopwatchOnLastSet }));
    }, [startStopwatchOnLastSet, dispatch]);

    const doneSetHelpText = useMemo(() => ({ title: t("settings_stopwatch_done_set"), text: t("settings_stopwatch_done_set_helptext_text") }), [t]);
    const lastDoneSetHelpText = useMemo(() => ({ title: t("settings_stopwatch_last_set"), text: t("settings_stopwatch_last_set_helptext_text") }), [t]);

    return (
        <ProfileContent title={t("settings_stopwatch_title")}>
            <VStack style={selectionStyles.vStack}>
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
            </VStack>
        </ProfileContent>
    );
};
