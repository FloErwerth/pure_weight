import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback, useMemo } from "react";
import { getUpdatePrefilledWorkoutValues } from "../../../../../../store/selectors/settings/settingsSelectors";
import { setUpdatePrefilledWorkoutValues } from "../../../../../../store/reducers/settings";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";
import { useTypedTranslation } from "../../../../../../locales/i18next";
import { TranslationKeys } from "../../../../../../locales/translationKeys";

export const UpdateWorkoutAutomaticallySelection = () => {
    const { t } = useTypedTranslation();
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
            title: t(TranslationKeys.SETTINGS_UPDATE_WORKOUT_AUTOMATICALLY_TITLE),
            text: t(TranslationKeys.SETTINGS_UPDATE_WORKOUT_AUTOMATICALLY_HELPTEXT_TEXT),
        }),
        [t],
    );

    return <CheckBox label={helpText.title} helpTextConfig={helpText} checked={updateAutomatically} onChecked={handleSwitchUpdates} />;
};
