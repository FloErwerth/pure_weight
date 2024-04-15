import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback, useMemo } from "react";
import { getUpdatePrefilledWorkoutValues } from "../../../../../../store/selectors/settings/settingsSelectors";
import { setUpdatePrefilledWorkoutValues } from "../../../../../../store/reducers/settings";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";

export const UpdateWorkoutAutomaticallySelection = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const updateAutomatically = useAppSelector(getUpdatePrefilledWorkoutValues);
    const handleSwitchUpdates = useCallback(
        (shouldSwitch: boolean) => {
            dispatch(setUpdatePrefilledWorkoutValues(shouldSwitch));
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

    const title = useMemo(() => t("settings_update_workout_automatically_title"), [t]);

    return <CheckBox label={title} helpTextConfig={helpText} checked={updateAutomatically} onChecked={handleSwitchUpdates} />;
};
