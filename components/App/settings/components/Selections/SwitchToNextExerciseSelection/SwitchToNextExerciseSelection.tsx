import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback } from "react";
import { Icon, SelectableSetting } from "../../../SelectableSetting/SelectableSetting";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { selectionStyles } from "../../selectionStyles";
import { ProfileContent } from "../../ProfileContent/ProfileContent";
import { getSwitchToNextExercise } from "../../../../../../store/reducers/settings/settingsSelectors";
import { setSwitchToNextExercise } from "../../../../../../store/reducers/settings";

const dark: Icon = {
    name: "weather-night",
    size: 24,
};

const light: Icon = {
    name: "weather-sunny",
    size: 24,
};
const device: Icon = {
    name: "theme-light-dark",
    size: 24,
};

export const SwitchToNextExerciseSelection = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const switchToNextExercise = useAppSelector(getSwitchToNextExercise);

    const handleSwitchToNextExercise = useCallback(
        (shouldSwitch: boolean) => {
            dispatch(setSwitchToNextExercise(shouldSwitch));
        },
        [dispatch],
    );

    return (
        <ProfileContent title={t("settings_switch_to_next_exercise_title")}>
            <ThemedView style={selectionStyles.vStack}>
                <SelectableSetting position="TOP" selected={switchToNextExercise} onSelect={() => handleSwitchToNextExercise(true)} titleKey="settings_switch_to_next_exercise_true" />
                <SelectableSetting position="BOTTOM" selected={!switchToNextExercise} onSelect={() => handleSwitchToNextExercise(false)} titleKey="settings_switch_to_next_exercise_false" />
            </ThemedView>
        </ProfileContent>
    );
};
