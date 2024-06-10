import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback, useMemo } from "react";
import { getSwitchToNextExercise } from "../../../../../../store/selectors/settings/settingsSelectors";
import { setSwitchToNextExercise } from "../../../../../../store/reducers/settings";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";
import { useTypedTranslation } from "../../../../../../locales/i18next";
import { TranslationKeys } from "../../../../../../locales/translationKeys";

export const ExercisesSelection = () => {
    const { t } = useTypedTranslation();
    const dispatch = useAppDispatch();
    const switchToNextExercise = useAppSelector(getSwitchToNextExercise);

    const handleSwitchToNextExercise = useCallback(
        (shouldSwitch: boolean) => {
            dispatch(setSwitchToNextExercise(shouldSwitch));
        },
        [dispatch],
    );

    const helpText = useMemo(
        () => ({
            title: t(TranslationKeys.SETTINGS_SWITCH_TO_NEXT_EXERCISE_TITLE),
            text: t(TranslationKeys.SETTINGS_SWITCH_EXERCISES_HELPTEXT),
        }),
        [t],
    );

    return <CheckBox label={helpText.title} helpTextConfig={helpText} size={26} checked={switchToNextExercise} onChecked={handleSwitchToNextExercise} />;
};
