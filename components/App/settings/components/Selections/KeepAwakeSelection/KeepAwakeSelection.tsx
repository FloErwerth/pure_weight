import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { selectionStyles } from "../../selectionStyles";
import { Icon, SelectableSetting } from "../../../SelectableSetting/SelectableSetting";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { getKeepAwake } from "../../../../../../store/reducers/settings/settingsSelectors";
import { setKeepAwake } from "../../../../../../store/reducers/settings";
import { useTranslation } from "react-i18next";
import { ProfileContent } from "../../ProfileContent/ProfileContent";

const awakeIcon: Icon = {
    name: "lightbulb-on",
    size: 24,
} as const;

const notAwakeIcon: Icon = {
    name: "sleep",
    size: 24,
} as const;
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

    return (
        <ProfileContent title={t("settings_keep_awake_title")}>
            <ThemedView style={selectionStyles.vStack}>
                <SelectableSetting position="TOP" prependedExtraContent={awakeIcon} selected={awake} onSelect={() => handleSelectAwake(true)} titleKey="settings_keep_awake" />
                <SelectableSetting position="BOTTOM" prependedExtraContent={notAwakeIcon} selected={!awake} onSelect={() => handleSelectAwake(false)} titleKey="settings_keep_not_awake" />
            </ThemedView>
        </ProfileContent>
    );
};
