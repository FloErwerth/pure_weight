import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback, useMemo } from "react";
import { ProfileContent } from "../../ProfileContent/ProfileContent";
import { getSwitchToNextExercise } from "../../../../../../store/reducers/settings/settingsSelectors";
import { setSwitchToNextExercise } from "../../../../../../store/reducers/settings";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";
import { SnapPoint } from "../../../../../BottomSheetModal/ThemedBottomSheetModal";

type SwitchToNextExerciseSelectionProps = {
    quick?: boolean;
};
export const ExercisesSelection = ({ quick }: SwitchToNextExerciseSelectionProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const switchToNextExercise = useAppSelector(getSwitchToNextExercise);

    const handleSwitchToNextExercise = useCallback(
        (shouldSwitch: boolean) => {
            dispatch(setSwitchToNextExercise(shouldSwitch));
        },
        [dispatch],
    );

    const helpText = useMemo(() => ({ title: t("settings_switch_to_next_exercise_title"), text: t("settings_switch_exercises_helptext"), snapPoints: ["25%"] as SnapPoint[] }), [t]);

    return (
        <ProfileContent title={t("settings_exercises_title")}>
            <CheckBox input label={t("settings_switch_to_next_exercise_title")} helpTextConfig={helpText} size={26} checked={switchToNextExercise} onChecked={handleSwitchToNextExercise} />
        </ProfileContent>
    );
};
