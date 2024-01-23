import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { selectionStyles } from "../../selectionStyles";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { getKeepAwake } from "../../../../../../store/reducers/settings/settingsSelectors";
import { setKeepAwake } from "../../../../../../store/reducers/settings";
import { useTranslation } from "react-i18next";
import { ProfileContent } from "../../ProfileContent/ProfileContent";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";

export const KeepAwakeSelection = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const awake = useAppSelector(getKeepAwake);
    const handleSelectAwake = useCallback(
        (awake: boolean) => {
            dispatch(setKeepAwake(awake));
        },
        [dispatch],
    );

    const helpText = { title: t("settings_keep_awake"), text: t("settings_keep_awake_helptext_text") };

    return (
        <ProfileContent title={t("settings_keep_awake_title")}>
            <ThemedView style={selectionStyles.vStack}>
                <CheckBox input snapPoints={["35%"]} helpText={helpText} label={t("settings_keep_awake")} size={26} checked={awake} onChecked={(awake) => handleSelectAwake(awake)} />
            </ThemedView>
        </ProfileContent>
    );
};
