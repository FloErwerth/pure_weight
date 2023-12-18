import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback } from "react";
import { ProfileContent } from "../../SettingsSection/SettingsNavigator";
import { VStack } from "../../../../../Stack/VStack/VStack";
import { selectionStyles } from "../../selectionStyles";
import { setStopwatchSettings } from "../../../../../../store/reducers/settings";
import { getStartStopwatchOnDoneSet, getStartStopwatchOnLastSet } from "../../../../../../store/reducers/settings/settingsSelectors";
import { SelectableSetting } from "../../../SelectableSetting/SelectableSetting";

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

    return (
        <ProfileContent title={t("settings_stopwatch_title")}>
            <VStack style={selectionStyles.vStack}>
                <SelectableSetting
                    position={startStopwatchOnDoneSet ? "TOP" : undefined}
                    onSelect={handleSelectStartStopwatchOnDoneSet}
                    selected={startStopwatchOnDoneSet}
                    titleKey="settings_stopwatch_done_set"
                />
                {startStopwatchOnDoneSet && (
                    <SelectableSetting position="BOTTOM" onSelect={handleSelectStartStopwatchOnLastSet} selected={startStopwatchOnLastSet} titleKey="settings_stopwatch_last_set" />
                )}
            </VStack>
        </ProfileContent>
    );
};
