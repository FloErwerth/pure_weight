import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback, useMemo } from "react";
import { getUpdatePrefilledWorkoutValues } from "../../../../../../store/selectors/settings/settingsSelectors";
import { setSwitchToNextExercise } from "../../../../../../store/reducers/settings";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";

export const UpdateWorkoutAutomaticallySelection = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const updateAutomatically = useAppSelector(getUpdatePrefilledWorkoutValues);

    const handleSwitchUpdates = useCallback(
        (shouldSwitch: boolean) => {
            dispatch(setSwitchToNextExercise(shouldSwitch));
        },
        [dispatch],
    );

    const helpText = useMemo(
        () => ({
            title: t("settings_update_workout_automatically_title"),
            text: t("settings_update_workout_automatically_helptext"),
        }),
        [t],
    );

    return (
        <CheckBox
            label={t("settings_update_workout_automatically_title")}
            helpTextConfig={helpText}
            size={26}
            checked={updateAutomatically}
            onChecked={handleSwitchUpdates}
        />
    );
};
